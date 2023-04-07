import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import CommonButton from '../Common/CommonButton';
import InputGroup from '../InputGroup/InputGroup';
import S from './Signup.styles';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  console.log(email, username, password);

  const onClickSignup = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/auth/signup', {
        email,
        password,
        username,
      });
    } catch (error: any) {
      console.error(error);
      setErrors(error.response.data || {});
    }
  };

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
      <InputGroup
        placeholder="이메일 주소 입력"
        value={email}
        isfill={email}
        setValue={setEmail}
        error={errors.email}
      />
      {/* 닉네임 */}
      <h3>닉네임</h3>
      <InputGroup
        placeholder="닉네임 입력"
        value={username}
        isfill={username}
        setValue={setUsername}
        error={errors.nickname}
      />
      <h4>플레이스 활동 시 필요한 닉네임을 입력해 주세요.</h4>
      <h3>비밀번호</h3>
      <InputGroup
        placeholder="비밀번호 입력"
        value={password}
        isfill={password}
        setValue={setPassword}
        error={errors.nickname}
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
