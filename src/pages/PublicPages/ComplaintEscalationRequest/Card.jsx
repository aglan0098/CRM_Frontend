import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Card = ({
  icon,
  title,
  description,
  tag,
  buttonText,
  buttonLink,
  onClick,
  className = '',
}) => {
  return (
    <div className={`service-card ${className}`}>
      {icon && (
        <div className="service-icon-container">
          <img src={icon} alt={title} className="w-6 h-6" />
        </div>
      )}
      
      <h3 className="service-title">{title}</h3>
      
      <p className="service-description">{description}</p>
      
      {tag && (
        <div className="mt-4">
          <span className="service-tag">{tag}</span>
        </div>
      )}
      
      {buttonText && (
        buttonLink ? (
          <Link to={buttonLink} className="block">
            <button className="service-button">{buttonText}</button>
          </Link>
        ) : (
          <button onClick={onClick} className="service-button">
            {buttonText}
          </button>
        )
      )}
    </div>
  );
};

Card.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tag: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;