import React from 'react';
import SignupLayout from '../components/Layout/SignupLayout';
import LogoHeader from '../components/LogoHeader/LogoHeader';
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
