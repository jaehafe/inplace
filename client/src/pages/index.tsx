import React from 'react';
import Image from 'next/image';
import { betaImages } from '../../configs/betaImages';

function Home() {
  return (
    <div>
      123
      <Image
        src={betaImages.InPlaceLogo}
        alt="logo"
        // style={{ width: '100px', height: '100px' }}
      />
    </div>
  );
}

export default Home;
