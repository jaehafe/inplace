import React from 'react';
import CommonButton from '../Common/CommonButton';
import S from './Signup.styles';

function Signup() {
  const onClickSignup = () => {};

  return (
    <S.SignupWrapper>
      <h2>
        인플레이스 활동에 필요한
        <br />
      </h2>
      <h2>
        정보를 입력해주세요.
        <br />
      </h2>
      {/* 이메일 */}
      <h3>이메일 주소</h3>
      <S.SignupInput
        placeholder="이메일 주소 입력"
        // value={email}
        // isfill={email}
        // onChange={onChangeEmail}
      />
      {/* 닉네임 */}
      <h3>닉네임</h3>
      <S.SignupInput
        placeholder="닉네임 입력"
        // value={nickname}
        // isfill={nickname}
        // onChange={onChangeNickName}
      />
      <h4>플레이스 활동 시 필요한 닉네임을 입력해 주세요.</h4>
      <h3>비밀번호</h3>
      <S.SignupInput
        placeholder="비밀번호 입력"
        // value={password}
        // isfill={password}
        // onChange={onChangePassword}
      />
      <h4>6자리 이상 20자리 이하</h4>
      <CommonButton type="primary" onClick={onClickSignup} disabled={false}>
        {/* disabled={isDisabled} */}
        회원가입
      </CommonButton>
    </S.SignupWrapper>
  );
}

export default Signup;
