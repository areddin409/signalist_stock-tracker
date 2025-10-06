import { getAllUsersForNewsEmail } from '../actions/user.actions';
import { getWatchlistSymbolsByEmail } from '../actions/watchlist.actions';
import { getNews } from '../actions/finnhub.actions';
import { sendNewsSummaryEmail, sendWelcomeEmail } from '../nodemailer';
import { inngest } from './client';
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from './prompts';
import { formatDateToday } from '../utils';

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const userProfile = `
			- Country: ${event.data.country || 'N/A'}
			- Investment Goals: ${event.data.investmentGoals || 'N/A'}
			- Risk Tolerance: ${event.data.riskTolerance || 'N/A'}
			- Preferred Industry: ${event.data.preferredIndustry || 'N/A'}
		`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      '{{userProfile}}',
      userProfile
    );

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({
        model: 'gemini-2.5-flash-lite-preview-06-17',
      }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0].content?.parts?.[0];
      const introText =
        (part && 'text' in part ? part.text : null) ||
        'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves!';

      const {
        data: { email, name },
      } = event;
      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'daily-news-summary' },
  [{ event: 'app/send.daily.news' }, { cron: '0 12 * * *' }], // Runs every day at 12:00 PM (noon) UTC - Cron format: minute(0) hour(12) day(*) month(*) weekday(*)
  async ({ step }) => {
    // Step 1: get all users for news delivery
    const users = await step.run('get-all-users', getAllUsersForNewsEmail);

    if (!users || users.length === 0) {
      return { success: false, message: 'No users found for news delivery' };
    }

    // Step 2: Fetch personalized news for each user
    const newsData = await step.run('fetch-news-for-users', async () => {
      const userNewsPromises = users.map(async user => {
        // Get user's watchlist symbols
        const symbols = await getWatchlistSymbolsByEmail(user.email);

        // Fetch news based on watchlist or general news if no watchlist
        let news: MarketNewsArticle[] = [];
        try {
          if (symbols.length > 0) {
            news = await getNews(symbols);
          } else {
            news = await getNews();
          }
        } catch (error) {
          console.error(`Error fetching news for user ${user.email}:`, error);
          news = [];
        }

        return {
          user,
          symbols,
          news: news.slice(0, 6), // Max 6 articles per user
        };
      });

      return await Promise.all(userNewsPromises);
    });

    // Step 3: Summarize the news via AI for each user
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

    for (const { user, news } of newsData) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          '{{newsItems}}',
          JSON.stringify(news, null, 2)
        );
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({
            model: 'gemini-2.5-flash-lite-preview-06-17',
          }),
          body: {
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
          },
        });

        const part = response.candidates?.[0].content?.parts?.[0];
        const newsContent =
          (part && 'text' in part ? part.text : null) ||
          'No Market News Available Today.';

        userNewsSummaries.push({ user, newsContent });
      } catch (error) {
        console.error(`Error summarizing news for user: ${user.email}:`, error);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // Step 4: Send emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) {
            console.log(`No news content to send for user: ${user.email}`);
            return false;
          }

          await sendNewsSummaryEmail({
            email: user.email,
            date: formatDateToday,
            newsContent,
          });
        })
      );
    });

    return { success: true, message: 'News summary emails sent successfully' };
  }
);
