import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous"
        className={`w-10 h-10 flex items-center justify-center transition border border-gray-300 ${
          currentPage === 1
            ? "cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 bg-white"
        }`}
      >
        <img
          src="/images/img_leading_icon_24x24 copy.svg"
          alt="Previous"
          className={`w-5 h-5 ${
            currentPage === 1 ? "opacity-40" : "opacity-100"
          }`}
        />
      </button>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next"
        className={`w-10 h-10 flex items-center justify-center transition border border-gray-300 ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 bg-white"
        }`}
      >
        <img
          src="/images/img_leading_icon_1 copy.svg"
          alt="Next"
          className={`w-5 h-5 ${
            currentPage === totalPages ? "opacity-40" : "opacity-100"
          }`}
        />
      </button>
    </div>
  );
};

export { Pagination };
