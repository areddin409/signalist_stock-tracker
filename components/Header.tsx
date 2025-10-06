import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import NavItems from './NavItems';
import UserDropdown from './UserDropdown';

const Header = ({ user }: { user: User }) => {
  return (
    <header className='sticky top-0 header'>
      <div className='container header-wrapper'>
        <Link href='/' className='text-2xl font-bold'>
          <Image
            src='/assets/icons/logo.svg'
            alt='Logo'
            width={140}
            height={32}
            className='h-8 cursor-pointer'
            style={{ width: 'auto' }}
          />
        </Link>
        <nav className='hidden sm:block'>
          <NavItems />
        </nav>

        <UserDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
