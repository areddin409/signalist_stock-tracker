'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import { EMAIL_VALIDATION_PATTERN } from '@/lib/constants';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { authClient } from '@/lib/better-auth/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) router.push('/');
    } catch (e) {
      console.error(e);
      toast.error('Sign in failed', {
        description: e instanceof Error ? e.message : 'Failed to sign in.',
      });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
      });
    } catch (e) {
      console.error(e);
      toast.error('Google Sign in failed', {
        description:
          e instanceof Error ? e.message : 'Failed to sign in with Google.',
      });
    }
  };

  return (
    <div className=''>
      <div className=''>
        <h1 className='form-title'>Welcome back</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <InputField
            name='email'
            label='Email'
            type='email'
            placeholder='contact@jsmastery.com'
            register={register}
            error={errors.email}
            validation={{
              required: 'Email is required',
              pattern: EMAIL_VALIDATION_PATTERN,
            }}
          />

          <InputField
            name='password'
            label='Password'
            placeholder='Enter your password'
            type='password'
            register={register}
            error={errors.password}
            validation={{ required: 'Password is required', minLength: 8 }}
          />

          <Button
            type='submit'
            disabled={isSubmitting}
            className='yellow-btn w-full mt-5'
          >
            {isSubmitting ? 'Signing In' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className=' px-2 text-muted-foreground'>Or</span>
            </div>
          </div>

          <Button
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
            onClick={handleSignInWithGoogle}
            disabled={isSubmitting}
          >
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              alt='Google logo'
              className='w-5 h-5'
            />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
