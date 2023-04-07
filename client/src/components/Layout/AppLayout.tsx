import React, { ReactElement } from 'react';
import L from './Layout.styles';

function AppLayout({ children }: { children: ReactElement }): ReactElement {
  return <L.Container>{children}</L.Container>;
}

export default AppLayout;
