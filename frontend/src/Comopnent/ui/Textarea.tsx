import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      className="border border-gray-300 p-2 rounded-md w-full"
      rows={4}
      {...props}
    />
  );
};

export default Textarea;
