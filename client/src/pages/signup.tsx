import React from 'react';
import SignupLayout from '../components/Layout/SignupLayout';
import LogoHeader from '../components/Header/LogoHeader';
import Signup from '../components/Signup/Signup';

function SignUp() {
  return (
    <SignupLayout>
      <>
        <LogoHeader headerIcons={false} />
        <Signup />
      </>
    </SignupLayout>
  );
}

export default SignUp;
