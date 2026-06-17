import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ 
  id, 
  checked, 
  onChange, 
  label, 
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          style={{
            transform: checked ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
            borderColor: checked ? '#1b8354' : '#d1d5db',
          }}
        />
        <label
          htmlFor={id}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
            disabled ? 'bg-gray-300' : checked ? 'bg-primary-background' : 'bg-gray-300'
          }`}
        ></label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ToggleSwitch;