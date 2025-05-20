import React from "react";

const SelectOption = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
}) => {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        className="w-full border p-2 rounded-md focus:outline-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
