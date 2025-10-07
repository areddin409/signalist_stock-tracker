'use server';

import { inngest } from '@/lib/inngest/client';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

interface UserPreferences {
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

export const saveUserPreferences = async (preferences: UserPreferences) => {
  try {
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return { success: false, error: 'User not authenticated' };
    }

    // Send preferences to Inngest for processing
    await inngest.send({
      name: 'app/user.preferences.updated',
      data: {
        email: session.user.email,
        name: session.user.name,
        ...preferences,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return { success: false, error: 'Failed to save preferences' };
  }
};
