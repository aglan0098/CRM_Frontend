import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none';
  
  const variants = {
    primary: 'bg-[#1b8354] text-white hover:bg-[#14573a] disabled:bg-gray-400',
    secondary: 'bg-[#e5e7eb] text-[#9da4ae] hover:bg-gray-300 disabled:bg-gray-200',
    outline: 'border border-[#1b8354] text-[#1b8354] hover:bg-[#f3f4f6] disabled:border-gray-300 disabled:text-gray-400',
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} px-4 py-2 text-base ${className} ${disabled ? 'cursor-not-allowed' : ''}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default Button;