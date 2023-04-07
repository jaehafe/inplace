import React from 'react';
import Image from 'next/image';
import { AppImages } from '../configs/AppImages';
import MainPage from '../components/MainPage/MainPage';

function Home() {
  return (
    <>
      <MainPage />
      {/* <Image src={AppImages.InPlaceLogo} alt="logo" property="true" /> */}
    </>
  );
}

export default Home;
