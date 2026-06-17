import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/NavBar/Navbar';
import Footer from '@/components/common/Footer';
import Card from './Card';
import Breadcrumbs from './ui/Breadcrumbs';
import InputField from './ui/InputField';
import Dropdown from './ui/Dropdown';
import TextArea from './ui/TextArea';
import Checkbox from './ui/Checkbox';
import Button from './ui/Button';
import ComplaintFeedbackForm from './ReponseModal'; // Import your ResponseModal
import { CheckCircle, Star, AlertCircle, Loader2 } from 'lucide-react';
import { checkUserExists } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';
import config from '@/utils/config';
import Nv from '@/components/ServicesPage/NAVbAR/Navbar';
import sessionManager from '@/utils/sessionManager';
import Recaptcha from '@/components/Captacha/Recaptcha';
import { useNavigate } from 'react-router-dom';
// Import the centralized language utils
import {
  getStoredLanguage,
  storeLanguage,
  setupLanguageListener,
  applyLanguageSettings,
  isRTL,
} from '../../../utils/LanguageUtils';
import Radio from './ui/RadioButton';
import { trackEvent } from '@/utils/analytics';

const ComplaintEscalationPage = () => {
  // Language state and handlers - MOVED HERE FROM DocumentDropdown
  const [language, setLanguage] = useState(() => getStoredLanguage());

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`ComplaintInquiry: Language changed to ${newLanguage}`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
  }, []);

  // Language change handler using centralized system
  const handleLanguageChange = (newLanguage) => {
    // Validate language
    if (!['en', 'ar'].includes(newLanguage)) {
      console.warn('Invalid language selected:', newLanguage);
      return;
    }

    // Use centralized language storage
    storeLanguage(newLanguage);
    setLanguage(newLanguage);

    // Apply language settings immediately
    applyLanguageSettings(newLanguage);

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };

  // State for form structure from API
  const [formFields, setFormFields] = useState([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Form state (will be built dynamically from API)
  const [formData, setFormData] = useState({});

  // State for regions and cities based on API data
  const [regions, setRegions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);

  // State for related authorities dropdown
  const [relatedAuthorities, setRelatedAuthorities] = useState([]);

  // Form errors
  const [errors, setErrors] = useState({});

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Loading state for API call
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state - Updated for new ResponseModal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [apiResponse, setApiResponse] = useState({ success: false, message: '' });
  const [ticketNumber, setTicketNumber] = useState('');
  const [incidentId, setIncidentId] = useState(''); // Add this
  const [contactId, setContactId] = useState('');
  // Add this after your existing useState declarations
  const [userData, setUserData] = useState(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [documentsStructure, setDocumentsStructure] = useState({});
  const [fileUploadErrors, setFileUploadErrors] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());

  // Captcha state
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();
  // Field mapping to handle API field names vs UI field names
  const fieldMapping = {
    firstName: 'firstName',
    lastName: 'lastName',
    nationalId: 'nationalId',
    phoneNumber: 'phoneNumber',
    region: 'swa_regionid',
    city: 'city',
    supportGroup: 'supportGroup',
    relatedAuthority: 'swa_relatedauthorityid',
    complaintNumber: 'swa_complaintnumber',
    complaintSubject: 'title',
    complaintMessage: 'description',
  };

  /**
   * Get JWT headers for API calls
   * Logic:
   * 1. If userId exists (logged in) → use sessionManager.getJWTHeaders()
   * 2. If no userId but JWT exists (captcha) → use sessionManager.getJWTHeaders()
   * 3. If no JWT → return null (need captcha)
   * @returns {object|null} Headers object or null if JWT needed
   */
  const getAPIHeaders = () => {
    // Check if user is logged in (has userId)
    const storedUserData = localStorage.getItem('swa_user');
    const hasUserId = storedUserData && JSON.parse(storedUserData)?.userId;

    // Get JWT headers from sessionManager (works for both logged-in and captcha users)
    const jwtHeaders = sessionManager.getJWTHeaders();

    if (jwtHeaders && Object.keys(jwtHeaders).length > 0) {
      // JWT exists (either from login or captcha)
      console.log(
        '[ComplaintEscalation] Using JWT headers',
        hasUserId ? '(logged in)' : '(captcha verified)'
      );
      return jwtHeaders;
    }

    // No JWT found - need captcha
    console.log('[ComplaintEscalation] No JWT found - captcha required');
    return null;
  };

  /**
   * Check if JWT is available, if not show captcha modal
   * @returns {boolean} True if JWT available, false if captcha needed
   */
  const ensureJWT = () => {
    const headers = getAPIHeaders();
    if (!headers) {
      setShowCaptchaModal(true);
      return false;
    }
    return true;
  };

  /**
   * Handle captcha verification success
   */
  const handleCaptchaSuccess = () => {
    console.log('[ComplaintEscalation] Captcha verified, JWT now available');
    setCaptchaVerified(true);
    setShowCaptchaModal(false);
    // Retry fetching form fields if they weren't loaded
    if (formFields.length === 0 && !isLoadingFields) {
      const fetchFormFields = async () => {
        const headers = getAPIHeaders();
        if (headers) {
          setIsLoadingFields(true);
          try {
            const response = await fetch(`${config.API_BASE_URL}/api/incident/form`, {
              headers: {
                'Content-Type': 'application/json',
                ...headers,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setFormFields(data);
              // Extract regions from the form fields
              const regionField = data.find(
                (field) => field.name === 'swa_regionid' || field.lookupTarget === 'swa_region'
              );
              if (regionField && regionField.options) {
                setRegions(regionField.options);
              }
            }
          } catch (error) {
            console.error('Error fetching form fields after captcha:', error);
          } finally {
            setIsLoadingFields(false);
          }
        }
      };
      fetchFormFields();
    }
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('swa_user');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const userId = parsedUserData?.userId;

          if (userId) {
            console.log('Found userId in localStorage:', userId);

            // Call API to get full user data
            const result = await checkUserExists(userId);
            const user = result?.user;

            if (user) {
              console.log('User data fetched from API:', user);
              setUserData(user); // Set the full user object from API
            } else {
              console.log('No user found from API');
              setUserData(null);
            }
          } else {
            console.log('No userId found in localStorage');
            setUserData(null);
          }
        } else {
          console.log('No user data found in localStorage');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } finally {
        // Always set this to true, whether user data exists or not
        setIsUserDataLoaded(true);
      }
    };

    loadUserData();
  }, []);
  // Fetch form fields from the API
  useEffect(() => {
    const fetchFormFields = async () => {
      // Only proceed if user data loading is complete
      if (!isUserDataLoaded) return;

      // Check if JWT is available
      const headers = getAPIHeaders();
      if (!headers) {
        console.log('[ComplaintEscalation] No JWT - showing captcha modal');
        setShowCaptchaModal(true);
        setIsLoadingFields(false);
        return;
      }

      setIsLoadingFields(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/incident/form`, {
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setFormFields(data);

        // Extract regions from the form fields
        const regionField = data.find(
          (field) => field.name === 'swa_regionid' || field.lookupTarget === 'swa_region'
        );

        if (regionField && regionField.options) {
          setRegions(
            regionField.options.map((region) => ({
              value: region.id,
              label: region.name,
              cities: region.cities || [],
            }))
          );
        }

        // Extract related authorities from form fields
        const authorityField = data.find(
          (field) =>
            field.name === 'relatedAuthority' ||
            field.name === 'swa_relatedauthorityid' ||
            field.lookupTarget === 'authority'
        );

        if (authorityField && authorityField.options) {
          setRelatedAuthorities(
            authorityField.options.map((auth) => ({
              value: auth.id,
              label: auth.name,
            }))
          );
        } else {
          const potentialAuthorityField = data.find(
            (field) =>
              field.name?.toLowerCase().includes('authority') ||
              field.label?.toLowerCase().includes('authority')
          );

          if (potentialAuthorityField && potentialAuthorityField.options) {
            setRelatedAuthorities(
              potentialAuthorityField.options.map((auth) => ({
                value: auth.id,
                label: auth.name,
              }))
            );
          } else {
            console.warn('No authority field found in API response, using demo options');
            setRelatedAuthorities([
              { value: 'water_auth', label: 'Water Authority' },
              { value: 'sewage_auth', label: 'Sewage Authority' },
              { value: 'water_sewage_auth', label: 'Water and Sewage Authority' },
            ]);
          }
        }
        // Initialize formData with empty values based on field names from API
        const initialFormData = {};
        data.forEach((field) => {
          initialFormData[field.name] = '';
        });

        // NOW populate with user data if available
        // NOW populate with user data if available
        if (userData) {
          console.log('Populating form with user data:', userData);

          // userData now comes directly from API, no need for nested structure
          initialFormData['firstName'] = userData.firstName || '';
          initialFormData['lastName'] = userData.lastName || '';
          initialFormData['nationalId'] = userData.nationalId || userData.national_id || '';
          initialFormData['phoneNumber'] = userData.phoneNumber || userData.phone || '';
        } else {
          console.log('No user data available - initializing with empty values');
        }

        // Initialize other fields
        initialFormData['complaintNumber'] = '';
        initialFormData['complaintSubject'] = '';
        initialFormData['complaintMessage'] = '';

        // Add UI field names for easy access in form
        Object.keys(fieldMapping).forEach((uiField) => {
          if (!initialFormData[uiField]) {
            initialFormData[uiField] = '';
          }
        });

        // Add declaration field
        initialFormData.declaration = false;

        setFormData(initialFormData);
        setLoadError(null);
      } catch (error) {
        console.error('Error fetching form fields:', error);
        setLoadError(error.message);
      } finally {
        setIsLoadingFields(false);
      }
    };

    fetchFormFields();
  }, [isUserDataLoaded, captchaVerified]); // Retry when captcha is verified
  useEffect(() => {
    if (isUserDataLoaded && userData && Object.keys(formData).length > 0) {
      console.log('Updating form data with user information:', userData);

      // Since userData now comes from API, use direct properties
      setFormData((prevData) => ({
        ...prevData,
        firstName: userData.firstName || prevData.firstName || '',
        lastName: userData.lastName || prevData.lastName || '',
        nationalId: userData.nationalId || userData.national_id || prevData.nationalId || '',
        phoneNumber: userData.phoneNumber || userData.phone || prevData.phoneNumber || '',
      }));
    }
  }, [userData, isUserDataLoaded]);
  // Update cities when region changes
  useEffect(() => {
    if (formData.region) {
      const selectedRegion = regions.find((r) => r.value === formData.region);

      if (selectedRegion && selectedRegion.cities) {
        setCitiesOptions(
          selectedRegion.cities.map((city) => ({
            value: city.id,
            label: city.name,
          }))
        );

        // Reset city when region changes only if the city is not valid for the new region
        if (formData.city && !selectedRegion.cities.some((city) => city.id === formData.city)) {
          setFormData({
            ...formData,
            city: '',
          });
        }
      } else {
        setCitiesOptions([]);
      }
    } else {
      setCitiesOptions([]);
    }
  }, [formData.region, regions]);

  // Load user data from localStorage

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Main Page', path: 'https://www.swa.gov.sa/services' },
    { label: 'Services', path: 'https://www.swa.gov.sa/services' },
    { label: 'Complaint escalation service', active: true },
  ];

  // Handle input changes
  // Helper function to count words
  const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };
  const handleAlphaInput = (e) => {
    const char = e.key;
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (
      e.ctrlKey &&
      (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'z')
    ) {
      return;
    }

    // Only allow letters, spaces, and hyphens
    if (!/^[a-zA-Z\s-]$/.test(char)) {
      e.preventDefault();
    }
  };

  // Helper function to allow only digits
  const handleNumericInput = (e) => {
    const char = e.key;
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (
      e.ctrlKey &&
      (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'z')
    ) {
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(char)) {
      e.preventDefault();
    }
  };

  // Helper function to handle paste events for alpha fields
  const handleAlphaPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    // Only allow letters, spaces, and hyphens in pasted content
    if (!/^[a-zA-Z\s-]*$/.test(pastedText)) {
      e.preventDefault();
    }
  };

  // Helper function to handle paste events for numeric fields
  const handleNumericPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    // Only allow digits in pasted content
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };
  // Real-time validation for individual fields
  const validateField = (fieldName, fieldValue) => {
    let error = '';

    switch (fieldName) {
      case 'firstName':
        if (!fieldValue?.trim()) {
          error = 'First Name is required';
        } else if (!/^[a-zA-Z\s-]+$/.test(fieldValue.trim())) {
          error = 'First Name can only contain English letters, spaces, and hyphens';
        } else if (fieldValue.trim().length > 25) {
          error = 'First Name cannot exceed 25 characters';
        }
        break;

      case 'lastName':
        if (!fieldValue?.trim()) {
          error = 'Last Name is required';
        } else if (!/^[a-zA-Z\s-]+$/.test(fieldValue.trim())) {
          error = 'Last Name can only contain English letters, spaces, and hyphens';
        } else if (fieldValue.trim().length > 25) {
          error = 'Last Name cannot exceed 25 characters';
        }
        break;

      case 'nationalId':
        if (!fieldValue?.trim()) {
          error = 'National ID/Iqama is required';
        } else if (!/^[12]\d{9}$/.test(fieldValue.trim())) {
          error = 'National ID must be exactly 10 digits, starting with 1 or 2';
        }
        break;

      case 'phoneNumber':
        if (!fieldValue?.trim()) {
          error = 'Phone Number is required';
        } else if (!/^05\d{8}$/.test(fieldValue.trim())) {
          error = 'Phone Number must start with "05" and be exactly 10 digits (05XXXXXXXX)';
        }
        break;

      case 'complaintNumber':
        if (!fieldValue?.trim()) {
          error = 'Complaint Number is required';
        } else if (!/^\d+$/.test(fieldValue.trim())) {
          error = 'Complaint Number can only contain numbers';
        } else if (fieldValue.trim().length !== 10) {
          error = 'Complaint Number must be 10 digits';
        }
        break;

      case 'complaintSubject':
        if (!fieldValue?.trim()) {
          error = 'Complaint Subject is required';
        } else if (fieldValue.length > 100) {
          error = `Complaint Subject cannot exceed 500 characters (current: ${fieldValue.length} characters)`;
        }
        break;
      case 'complaintMessage':
        if (!fieldValue?.trim()) {
          error = 'Complaint message is required';
        } else if (fieldValue.length > 128) {
          error = `Complaint message cannot exceed 128 characters (current: ${fieldValue.length} characters)`;
        }
        break;

      case 'region':
        if (!fieldValue) error = 'Region is required';
        break;

      case 'city':
        if (!fieldValue) error = 'City is required';
        break;

      case 'city':
        if (!fieldValue) error = 'City is required';
        break;

      case 'relatedAuthority':
        if (!fieldValue) error = 'Related Authority is required';
        break;

      case 'declaration':
        if (!fieldValue) error = 'You must agree to the declaration';
        break;

      default:
        break;
    }

    return error;
  };

  // Enhanced handleChange function with input filtering
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const apiFieldName = Object.entries(fieldMapping).find(
      ([uiField, apiField]) => uiField === name
    )?.[1];
    let fieldValue = type === 'checkbox' ? checked : value;

    // convert supportGroup to integer
    if(name === "supportGroup")
    {
      fieldValue = parseInt(value, 10)
    }

    // Filter input based on field type
    if (name === 'firstName' || name === 'lastName') {
      // Remove any non-letter, non-space, non-hyphen characters
      fieldValue = fieldValue.replace(/[^a-zA-Z\s-]/g, '');
      if (fieldValue.length > 25) {
        fieldValue = fieldValue.slice(0, 25);
      }
    } else if (name === 'nationalId' || name === 'phoneNumber' || name === 'complaintNumber') {
      // Remove any non-digit characters
      fieldValue = fieldValue.replace(/\D/g, '');

      // Apply length limits
      if (name === 'nationalId' && fieldValue.length > 10) {
        fieldValue = fieldValue.slice(0, 10);
      } else if (name === 'phoneNumber' && fieldValue.length > 10) {
        fieldValue = fieldValue.slice(0, 10);
      } else if (name === 'complaintNumber' && fieldValue.length > 10) {
        fieldValue = fieldValue.slice(0, 10);
      }
    }

    // Apply word limits for complaint subject and message
    // Apply character limits for complaint subject and message
    if (name === 'complaintSubject') {
      // Remove non-English/Arabic characters
      fieldValue = fieldValue.replace(/[^a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'"]/g, '');
      if (fieldValue.length > 100) {
        fieldValue = fieldValue.slice(0, 100);
      }
    }

    if (name === 'complaintMessage') {
      // Remove non-English/Arabic characters
      fieldValue = fieldValue.replace(/[^a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'\n\r"]/g, '');
      if (fieldValue.length > 128) {
        fieldValue = fieldValue.slice(0, 128);
      }
    }

    // Update form data
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: fieldValue,
      };

      if (apiFieldName && apiFieldName !== name) {
        updatedData[apiFieldName] = fieldValue;
      }

      return updatedData;
    });

    // Real-time validation
    const fieldError = validateField(name, fieldValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  // Validate form
  // 2. UPDATE THE validateForm FUNCTION (around line 260)
  const validateForm = () => {
    const newErrors = {};

    // First Name validation - English letters, spaces, and hyphens with 25 character limit
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First Name is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First Name can only contain English letters, spaces, and hyphens';
    } else if (formData.firstName.trim().length > 25) {
      newErrors.firstName = 'First Name cannot exceed 25 characters';
    }

    // Last Name validation - English letters, spaces, and hyphens with 25 character limit
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last Name is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last Name can only contain English letters, spaces, and hyphens';
    } else if (formData.lastName.trim().length > 25) {
      newErrors.lastName = 'Last Name cannot exceed 25 characters';
    }

    // National ID validation - numbers only, start with 1 or 2, exactly 10 digits
    if (!formData.nationalId?.trim()) {
      newErrors.nationalId = 'National ID/Iqama is required';
    } else if (!/^[12]\d{9}$/.test(formData.nationalId.trim())) {
      newErrors.nationalId = 'National ID must be exactly 10 digits, starting with 1 or 2';
    }

    // Phone Number validation - must start with 05 and follow Saudi format
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^05\d{8}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber =
        'Phone Number must start with "05" and be exactly 10 digits (05XXXXXXXX)';
    }

    // Region validation
    if (!formData.region) newErrors.region = 'Region is required';

    // City validation
    if (!formData.city) newErrors.city = 'City is required';

    // Related Authority validation
    if (!formData.relatedAuthority) newErrors.relatedAuthority = 'Related Authority is required';

    // Complaint Number validation - numbers only, exactly 10 digits
    if (!formData.complaintNumber?.trim()) {
      newErrors.complaintNumber = 'Complaint Number is required';
    } else if (!/^\d+$/.test(formData.complaintNumber.trim())) {
      newErrors.complaintNumber = 'Complaint Number can only contain numbers';
    } else if (formData.complaintNumber.trim().length !== 10) {
      newErrors.complaintNumber = 'Complaint Number must be 10 digits';
    }

    // Complaint Subject/Title validation - max 500 characters
    if (!formData.complaintSubject?.trim()) {
      newErrors.complaintSubject = 'Complaint Subject is required';
    } else if (formData.complaintSubject.length > 100) {
      newErrors.complaintSubject = `Complaint Subject cannot exceed 500 characters (current: ${formData.complaintSubject.length} characters)`;
    }

    // Complaint Message validation - max 5000 characters
    if (!formData.complaintMessage?.trim()) {
      newErrors.complaintMessage = 'Complaint message is required';
    } else if (formData.complaintMessage.length > 128) {
      newErrors.complaintMessage = `Complaint message cannot exceed 128 characters (current: ${formData.complaintMessage.length} characters)`;
    }

    // Declaration validation
    if (!formData.declaration) newErrors.declaration = 'You must agree to the declaration';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Prepare backend payload
  const preparePayload = () => {
    // Start with the original form data
    const payload = { ...formData };

    // Map UI field values to API field names
    Object.entries(fieldMapping).forEach(([uiField, apiField]) => {
      if (apiField !== uiField) {
        // If API field exists and is different from UI field, ensure it has the correct value
        payload[apiField] = formData[uiField];
      }
    });

    // // convert supportGroup to integer 
    // if(payload.supportGroup)
    // {
    //   payload.supportGroup = parseInt(payload.supportGroup, 10);
    // }

    // Add documents structure if files were uploaded successfully
    if (Object.keys(documentsStructure).length > 0) {
      payload.documents = documentsStructure;
    }

    console.log('Payload with documents:', payload);
    return payload;
  };

  // API call to submit form data
  const submitFormToBackend = async (data) => {
    // Check if JWT is available before submitting
    const headers = getAPIHeaders();
    if (!headers) {
      console.log('[ComplaintEscalation] No JWT - showing captcha modal before submit');
      setShowCaptchaModal(true);
      return { success: false, message: 'Please complete captcha verification first' };
    }

    try {
      // Prepare payload with correct API field names
      const payload = preparePayload();

      // Log the form data to console before sending to API
      console.log('Submitting form data:', payload);

      const response = await fetch(`${config.API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit complaint');
      }

      const result = await response.json();
      console.log('API response:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, message: error.message };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    trackEvent('ec_sub');

    // Log current form data before validation
    console.log('Current form data (before validation):', formData);

    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // Submit form data to backend using real API
        const result = await submitFormToBackend(formData);

        if (result.success) {
          // Extract ticket number from API response
          // The ticket number comes from your main form submission endpoint
          const responseTicketNumber = result.data?.ticknumber || null;
          const responseIncidentId = result.data?.incidentId || null;
          const responseContactId = result.data?.contactid || null;

          console.log('API Response:', result.data);
          console.log('Extracted Ticket Number:', responseTicketNumber);
          console.log('Extracted Incident Number:', responseIncidentId);
          console.log('Extracted Incident Number:', responseContactId);

          setTicketNumber(responseTicketNumber);
          setIncidentId(responseIncidentId);
          setContactId(responseContactId);
          setApiResponse({
            success: true,
            message: 'Your complaint has been submitted successfully!',
            ticknumber: responseTicketNumber,
            incidentId: responseIncidentId,
            contactId: responseContactId,
          });

          // Show success modal with the real ticket number from API
          trackEvent("ec_succ");
          setShowSuccessModal(true);

          // Reset form on success
          const emptyFormData = {};
          Object.keys(formData).forEach((key) => {
            emptyFormData[key] = '';
          });
          emptyFormData.declaration = false;
          setFormData(emptyFormData);
        } else {
          // Handle API error
          setApiResponse({
            success: false,
            message: result.message || 'Failed to submit your complaint. Please try again later.',
          });
          trackEvent("ec_sub_er");
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Error in submit handler:', error);
        setApiResponse({
          success: false,
          message: error?.message || 'Failed to submit your complaint. Please try again later.'
        });
        trackEvent("ec_sub_er");
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Form validation failed. Errors:', errors);

      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  // Handle feedback modal submission
  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Feedback received:', feedbackData);
    // You can add API call here to send feedback to backend
    setShowSuccessModal(false);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };
  // Virus scanning function
  const scanSingleFile = async (file) => {
    // Check if JWT is available
    const headers = getAPIHeaders();
    if (!headers) {
      console.log('[ComplaintEscalation] No JWT - showing captcha modal before virus scan');
      setShowCaptchaModal(true);
      return { success: false, message: 'Please complete captcha verification first' };
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${config.API_BASE_URL}/virus-scanclam`, {
        method: 'POST',
        headers: headers, // JWT headers (don't set Content-Type for FormData)
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.status}`);
      }

      const result = await response.json();
      return { success: result.success, data: result };
    } catch (error) {
      console.error('File scan error:', error);
      return { success: false, message: error.message };
    }
  };

  const uploadSingleFile = async (file) => {
    // Check if JWT is available
    const headers = getAPIHeaders();
    if (!headers) {
      console.log('[ComplaintEscalation] No JWT - showing captcha modal before upload');
      setShowCaptchaModal(true);
      return { success: false, message: 'Please complete captcha verification first' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketType', 'cust'); // Add bucketType parameter

    try {
      const response = await fetch(`${config.API_BASE_URL}/upload`, {
        method: 'POST',
        headers: headers, // JWT headers (don't set Content-Type for FormData)
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, message: error.message };
    }
  };
  // File upload functionality with virus scanning
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Check if JWT is available before processing files
    const headers = getAPIHeaders();
    if (!headers) {
      console.log('[ComplaintEscalation] No JWT - showing captcha modal before file upload');
      setShowCaptchaModal(true);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const maxFiles = 5; // Maximum 5 files allowed

    // Check if total files would exceed limit
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(
        `You can only upload a maximum of ${maxFiles} files. Currently you have ${uploadedFiles.length} files.`
      );
      return;
    }

    const validFiles = [];
    const newFileUploadErrors = [];

    // Validate files first
    Array.from(files).forEach((file) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        newFileUploadErrors.push(
          `File "${file.name}" is not supported. Please upload .jpg, .png, or .pdf files only.`
        );
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        newFileUploadErrors.push(`File "${file.name}" is too large. Maximum file size is 5MB.`);
        return;
      }

      // Check if file already exists (by name and size)
      const fileExists = uploadedFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size
      );

      if (fileExists) {
        newFileUploadErrors.push(`File "${file.name}" is already uploaded.`);
        return;
      }

      validFiles.push(file);
    });

    // Update file upload errors
    if (newFileUploadErrors.length > 0) {
      setFileUploadErrors((prev) => [...prev, ...newFileUploadErrors]);
      // Auto-clear errors after 5 seconds
      setTimeout(() => {
        setFileUploadErrors((prev) => prev.filter((error) => !newFileUploadErrors.includes(error)));
      }, 5000);
    }

    // SEQUENTIAL PROCESSING - Scan and upload files one by one
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = Date.now() + Math.random() + i; // Ensure unique ID

      console.log(`Processing file ${i + 1}/${validFiles.length}: ${file.name}`);

      // Add file to uploading state
      setUploadingFiles((prev) => new Set([...prev, fileId]));

      // Add file to uploaded files list with scanning status
      const fileWithMetadata = {
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        id: fileId,
        uploadDate: new Date().toISOString(),
        status: 'scanning',
        uploadResponse: null,
        error: null,
        scanResult: null,
      };

      setUploadedFiles((prev) => [...prev, fileWithMetadata]);

      try {
        // STEP 1: Scan file for viruses
        console.log(`Scanning file: ${file.name}`);
        const scanResult = await scanSingleFile(file);

        if (!scanResult.success) {
          // Virus detected or scan failed
          console.error(
            `Scan failed for file: ${file.name}`,
            scanResult.data?.error || scanResult.message
          );

          // Update file status to scan_failed
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: 'scan_failed',
                    error: scanResult.data?.error || 'Virus detected in file',
                    scanResult: scanResult.data,
                  }
                : f
            )
          );

          // Add to file upload errors
          const errorMessage = scanResult.data?.error || 'Virus detected in file';
          setFileUploadErrors((prev) => [
            ...prev,
            `Scan failed for "${file.name}": ${errorMessage}`,
          ]);

          // Skip upload for infected files
          continue;
        }

        // STEP 2: File is clean, update status to scanned
        console.log(`File is clean: ${file.name}`, scanResult.data);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'scanned',
                  scanResult: scanResult.data,
                }
              : f
          )
        );

        // STEP 3: Upload clean file
        console.log(`Uploading clean file: ${file.name}`);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading' } : f))
        );

        const uploadResult = await uploadSingleFile(file);

        if (uploadResult.success) {
          console.log(`Successfully uploaded: ${file.name}`, uploadResult.data);

          // Update file status to success
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: 'success', uploadResponse: uploadResult.data } : f
            )
          );

          // Update documents structure with proper sequential numbering
          setDocumentsStructure((prev) => {
            const currentDocCount = Object.keys(prev).length;
            const docKey = `doc${currentDocCount + 1}`;

            const newStructure = {
              ...prev,
              [docKey]: {
                message: uploadResult.data.message,
                bucketType: uploadResult.data.bucketType,
                fileName: uploadResult.data.fileName,
                url: uploadResult.data.url,
                originalFileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                scanResult: scanResult.data, // Include scan result in document structure
              },
            };

            console.log(`Added document ${docKey} to structure:`, newStructure);
            return newStructure;
          });
        } else {
          console.error(`Failed to upload: ${file.name}`, uploadResult.message);

          // Update file status to error
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: 'error', error: uploadResult.message } : f
            )
          );

          // Add to file upload errors
          setFileUploadErrors((prev) => [
            ...prev,
            `Failed to upload "${file.name}": ${uploadResult.message}`,
          ]);
        }
      } catch (error) {
        console.error(`Unexpected error processing file: ${file.name}`, error);

        // Handle unexpected errors
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'error', error: 'Unexpected error occurred' } : f
          )
        );

        setFileUploadErrors((prev) => [
          ...prev,
          `Failed to process "${file.name}": Unexpected error occurred`,
        ]);
      } finally {
        // Remove from uploading state
        setUploadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }

      // Add a small delay between processing to prevent overwhelming the server
      if (i < validFiles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
      }
    }

    console.log('All files processed. Final document structure will be updated.');
  };

  const removeFile = (fileId) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);

    // Only remove from documents structure if file was successfully uploaded
    if (fileToRemove && (fileToRemove.status === 'success' || fileToRemove.status === 'scanned')) {
      // Find and remove from documents structure
      const docEntries = Object.entries(documentsStructure);
      const docToRemove = docEntries.find(
        ([key, doc]) =>
          doc.originalFileName === fileToRemove.name && doc.fileSize === fileToRemove.size
      );

      if (docToRemove) {
        setDocumentsStructure((prev) => {
          const newDocs = { ...prev };
          delete newDocs[docToRemove[0]];

          // Reorder document keys (doc1, doc2, etc.) - IMPORTANT FOR SEQUENTIAL NUMBERING
          const remainingDocs = Object.values(newDocs);
          const reorderedDocs = {};
          remainingDocs.forEach((doc, index) => {
            reorderedDocs[`doc${index + 1}`] = doc;
          });

          console.log('Reordered documents after removal:', reorderedDocs);
          return reorderedDocs;
        });
      }
    }

    // Remove file from uploaded files list regardless of status
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const FileDisplaySection = () => {
    if (uploadedFiles.length === 0 && fileUploadErrors.length === 0) return null;

    const getFileIcon = (fileType) => {
      if (fileType.includes('image')) {
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        );
      } else if (fileType.includes('pdf')) {
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
      return (
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusIcon = (status, fileId) => {
      switch (status) {
        case 'scanning':
          return (
            <div className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-blue-600 mr-1"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs text-blue-600 font-medium">Scanning...</span>
            </div>
          );
        case 'scanned':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-green-600 font-medium">Scanned</span>
            </div>
          );
        case 'scan_failed':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-red-600 font-medium">Virus Detected</span>
            </div>
          );
        case 'uploading':
          return (
            <div className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-blue-600 mr-1"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs text-blue-600 font-medium">Uploading...</span>
            </div>
          );
        case 'success':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-green-600 font-medium">Uploaded</span>
            </div>
          );
        case 'error':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-red-600 font-medium">Failed</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="mt-4">
        {/* File Upload Errors Section */}
        {fileUploadErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="text-sm font-medium text-red-800">File Upload Issues:</h4>
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              {fileUploadErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Files ({uploadedFiles.length}/5)
              </h4>
              {uploadedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFiles([]);
                    setDocumentsStructure({});
                    setFileUploadErrors([]);
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Remove All
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((fileData) => (
                <div
                  key={fileData.id}
                  className={`flex items-center justify-between border rounded-md p-3 transition-colors ${
                    fileData.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : fileData.status === 'scanned'
                        ? 'bg-green-50 border-green-200'
                        : fileData.status === 'scan_failed'
                          ? 'bg-red-50 border-red-200'
                          : fileData.status === 'error'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {getFileIcon(fileData.type)}
                    <div className="ml-3 flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={fileData.name}
                      >
                        {fileData.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(fileData.size)}</p>
                      {fileData.error && (
                        <p className="text-xs text-red-600 mt-1" title={fileData.error}>
                          Error: {fileData.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(fileData.status, fileData.id)}
                    <button
                      type="button"
                      onClick={() => removeFile(fileData.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove file"
                      disabled={fileData.status === 'uploading' || fileData.status === 'scanning'}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Documents Structure Debug Info (remove in production) */}
        {/*{Object.keys(documentsStructure).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <h5 className="text-xs font-medium text-gray-700 mb-2">
              Documents Structure ({Object.keys(documentsStructure).length} files ready):
            </h5>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(documentsStructure, null, 2)}
            </pre>
          </div>
        )}*/}
      </div>
    );
  };

  // Loading Modal Component
  const LoadingModal = () => {
    if (!isSubmitting) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-14 w-14 text-green-600 animate-spin mb-5" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center">
              Processing Your Request
            </h2>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Please wait while we process your complaint...
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Error Modal Component
  const ErrorModal = () => {
    if (!showErrorModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl text-center">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Submission Error</h2>
          <p className="text-gray-700 break-words">
            {apiResponse.message || 'An unknown error occurred.'}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 text-decoration-none"
              onClick={handleCloseModal}
            >
              Close
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nv language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-grow">
        {/* Hero section with gradient background */}
        <div className="bg-gradient-to-br from-[#14573a] to-[#1b8354] text-white py-12 md:py-16 relative overflow-hidden">
          <img
            src="/images/img_group_40016.png"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />

            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="md:w-3/4">
                {/* Page title */}
                <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
                  Complaint escalation service
                </h1>

                {/* Service type badge */}
                {/* <div className="inline-flex items-center px-2 py-1 bg-[#ecfdf3] border border-[#abefc6] rounded text-[#085d3a] text-xs font-medium mb-6">
                  Individual
                </div> */}

                {/* Service description */}
                <p className="text-lg md:text-xl leading-relaxed max-w-2xl">
                  This platform allows all beneficiaries to escalate water and sewage complaints to
                  service providers in case of dissatisfaction with the service.
                </p>
              </div>

              {/* Accessibility buttons */}
              {/* <div className="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-4 mt-6 md:mt-0">
                <button
                  className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border border-[#e5e7eb] shadow-lg flex items-center justify-center"
                  aria-label="Accessibility options"
                >
                  <img src="/images/img_leading_icon_35x35.svg" alt="Accessibility" className="w-7 h-7 md:w-8 md:h-8" />
                </button>

                <button
                  className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border border-[#e5e7eb] shadow-lg flex items-center justify-center"
                  aria-label="Help"
                >
                  <img src="/images/img_leading_icon_2.svg" alt="Help" className="w-7 h-7 md:w-8 md:h-8" />
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Complaint form */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative -mt-12 md:-mt-14 mb-12">
          <Card className="p-6 md:p-8 lg:p-12 mb-8">
            {isLoadingFields ? (
              <div className="flex flex-col items-center justify-center p-10">
                <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading form fields...</p>
              </div>
            ) : loadError ? (
              <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Form</h3>
                <p className="mt-4 text-gray-700">
                  Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Personal Information Section */}
                <div className="border border-[#e5e7eb] p-4 md:p-6 mb-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      onKeyDown={handleAlphaInput}
                      onPaste={handleAlphaPaste}
                      required
                      error={errors.firstName}
                      placeholder="Enter your first name"
                      maxLength={25}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      onKeyDown={handleAlphaInput}
                      onPaste={handleAlphaPaste}
                      required
                      error={errors.lastName}
                      placeholder="Enter your last name"
                      maxLength={25}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="National ID/Iqama"
                      name="nationalId"
                      value={formData.nationalId || ''}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      onPaste={handleNumericPaste}
                      required
                      error={errors.nationalId}
                      placeholder="Enter your National ID or Iqama"
                      maxLength={10}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      onPaste={handleNumericPaste}
                      required
                      error={errors.phoneNumber}
                      placeholder="e.g., 05xxxxxxxx"
                      maxLength={10}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <Dropdown
                      label="Region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      options={regions}
                      placeholder="Select Region"
                      required
                      error={errors.region}
                    />
                    {formData.region && (
                      <Dropdown
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        options={citiesOptions}
                        placeholder="Select City"
                        required
                        error={errors.city}
                      />
                    )}
                    <div className="flex flex-col gap-4">
                      <label className=" font-medium">
                        Do you belong to any of the following groups that may require additional support ?
                      </label>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <Radio
                            type="radio"
                            id="supportGroup-yes"
                            name="supportGroup"
                            value={1}
                            checked={formData.supportGroup === 1}
                            onChange={handleChange}
                            className="cursor-pointer gap-1"
                            label="Yes, an older adult"
                          />
                          <Radio
                            type="radio"
                            id="supportGroup-yess"
                            name="supportGroup"
                            value={2}
                            checked={formData.supportGroup === 2}
                            onChange={handleChange}
                            className="cursor-pointer gap-1"
                            label="Yes, person with disability"
                          />
                          <Radio
                            type="radio"
                            id="supportGroup-no"
                            name="supportGroup"
                            value={3}
                            checked={formData.supportGroup === 3}
                            onChange={handleChange}
                            className="cursor-pointer gap-1"
                            label="No"
                          />
                        </div>
                      {errors.supportGroup && (
                        <span className="text-red-500 text-sm">{errors.supportGroup}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Complaint Details Section */}
                <div className="border border-[#e5e7eb] p-4 md:p-6 mb-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
                    Complaint Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Dropdown
                      label="Related Entity"
                      name="relatedAuthority"
                      value={formData.relatedAuthority || ''}
                      onChange={handleChange}
                      options={relatedAuthorities}
                      placeholder="Select related entity"
                      required
                      error={errors.relatedAuthority}
                    />
                    <InputField
                      label="Complaint Number"
                      name="complaintNumber"
                      value={formData.complaintNumber || ''}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      onPaste={handleNumericPaste}
                      required
                      error={errors.complaintNumber}
                      placeholder="Enter previous complaint number"
                      maxLength={10}
                    />
                    <div className="col-span-1 md:col-span-2">
                      <InputField
                        label="Complaint Subject"
                        name="complaintSubject"
                        value={formData.complaintSubject || ''}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          const char = e.key;
                          // Allow control keys
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'Escape' ||
                            e.key === 'Enter' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'ArrowUp' ||
                            e.key === 'ArrowDown'
                          ) {
                            return;
                          }
                          // Allow Ctrl shortcuts
                          if (e.ctrlKey) return;

                          // Only allow English, Arabic, spaces, punctuation
                          if (!/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'"]+$/.test(char)) {
                            e.preventDefault();
                          }
                        }}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          if (
                            !/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'"]*$/.test(pastedText)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        required
                        error={errors.complaintSubject}
                        placeholder="Briefly describe the issue"
                        helperText={`${(formData.complaintSubject || '').length} / 100 characters`}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Complaint Message */}
                      <div>
                        <TextArea
                          label="Complaint Message"
                          name="complaintMessage"
                          value={formData.complaintMessage || ''}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            const char = e.key;
                            // Allow control keys
                            if (
                              e.key === 'Backspace' ||
                              e.key === 'Delete' ||
                              e.key === 'Tab' ||
                              e.key === 'Escape' ||
                              e.key === 'Enter' ||
                              e.key === 'ArrowLeft' ||
                              e.key === 'ArrowRight' ||
                              e.key === 'ArrowUp' ||
                              e.key === 'ArrowDown'
                            ) {
                              return;
                            }
                            // Allow Ctrl shortcuts
                            if (e.ctrlKey) return;

                            // Only allow English, Arabic, spaces, punctuation, newlines
                            if (!/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'"]+$/.test(char)) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            const pastedText = e.clipboardData.getData('text');
                            if (
                              !/^[a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'\n\r"]*$/.test(
                                pastedText
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                          rows={4}
                          required
                          error={errors.complaintMessage}
                          placeholder="Please provide a detailed description of your complaint..."
                          className="h-42 overflow-y-auto resize-none"
                          helperText={`${(formData.complaintMessage || '').length} / 128 characters`}
                        />
                        <div className="flex items-start mt-2">
                          <img
                            src="/images/img_feedback_icon.svg"
                            alt="Info"
                            className="w-4 h-4 mt-1 mr-2 flex-shrink-0"
                          />
                          <p className="text-sm text-gray-600">
                            Provide all necessary details, including dates, times, and the specific
                            nature of your dissatisfaction.
                          </p>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload File
                          <span className="text-xs text-gray-500 ml-1">
                            (Optional - Max 5 files)
                          </span>
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragOver
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            const files = Array.from(e.dataTransfer.files);
                            handleFileUpload(files);
                          }}
                        >
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                Drag and drop files here to upload
                              </p>
                              <p className="text-xs text-gray-500">
                                Maximum file size allowed is 5MB, supported file formats include .jpg, .png, and .pdf.
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                You can upload up to 5 files
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => document.getElementById('file-input').click()}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                              disabled={uploadedFiles.length >= 5}
                            >
                              {uploadedFiles.length >= 5 ? 'Maximum Files Reached' : 'Browse Files'}
                            </button>
                            <input
                              id="file-input"
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={handleFileInputChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                        <FileDisplaySection />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declaration Section */}
                <div className="mb-6">
                  <Checkbox
                    name="declaration"
                    checked={formData.declaration || false}
                    onChange={handleChange}
                    label="I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data"
                    error={errors.declaration}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant={formData.declaration ? 'primary' : 'secondary'}
                  className="w-full rounded-md font-medium hover:bg-darkgreen-300 transition-colors py-3 text-base"
                  disabled={isSubmitting || !formData.declaration}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
              </form>
            )}
          </Card>

          {/* Last update info */}
          <div className="bg-white py-4 px-6 md:px-8 lg:px-12 border-t border-gray-200 rounded-b-lg">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Last update date: 08/03/2025 01:04
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoadingModal />
      <ErrorModal />

      {/* Captcha Modal - Recaptcha component has its own modal */}
      <Recaptcha
        isOpen={showCaptchaModal}
        onClose={() => setShowCaptchaModal(false)}
        onSuccess={handleCaptchaSuccess}
        onError={(error) => {
          console.error('[ComplaintEscalation] Captcha error:', error);
        }}
        title="Security Verification Required"
      />

      {/* Success Modal - Using your ResponseModal component */}
      <ComplaintFeedbackForm
        isVisible={showSuccessModal}
        onClose={handleCloseModal}
        ticketNumber={ticketNumber}
        incidentId={incidentId} // Add this prop
        contactId={contactId} //
        onSubmit={handleFeedbackSubmit}
      />

      <Footer />
    </div>
  );
};

export default ComplaintEscalationPage;
