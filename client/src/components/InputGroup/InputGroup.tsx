import React from 'react';
import I from './InputGroup.styles';

interface InputGroupProps {
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
  isfill: string;
}

function InputGroup({
  type = 'text',
  placeholder = '',
  error,
  value,
  setValue,
  isfill,
}: InputGroupProps) {
  return (
    <I.InputWrapper>
      <I.StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        isfill={isfill}
      />
      <small>{error}</small>
    </I.InputWrapper>
  );
}

export default InputGroup;
