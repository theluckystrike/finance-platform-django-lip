import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="border border-gray-300 p-2 rounded-md w-full"
      {...props}
    />
  );
};

export default Input;
