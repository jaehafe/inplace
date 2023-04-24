import Image from 'next/image';
import React from 'react';

interface IProfileImageProps {
  width?: number | string | any;
  height?: number | string | any;
  src?: string | any;
  alt?: string;
  style?: any;
}

function ProfileImage({
  width = 80,
  height = 80,
  src,
  alt = 'profile-logo',
  style = { objectFit: 'contain', borderRadius: '50%' },
}: IProfileImageProps) {
  return (
    <>
      <Image
        src={
          src
            ? `http://localhost:4000/${src}`
            : 'https://www.gravatar.com/avatar?d=mp&f=y'
        }
        alt={alt}
        width={width}
        height={height}
        // style={{ borderRadius: '50%' }}
        style={style}
      />
    </>
  );
}

export default ProfileImage;
