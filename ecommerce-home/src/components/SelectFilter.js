import React from 'react';
// import '../styles/SelectFilter.css';

const SelectFilter = ({ options, value, onChange }) => {
  return (
    <select className="select-filter" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;
