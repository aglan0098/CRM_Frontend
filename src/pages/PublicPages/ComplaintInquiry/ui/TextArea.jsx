import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Message...',
  rows = 4,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <div className="mb-1 flex items-center">
          {required && <span className="text-[#b42318] mr-1 text-[14px]">*</span>}
          <label htmlFor={name} className="text-[14px] font-semibold text-[#161616]">
            {label}
          </label>
        </div>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border border-[#9da4ae] rounded text-[16px] focus:outline-none focus:ring-1 focus:ring-[#1b8354] resize-y ${
          error ? 'border-[#b42318]' : ''
        }`}
        {...props}
      />
      
      {error && <p className="mt-1 text-[#b42318] text-sm">{error}</p>}
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default TextArea;