import React from 'react';

const Card = ({
  title,
  description,
  icon,
  image,
  actionButton,
  className = "",
  variant = 'default'
}) => {
  const getCardStyles = () => {
    switch (variant) {
      case 'service':
        return "bg-white rounded-card h-[200px] w-[458px]";
      case 'role':
        return "bg-white rounded-card shadow-card h-[276px] w-[458px]";
      default:
        return "bg-white rounded-card";
    }
  };

  const getTitleStyles = () => {
    switch (variant) {
      case 'service':
        return "text-2xl font-medium text-black mt-[91px] mb-1";
      case 'role':
        return "text-lg font-bold text-[#1f2a37] mt-[88px] mb-4";
      default:
        return "text-xl font-bold text-black mb-2";
    }
  };

  const getDescriptionStyles = () => {
    switch (variant) {
      case 'service':
        return "text-base font-normal text-black";
      case 'role':
        return "text-base font-normal text-[#1f2a37]";
      default:
        return "text-base font-normal text-gray-600";
    }
  };

  return (
    <div className={`${getCardStyles()} ${className}`}>
      {image && (
        <img 
          src={image} 
          alt={title} 
          className={`${variant === 'default' ? 'w-full h-48 object-cover rounded-t-card' : ''}`} 
        />
      )}

      <div className="p-4">
        {icon && (
          <div className={`${variant === 'service' ? 'absolute top-4 left-4' : 'mb-4'}`}>
            <img src={icon} alt="" className="h-[66px] w-[66px] rounded-xl" />
          </div>
        )}

        <h3 className={getTitleStyles()}>{title}</h3>
        <p className={getDescriptionStyles()}>{description}</p>

        {actionButton && (
          <div className="mt-4">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
