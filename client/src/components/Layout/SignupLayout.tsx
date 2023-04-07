import React from 'react';
import { ReactElement } from 'react';
import L from './Layout.styles';

function SignupLayout({ children }: { children: ReactElement }) {
  return <L.SignupLayoutWrapper>{children}</L.SignupLayoutWrapper>;
}

export default SignupLayout;
