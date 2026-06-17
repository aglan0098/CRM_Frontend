import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import arr_img from '../public/images/img_arrowright01round.svg';

const Breadcrumbs = ({ items }) => {
  return (
    <nav
      className="w-full overflow-x-auto"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center text-sm text-gray-600 whitespace-nowrap">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="mx-1 flex-shrink-0">
                <img
                  src={arr_img}
                  alt="arrow"
                  className="w-4 h-4"
                />
              </li>
            )}
            <li className="mr-1 flex-shrink-0">
              {item.active ? (
                <span className="text-text-gray font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-text-primary hover:text-blue-700 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
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
