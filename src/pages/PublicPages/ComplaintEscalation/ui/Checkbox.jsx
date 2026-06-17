import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-6">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-6 w-6 border border-[#6c727e] rounded focus:ring-[#1b8354] accent-[#1b8354]"
          style={{
            accentColor: '#1b8354'
          }}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label htmlFor={name} className="text-[16px] font-medium text-[#1f2a37]">
          {label}
          {required && <span className="text-[#b42318] ml-1">*</span>}
        </label>
        {error && <p className="mt-1 text-[#b42318] text-sm">{error}</p>}
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Checkbox;