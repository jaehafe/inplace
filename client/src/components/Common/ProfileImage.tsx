import Image from 'next/image';
import React from 'react';

interface IProfileImageProps {
  width?: number | string | any;
  height?: number | string | any;
  src?: string | any;
  alt?: string;
}

function ProfileImage({
  width = 80,
  height = 80,
  src = 'https://www.gravatar.com/avatar?d=mp&f=y',
  alt = 'profile-logo',
}: IProfileImageProps) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ borderRadius: '50%' }}
      />
    </>
  );
}

export default ProfileImage;
