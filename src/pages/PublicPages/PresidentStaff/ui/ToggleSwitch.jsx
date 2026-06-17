import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={`w-11 h-6 bg-gray-200 rounded-full peer ${
          disabled ? 'opacity-50' : '' } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b8354]`}></div>
        {label && (
          <span className="ml-3 text-[14px] text-[#161616]">{label}</span>
        )}
      </label>
    </div>
  );
};

ToggleSwitch.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default ToggleSwitch;