import '../styles/globals.css';

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import localFont from '@next/font/local';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import AppLayout from '../components/Layout/AppLayout';
import Head from 'next/head';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';
import { axiosInstance, baseURL } from '../configs/axios';

const pretendard = localFont({
  src: [
    { path: '../../public/font/Pretendard-Thin.woff2', weight: '100' },
    { path: '../../public/font/Pretendard-ExtraLight.woff2', weight: '200' },
    { path: '../../public/font/Pretendard-Light.woff2', weight: '300' },
    { path: '../../public/font/Pretendard-Regular.woff2', weight: '400' },
    { path: '../../public/font/Pretendard-Medium.woff2', weight: '500' },
    { path: '../../public/font/Pretendard-SemiBold.woff2', weight: '600' },
    { path: '../../public/font/Pretendard-Bold.woff2', weight: '700' },
    { path: '../../public/font/Pretendard-ExtraBold.woff2', weight: '800' },
    { path: '../../public/font/Pretendard-Black.woff2', weight: '900' },
  ],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    'sans-serif',
  ],
});

const GlobalStyle = createGlobalStyle`
  * {
  font-family: ${pretendard.style.fontFamily};
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const [cookie] = useCookies(['inplace']);

  useEffect(() => {
    if (cookie?.inplace) {
      const fetchUserInfo = async () => {
        const { data } = await axiosInstance.get(`${baseURL}/auth/me`);
        // console.log('data>>>', data);
        setUserInfo(data);
      };

      fetchUserInfo();
    }
  }, [cookie?.inplace]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps?.dehydratedState}>
        <GlobalStyle />
        {process.env.NODE_ENV !== 'production' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
        <ThemeProvider theme={theme}>
          <Head>
            <title>인플레이스</title>
            <meta name="title" content="인플레이스" />
          </Head>
          <AppLayout>
            <main>
              <Component {...pageProps} />
            </main>
          </AppLayout>
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
