// FileUpload.jsx - File upload component with proper file removal and key reordering
import React, { useRef, useState } from 'react';
import { useTranslation } from './TranslationContext';
import config from "@/utils/config";
import sessionManager from '@/utils/sessionManager';

const API_BASE_URL = `${config.API_BASE_URL}`;
const FileUpload = ({ onFileUpload, uploadedFiles = {} }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({});
  const [tempFiles, setTempFiles] = useState({});

  const MAX_FILES = 5;
  const UPLOAD_URL = `${API_BASE_URL}/upload`;
  const VIRUS_SCAN_URL = `${API_BASE_URL}/virus-scanclam`;

  const scanFileForVirus = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('🔍 Scanning file for virus:', file.name);
    let sessionHeaders = sessionManager.getSessionHeaders();
    try {
      const response = await fetch(VIRUS_SCAN_URL, {
        method: 'POST',
        headers: {
      // ✅ Add JWT headers here
      ...sessionHeaders,  // This includes: Authorization: Bearer <jwtToken>
      // Don't set Content-Type for FormData - browser will set it automatically
    },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 Virus scan error response:', errorText);
        throw new Error(`Virus scan failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🔍 Virus scan result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Virus detected');
      }
      
      return result;
    } catch (error) {
      console.error('🔍 Virus scan error:', error);
      throw error;
    }
  };

  const uploadFileToAPI = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketType', 'cust');

    console.log('📤 Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    let sessionHeaders = sessionManager.getSessionHeaders();
    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
          ...sessionHeaders
        },
        body: formData,
      });

      console.log('📤 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📤 Error response body:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📤 Upload success:', result);
      return result;
    } catch (error) {
      console.error('📤 Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    // Check current uploaded files count
    const currentFileCount = Object.keys(uploadedFiles).length;
    const newFileCount = Array.from(files).length;
    
    if (currentFileCount + newFileCount > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. You can upload ${MAX_FILES - currentFileCount} more files.`);
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(t('fileSizeExceeded'));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(t('invalidFileFormat'));
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setIsScanning(true);
      
      try {
        const uploadResults = {};
        const baseCount = Object.keys(uploadedFiles).length;
        const cleanFiles = [];
        
        // Create temporary file entries for scanning
        const tempFileEntries = {};
        validFiles.forEach((file, index) => {
          const docKey = `doc${baseCount + index + 1}`;
          tempFileEntries[docKey] = {
            fileName: file.name,
            status: 'scanning',
            file: file
          };
        });
        setTempFiles(tempFileEntries);
        
        // First, scan all files for viruses
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const docKey = `doc${baseCount + i + 1}`;
          console.log(`🔍 Scanning file: ${file.name}`);
          
          setScanProgress(prev => ({ ...prev, [docKey]: 'scanning' }));
          
          try {
            await scanFileForVirus(file);
            cleanFiles.push({ file, docKey });
            setScanProgress(prev => ({ ...prev, [docKey]: 'clean' }));
            setTempFiles(prev => ({ 
              ...prev, 
              [docKey]: { ...prev[docKey], status: 'clean' }
            }));
            console.log(`✅ File ${file.name} is clean`);
          } catch (error) {
            setScanProgress(prev => ({ ...prev, [docKey]: 'infected' }));
            setTempFiles(prev => ({ 
              ...prev, 
              [docKey]: { ...prev[docKey], status: 'infected' }
            }));
            console.error(`❌ Virus detected in ${file.name}:`, error.message);
            alert(`Virus detected in ${file.name}. File rejected.`);
          }
        }
        
        setIsScanning(false);
        setScanProgress({});
        
        // If there are clean files, proceed with upload
        if (cleanFiles.length > 0) {
          setIsUploading(true);
          
          try {
            for (const { file, docKey } of cleanFiles) {
              console.log(`📁 Creating docKey: ${docKey} for file: ${file.name}`);
              
              // Update temp file status to uploading
              setTempFiles(prev => ({ 
                ...prev, 
                [docKey]: { ...prev[docKey], status: 'uploading' }
              }));
              setUploadProgress(prev => ({ ...prev, [docKey]: 'uploading' }));
              
              try {
                const result = await uploadFileToAPI(file);
                uploadResults[docKey] = result;
                setUploadProgress(prev => ({ ...prev, [docKey]: 'completed' }));
                // Update temp file status to completed
                setTempFiles(prev => ({ 
                  ...prev, 
                  [docKey]: { ...prev[docKey], status: 'completed', ...result }
                }));
              } catch (error) {
                setUploadProgress(prev => ({ ...prev, [docKey]: 'error' }));
                setTempFiles(prev => ({ 
                  ...prev, 
                  [docKey]: { ...prev[docKey], status: 'error' }
                }));
                console.error(`Failed to upload ${file.name}:`, error);
              }
            }
            
            // Merge with existing files and send to parent
            const mergedFiles = { ...uploadedFiles, ...uploadResults };
            onFileUpload(mergedFiles);
            
          } catch (error) {
            console.error('Upload process failed:', error);
            alert('Some files failed to upload. Please try again.');
          } finally {
            setIsUploading(false);
            setUploadProgress({});
            setTempFiles({}); // Clear temp files
          }
        } else {
          alert('All files were rejected due to virus detection.');
          setTempFiles({}); // Clear temp files
        }
        
      } catch (error) {
        console.error('Scanning process failed:', error);
        alert('File scanning failed. Please try again.');
        setIsScanning(false);
        setScanProgress({});
        setTempFiles({}); // Clear temp files
      }
    }
  };

  // FIXED: Remove file function with proper key reordering
  const handleRemoveFile = (docKeyToRemove) => {
    console.log('🗑️ Removing file with key:', docKeyToRemove);
    console.log('🗑️ Current uploadedFiles:', uploadedFiles);
    
    // Create array of remaining files (excluding the one to remove)
    const remainingEntries = Object.entries(uploadedFiles).filter(([key]) => key !== docKeyToRemove);
    
    // Reorder keys to maintain sequential numbering starting from doc1
    const reorderedFiles = {};
    remainingEntries.forEach(([oldKey, fileData], index) => {
      const newKey = `doc${index + 1}`;
      reorderedFiles[newKey] = fileData;
      console.log(`🔄 Reordering: ${oldKey} -> ${newKey}`);
    });
    
    console.log('🗑️ Final reordered files:', reorderedFiles);
    
    // Send the completely new object structure to parent
    onFileUpload(reorderedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  return (
    <div className="complaint-upload-group">
      <label className="complaint-upload-label">
        {t('uploadFile')} ({Object.keys(uploadedFiles).length}/{MAX_FILES})
      </label>
      
      {/* Scanning Progress */}


      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress">
          <div className="upload-progress-text">📤 Uploading files...</div>
          {Object.entries(uploadProgress).map(([docKey, status]) => (
            <div key={docKey} className={`upload-status ${status}`}>
              {docKey}: {status === 'uploading' ? '⏳ Uploading...' : 
                        status === 'completed' ? '✅ Completed' : 
                        status === 'error' ? '❌ Failed' : ''}
            </div>
          ))}
        </div>
      )}

      <div 
        className={`complaint-upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''} ${isScanning ? 'scanning' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!(isUploading || isScanning) ? handleClick : undefined}
        style={{ cursor: (isUploading || isScanning) ? 'not-allowed' : 'pointer' }}
      >
        <svg className="complaint-upload-icon" xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.4998 0.250977C13.6608 0.250977 15.403 0.250977 16.73 1.18597C17.111 1.45397 17.45 1.77397 17.74 2.13697C18.751 3.40797 18.751 5.03497 18.751 8.27397V10.819C18.751 13.8739 18.751 15.407 18.229 16.723C17.395 18.828 15.639 20.485 13.411 21.267C12.2097 21.6877 10.8248 21.742 8.35332 21.7489C8.341 21.75 8.32868 21.751 8.31633 21.752C8.30186 21.7531 8.28781 21.7519 8.27406 21.7491C7.93151 21.75 7.5683 21.75 7.18208 21.75C5.30016 21.75 4.35498 21.75 3.51699 21.456C2.15599 20.978 1.082 19.964 0.570995 18.675C0.25 17.866 0.25 16.969 0.25 15.183V10.6704C0.25 10.2564 0.586 9.9204 1 9.9204C1.414 9.9204 1.75 10.2564 1.75 10.6704V15.183C1.75 16.7788 1.75 17.58 1.96499 18.123C2.31599 19.008 3.06301 19.708 4.01301 20.042C4.61001 20.252 5.46899 20.252 7.18096 20.252C7.5634 20.252 7.92207 20.252 8.25907 20.2512C9.56194 20.1208 10.583 19.0177 10.583 17.6811C10.583 17.5212 10.575 17.3489 10.5666 17.1667L10.5647 17.1262C10.5398 16.5816 10.5115 15.965 10.665 15.3891C10.888 14.5571 11.543 13.9021 12.375 13.6791C12.9506 13.5257 13.5659 13.5539 14.1112 13.5788L14.1511 13.5806C14.3339 13.5891 14.5067 13.5971 14.667 13.5971C16.0666 13.5971 17.2102 12.4774 17.249 11.087C17.249 10.9994 17.249 10.9105 17.249 10.8202V8.27497C17.249 5.38398 17.249 3.93297 16.564 3.07197C16.364 2.82097 16.129 2.59898 15.864 2.41398C14.965 1.78098 13.4868 1.75298 10.4978 1.75298C10.0838 1.75298 9.74781 1.41698 9.74781 1.00298C9.74781 0.588977 10.0838 0.252977 10.4978 0.252977L10.4998 0.250977ZM17.1944 14.2185C16.4986 14.7684 15.6204 15.0971 14.667 15.0971C14.4762 15.0971 14.2811 15.0884 14.0905 15.08C14.0763 15.0794 14.0621 15.0787 14.048 15.0781L14.0321 15.0774C13.5781 15.0566 13.1109 15.0352 12.763 15.1291C12.448 15.2131 12.199 15.4621 12.115 15.7771C12.0212 16.1293 12.0429 16.6018 12.0638 17.0588L12.064 17.0621C12.074 17.2661 12.083 17.4761 12.083 17.6811C12.083 18.6171 11.7663 19.4806 11.2344 20.1701C11.9126 20.1132 12.4462 20.0167 12.913 19.853C14.73 19.215 16.159 17.873 16.833 16.172C17.0375 15.6557 17.1415 15.0457 17.1944 14.2185Z" fill="#161616"/>
          <path d="M3.08933 3.36028C2.89711 3.60502 2.69487 3.86213 2.53781 4.02372C2.24911 4.32074 1.77428 4.32749 1.47726 4.03879C1.18023 3.75009 1.17349 3.27526 1.46219 2.97823C1.55089 2.88698 1.69651 2.70516 1.90971 2.43374L1.95675 2.37382C2.14683 2.13167 2.3698 1.84761 2.59954 1.57648C2.84574 1.28593 3.12131 0.984135 3.39679 0.749513C3.53484 0.631938 3.69043 0.515969 3.85782 0.42639C4.01926 0.339997 4.24172 0.250977 4.5 0.250977C4.75829 0.250977 4.98074 0.339996 5.14218 0.42639C5.30957 0.515969 5.46517 0.631938 5.60321 0.749513C5.87869 0.984135 6.15426 1.28593 6.40047 1.57648C6.6302 1.8476 6.85317 2.13166 7.04324 2.3738L7.09029 2.43374C7.30349 2.70516 7.44911 2.88698 7.53781 2.97823C7.82651 3.27526 7.81977 3.75008 7.52274 4.03879C7.22572 4.32749 6.75089 4.32074 6.46219 4.02372C6.30513 3.86213 6.1029 3.60502 5.91067 3.36028L5.86595 3.30333C5.67304 3.0576 5.46675 2.79484 5.25606 2.54619L5.25 2.53905V9.00098C5.25 9.41519 4.91421 9.75098 4.5 9.75098C4.08579 9.75098 3.75 9.41519 3.75 9.00098V2.53905L3.74394 2.54619C3.53326 2.79483 3.32698 3.05758 3.13408 3.3033L3.08933 3.36028Z" fill="#161616"/>
        </svg>
        <div className="complaint-upload-text">
          {isScanning ? '🔍 Scanning files...' : 
           isUploading ? '📤 Uploading...' : 
           t('dragDropFiles')}
        </div>
        <div className="complaint-upload-subtext">
          {isScanning ? 'Please wait while files are being scanned for viruses' :
           isUploading ? 'Please wait while files are being uploaded' : 
           `${t('fileUploadInstructions')} (Max ${MAX_FILES} files)`}
        </div>
        <button 
          className="complaint-browse-button" 
          onClick={(e) => {
            e.stopPropagation();
            if (!(isUploading || isScanning)) {
              fileInputRef.current?.click();
            }
          }}
          type="button"
          disabled={isUploading || isScanning}
        >
          {isScanning ? '🔍 Scanning...' : 
           isUploading ? '📤 Uploading...' : 
           t('browseFiles')}
        </button>
      </div>

      {/* Files List - Shows uploaded files and temporary files during processing */}
      {(Object.keys(uploadedFiles).length > 0 || Object.keys(tempFiles).length > 0) && (
        <div style={{ marginTop: '16px' }}>
          {/* Show uploaded files */}
          {Object.entries(uploadedFiles).map(([docKey, fileData]) => (
            <div 
              key={docKey} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                marginBottom: '8px',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Green checkmark icon */}
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 1.5L4.5 7.5L2 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                {/* Filename and doc key for debugging */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {fileData.fileName || `${docKey}.file`}
                  </span>
                  {/* Show doc key for debugging - remove in production */}
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    Key: {docKey}
                  </span>
                </div>
              </div>
              
              {/* Remove button (X) */}
              <button
                onClick={() => handleRemoveFile(docKey)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  fontSize: '18px',
                  lineHeight: 1
                }}
                onMouseOver={(e) => e.target.style.color = '#dc3545'}
                onMouseOut={(e) => e.target.style.color = '#6c757d'}
              >
                ×
              </button>
            </div>
          ))}

          {/* Show temporary files during scanning/uploading */}
          {Object.entries(tempFiles).map(([docKey, tempFile]) => {
            const getStatusIcon = () => {
              switch (tempFile.status) {
                case 'scanning':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#ffc107',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        animation: 'spin 1s linear infinite'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V3M6 9V11M1 6H3M9 6H11M2.5 2.5L3.9 3.9M8.1 8.1L9.5 9.5M2.5 9.5L3.9 8.1M8.1 3.9L9.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  );
                case 'clean':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#17a2b8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 1.5L4.5 7.5L2 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  );
                case 'uploading':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#007bff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L9 5H7V11H5V5H3L6 1Z" fill="white"/>
                      </svg>
                    </div>
                  );
                case 'completed':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#28a745',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 1.5L4.5 7.5L2 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  );
                case 'infected':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#dc3545',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  );
                case 'error':
                  return (
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#dc3545',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8V4M6 10H6.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  );
                default:
                  return null;
              }
            };

            const getStatusText = () => {
              switch (tempFile.status) {
                case 'scanning': return '🔍 Scanning...';
                case 'clean': return '✅ Clean';
                case 'uploading': return '📤 Uploading...';
                case 'completed': return '✅ Completed';
                case 'infected': return '❌ Virus detected';
                case 'error': return '❌ Upload failed';
                default: return '';
              }
            };

            return (
              <div 
                key={docKey} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: tempFile.status === 'infected' ? '#f8d7da' : '#f8f9fa',
                  border: `1px solid ${tempFile.status === 'infected' ? '#f5c6cb' : '#e9ecef'}`,
                  borderRadius: '8px',
                  marginBottom: '8px',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusIcon()}
                  
                  {/* Filename and status */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      {tempFile.fileName}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      color: tempFile.status === 'infected' ? '#721c24' : '#6c757d',
                      fontStyle: 'italic'
                    }}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>
                
                {/* Remove button (X) - only show for completed files */}
                {tempFile.status === 'completed' && (
                  <button
                    onClick={() => handleRemoveFile(docKey)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      fontSize: '18px',
                      lineHeight: 1
                    }}
                    onMouseOver={(e) => e.target.style.color = '#dc3545'}
                    onMouseOut={(e) => e.target.style.color = '#6c757d'}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        className="complaint-file-input" 
        accept=".jpg,.jpeg,.png,.pdf" 
        multiple
        onChange={handleInputChange}
        disabled={isUploading || isScanning}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUpload;