import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error = '',
  className = '',
  isRTL = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <div className="mb-1 flex items-center">
          <label htmlFor={name} className="text-[14px] font-semibold text-[#161616]">
            {required && !isRTL && <span className="text-[#b42318] mr-1 text-[14px]">*</span>}
            {required && isRTL && <span className="text-[#b42318] text-[14px]">*</span>}
            {label}
          </label>
        </div>
      )}
      
      <div 
        className="relative w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div 
          className="w-full h-10 px-4 py-2 flex items-center justify-between border border-[#9da4ae] rounded bg-white cursor-pointer"
          id={name}
          {...props}
        >
          <span className={`text-[16px] ${selectedOption ? 'text-[#384250]' : 'text-[#6c727e]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#9da4ae] rounded shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-[#f3f4f6] cursor-pointer text-[16px]"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-[#b42318] text-sm">{error}</p>}
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Dropdown;