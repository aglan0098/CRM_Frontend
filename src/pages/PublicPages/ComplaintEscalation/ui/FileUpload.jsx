import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({
  label,
  name,
  onChange,
  accept = '.jpg,.png,.pdf',
  maxSize = 2, // in MB
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    
    // Check file type based on accept prop
    const fileType = file.type;
    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${accept}`;
    }
    
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        onChange({ target: { name, value: null, error: validationError } });
      } else {
        setFiles([...files, file]);
        onChange({ target: { name, value: [...files, file], error: null } });
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        onChange({ target: { name, value: null, error: validationError } });
      } else {
        setFiles([...files, file]);
        onChange({ target: { name, value: [...files, file], error: null } });
      }
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={className}>
      {label && (
        <div className="mb-2 flex items-center">
          {required && <span className="text-[#b42318] mr-1 text-[14px]">*</span>}
          <label className="text-[14px] font-semibold text-[#161616]">
            {label}
          </label>
        </div>
      )}
      
      <div 
        className={`h-[202px] border border-[#d2d6db] rounded bg-[#f3f4f6] flex flex-col items-center justify-center p-4 ${
          dragActive ? 'border-[#1b8354] bg-[#f3f4f6]' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          onChange={handleChange}
          accept={accept}
          className="hidden"
          {...props}
        />
        
        <div className="flex flex-col items-center">
          <img src="/images/img_fileupload.svg" alt="Upload" className="w-6 h-6 mb-4" />
          <p className="text-[16px] font-medium text-[#1f2a37] mb-2">Drag and drop files here to upload</p>
          <p className="text-[12px] text-[#384250] text-center mb-6">
            Maximum file size allowed is {maxSize}MB, supported file formats include .jpg, .png, and .pdf.
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="text-[14px] font-medium text-[#161616] bg-[#f3f4f6] py-1 px-3 rounded hover:bg-[#e5e7eb]"
          >
            Browse Files
          </button>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-[14px] text-[#384250]">Files selected: {files.length}</p>
          <ul className="mt-1">
            {files.map((file, index) => (
              <li key={index} className="text-[14px] text-[#384250]">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error && <p className="mt-1 text-[#b42318] text-sm">{error}</p>}
    </div>
  );
};

FileUpload.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default FileUpload;