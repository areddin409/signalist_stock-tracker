'use client';

import { usePathname } from 'next/navigation';
import FooterLink from '@/components/forms/FooterLink';

const AuthFooter = () => {
  const pathname = usePathname();
  
  const isSignUpPage = pathname === '/sign-up';
  const isSignInPage = pathname === '/sign-in';

  return (
    <div className='mb-4'>
      {isSignInPage && (
        <FooterLink
          text="Don't have an account?"
          linkText='Create an account'
          href='/sign-up'
        />
      )}
      {isSignUpPage && (
        <FooterLink
          text='Already have an account?'
          linkText='Sign In'
          href='/sign-in'
        />
      )}
    </div>
  );
};

export default AuthFooter;