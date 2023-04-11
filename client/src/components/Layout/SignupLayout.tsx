import React from 'react';
import { ReactElement } from 'react';
import L from './Layout.styles';

function SignupLayout({ children }: { children: ReactElement }) {
  return <L.LayoutWrapper>{children}</L.LayoutWrapper>;
}

export default SignupLayout;
