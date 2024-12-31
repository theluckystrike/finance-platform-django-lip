import React, { useRef, useEffect } from "react";
import {FormikTouched} from "formik";
import ArrowDown from "../../assest/image/arrow-down.png";

type CustomDropdownProps = {
  formik: any; // Используйте тип `FormikValues`, если возможно
  value: string;
  onChange: (value: string) => void;
  onFilter?: (value: string) => void; // Опционально для фильтрации
  options: Array<{ name: string }>;
  placeholder: string;
  touchedField?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  errorMessage?: string;
};

const CustomDropdown = ({
  formik,
  value,
  onChange,
  onFilter,
  options,
  placeholder,
  touchedField,
  errorMessage,
}: CustomDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div className="dropdown" ref={dropdownRef}>
        <div className="arrow_down">
          <img src={ArrowDown} alt="" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            const inputValue = e.target.value;
            onChange(inputValue);
            if (onFilter) onFilter(inputValue); // Фильтрация при необходимости
          }}
          className={`form-control ${touchedField && errorMessage ? "input-error" : ""}`}
        />
        <div
          className="dropdown-content"
          style={{
            maxHeight: "200px",
            overflow: "auto",
            display: isDropdownOpen && options.length > 0 ? "block" : "none",
          }}
        >
          {options.map((item, index) => (
            <span
              className="h6 hover-span"
              key={item.name}
              onClick={() => {
                onChange(item.name);
                setIsDropdownOpen(false);
              }}
            >
              {item.name}
            </span>
          ))}
        </div>
        {touchedField && errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
      </div>
  );
};

export default CustomDropdown;
