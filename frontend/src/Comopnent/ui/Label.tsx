import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  return (
    <label className="block text-gray-700 font-medium mb-1" {...props}>
      {children}
    </label>
  );
};

export default Label;
