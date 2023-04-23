import React from 'react';

import MainPage from '../components/MainPage/MainPage';
import EditPost from '../components/Posts/EditPost';
import PostVoteResultModal from '../components/Posts/PostVoteModal/PostVoteResultModal';

function Home() {
  return (
    <>
      <MainPage />
      <PostVoteResultModal />
      <EditPost />
    </>
  );
}

export default Home;
