import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items = [], className = '' }) => {
  return (
    <nav className={`flex items-center ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="mx-2 w-4 h-4 text-gray-400" />
          )}
          
          {item.active ? (
            <span className="text-[14px] text-[#aeaeb2]">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className={`text-[14px] ${index === 0 ? 'text-white' : 'text-[#f5f5f5]'} hover:underline`}
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
      path: PropTypes.string,
      active: PropTypes.bool
    })
  ).isRequired,
  className: PropTypes.string
};

export default Breadcrumbs;