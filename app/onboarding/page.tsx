'use client';

import { CountrySelectField } from '@/components/forms/CountrySelectField';
import SelectField from '@/components/forms/SelectField';
import { Button } from '@/components/ui/button';
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from '@/lib/constants';
import { saveUserPreferences } from '@/lib/actions/preferences.actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface OnboardingFormData {
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

const OnboardingPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const result = await saveUserPreferences(data);

      if (result.success) {
        toast.success('Preferences saved successfully!');
        router.push('/');
      } else {
        toast.error('Failed to save preferences', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences', {
        description: 'Please try again',
      });
    }
  };

  return (
    <main className='auth-layout'>
      <section className='auth-left-section scrollbar-hide-default'>
        <Link href='/' className='auth-logo'>
          <Image
            src='/assets/icons/logo.svg'
            alt='Signalist logo'
            width={140}
            height={32}
            className='h-8 w-auto'
          />
        </Link>

        <div className='pb-6 lg:pb-8 flex-1'>
          <h1 className='form-title'>Complete Your Profile</h1>
          <p className='text-gray-400 mb-8'>
            Help us personalize your investment experience
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <CountrySelectField
              name='country'
              label='Country'
              control={control}
              error={errors.country}
              required
            />

            <SelectField
              name='investmentGoals'
              label='Investment Goals'
              placeholder='Select your investment goal'
              options={INVESTMENT_GOALS}
              control={control}
              error={errors.investmentGoals}
              required
            />

            <SelectField
              name='riskTolerance'
              label='Risk Tolerance'
              placeholder='Select your risk level'
              options={RISK_TOLERANCE_OPTIONS}
              control={control}
              error={errors.riskTolerance}
              required
            />

            <SelectField
              name='preferredIndustry'
              label='Preferred Industry'
              placeholder='Select your preferred industry'
              options={PREFERRED_INDUSTRIES}
              control={control}
              error={errors.preferredIndustry}
              required
            />

            <Button
              type='submit'
              disabled={isSubmitting}
              className='yellow-btn w-full mt-5'
            >
              {isSubmitting
                ? 'Saving preferences...'
                : 'Start Your Investment Journey'}
            </Button>
          </form>
        </div>
      </section>

      <section className='auth-right-section'>
        <div className='z-10 relative lg:mt-4 lg:mb-16'>
          <blockquote className='auth-blockquote'>
            "Personalized insights help me make smarter investment decisions.
            The custom watchlists and risk assessments have transformed my
            trading strategy."
          </blockquote>
          <cite className='auth-testimonial-author'>
            - Sarah Chen, Professional Trader
          </cite>
        </div>

        <Image
          src='/assets/images/dashboard-preview.png'
          alt='Signalist Dashboard Preview'
          width={1024}
          height={600}
          className='auth-dashboard-preview'
        />
      </section>
    </main>
  );
};

export default OnboardingPage;
