import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import  arr_img from '../public/images/img_arrowright01round.svg'
const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <img 
              src={arr_img} alt="arrow" className="mx-2 w-4 h-4"
            />
          )}
          {item.active ? (
            <span className="text-text-gray">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="text-text-primary hover:text-primary-background"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
};

export default Breadcrumbs;