import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select className="border border-gray-300 p-2 rounded-md w-full" {...props}>
      {children}
    </select>
  );
};

const SelectTrigger: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <div className="relative">
      <select
        className="border border-gray-300 p-2 rounded-md w-full appearance-none"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

type SelectValueProps = {
  placeholder: string;
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return (
    <option value="" disabled>
      {placeholder}
    </option>
  );
};

const SelectContent: React.FC = ({ children }: any) => {
  return (
    <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
      {children}
    </div>
  );
};

type SelectItemProps = {
  value: string;
  children: any;
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
