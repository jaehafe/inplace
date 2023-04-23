import React from 'react';

import MainPage from '../components/MainPage/MainPage';
import PostVoteResultModal from '../components/Posts/PostVoteModal/PostVoteResultModal';

function Home() {
  return (
    <>
      <MainPage />
      <PostVoteResultModal />
    </>
  );
}

export default Home;
