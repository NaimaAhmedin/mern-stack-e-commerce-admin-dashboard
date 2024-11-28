import React from 'react';

const CustomInput = ({ type, label, id, value, onChange, i_class }) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className={`form-control ${i_class}`}
        id={`floatingInput ${id}`} // Using `id` instead of `i_id`
        placeholder={label}
        value={value} // Added value prop
        onChange={onChange} // Added onChange prop
      />
      <label htmlFor={id}>{label}</label> {/* Fixed htmlFor to use id */}
    </div>
  );
};

export default CustomInput;
