import { useRouter } from 'next/router';
import React from 'react';
import { authMeAPI } from '../apis/auth';
import SignupLayout from '../components/Layout/SignupLayout';
import LogoHeader from '../components/LogoHeader/LogoHeader';
import Login from '../components/Signup/Login';

function LogIn() {
  return (
    <SignupLayout>
      <>
        <LogoHeader headerIcons={false} />
        <Login />
      </>
    </SignupLayout>
  );
}

export default LogIn;
