import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import ServiceRatingFeedback from './ServiceRatingFeedback';
import NoComplaintsModal from './ui/NoComplaintsModal';
import RequestLimitReachedModal from './ui/RequestLimitReachedModal';
import { CheckCircle, Star, AlertCircle, Loader2 } from 'lucide-react';
import { checkUserExists } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';
import config from '@/utils/config';
import Nv from '@/components/ServicesPage/NAVbAR/Navbar';
// Import the centralized language utils
import { 
  getStoredLanguage, 
  storeLanguage, 
  setupLanguageListener, 
  applyLanguageSettings,
  isRTL 
} from '../../../utils/LanguageUtils';

const PresidentStaff = () => {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };

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

  // Tab state
  const [activeTab, setActiveTab] = useState('suggestion'); // 'suggestion' or 'complaint'

  // Form state (will be built dynamically from API) - separate for each tab
  const [formData, setFormData] = useState({ suggestion: {}, complaint: {} });

  // State for regions and cities based on API data
  const [regions, setRegions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState({ suggestion: [], complaint: [] });

  // State for related authorities dropdown
  const [relatedAuthorities, setRelatedAuthorities] = useState([]);
  
  // State for Complaint Visit Request dropdowns
  const [relevantEntities, setRelevantEntities] = useState([
    { value: 'dummy_entity_1', label: 'Entity 1' },
    { value: 'dummy_entity_2', label: 'Entity 2' }
  ]);
  const [escalatedComplaintIds, setEscalatedComplaintIds] = useState([
    { value: 'dummy_complaint_1', label: 'Complaint ID 1' },
    { value: 'dummy_complaint_2', label: 'Complaint ID 2' }
  ]);

  // Form errors - separate for each tab
  const [errors, setErrors] = useState({ suggestion: {}, complaint: {} });

  // File upload state - separate for each tab
  const [uploadedFiles, setUploadedFiles] = useState({ suggestion: [], complaint: [] });
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
  
  // No Complaints Modal state
  const [noComplaintsModal, setNoComplaintsModal] = useState(0); // 1 to show, 0 to hide
  
  // Request Limit Reached Modal state
  const [requestLimitReachedModal, setRequestLimitReachedModal] = useState(0); // 1 to show, 0 to hide
  // Add this after your existing useState declarations
  const [userData, setUserData] = useState(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [documentsStructure, setDocumentsStructure] = useState({ suggestion: {}, complaint: {} });
  const [fileUploadErrors, setFileUploadErrors] = useState({ suggestion: [], complaint: [] });
  const [uploadingFiles, setUploadingFiles] = useState({ suggestion: new Set(), complaint: new Set() });
  // Field mapping to handle API field names vs UI field names
  const fieldMapping = {
    firstName: 'firstName',
    lastName: 'lastName',
    nationalId: 'nationalId',
    phoneNumber: 'phoneNumber',
    region: 'swa_regionid',
    city: 'city',
    relatedAuthority: 'swa_relatedauthorityid',
    complaintNumber: 'swa_complaintnumber',
    complaintSubject: 'title',
    complaintMessage: 'description'
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

      setIsLoadingFields(true);
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/incident/form`);
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setFormFields(data);

        // Extract regions from the form fields
        const regionField = data.find(field => field.name === 'swa_regionid' || field.lookupTarget === 'swa_region');

        if (regionField && regionField.options) {
          setRegions(regionField.options.map(region => ({
            value: region.id,
            label: region.name,
            cities: region.cities || []
          })));
        }

        // Extract related authorities from form fields
        const authorityField = data.find(field =>
          field.name === 'relatedAuthority' ||
          field.name === 'swa_relatedauthorityid' ||
          field.lookupTarget === 'authority'
        );

        if (authorityField && authorityField.options) {
          setRelatedAuthorities(authorityField.options.map(auth => ({
            value: auth.id,
            label: auth.name
          })));
        } else {
          const potentialAuthorityField = data.find(field =>
            field.name?.toLowerCase().includes('authority') ||
            field.label?.toLowerCase().includes('authority')
          );

          if (potentialAuthorityField && potentialAuthorityField.options) {
            setRelatedAuthorities(potentialAuthorityField.options.map(auth => ({
              value: auth.id,
              label: auth.name
            })));
          } else {
            console.warn('No authority field found in API response, using demo options');
            setRelatedAuthorities([
              { value: 'water_auth', label: 'Water Authority' },
              { value: 'sewage_auth', label: 'Sewage Authority' },
              { value: 'water_sewage_auth', label: 'Water and Sewage Authority' }
            ]);
          }
        }
        // Initialize formData with empty values based on field names from API for both tabs
        const initializeTabData = () => {
          const tabFormData = {};
          data.forEach(field => {
            tabFormData[field.name] = '';
          });

          // Populate with user data if available
          if (userData) {
            console.log('Populating form with user data:', userData);
            tabFormData['firstName'] = userData.firstName || '';
            tabFormData['lastName'] = userData.lastName || '';
            tabFormData['nationalId'] = userData.nationalId || userData.national_id || '';
            tabFormData['phoneNumber'] = userData.phoneNumber || userData.phone || '';
          }

          // Initialize other fields
          tabFormData['complaintNumber'] = '';
          tabFormData['complaintSubject'] = '';
          tabFormData['complaintMessage'] = '';
          // Meeting information defaults
          tabFormData['meetingOption'] = 'office'; // 'office' | 'online'
          tabFormData['visitSubject'] = '';
          tabFormData['visitPurpose'] = '';
          // Complaint Visit Request specific fields
          tabFormData['relevantEntity'] = '';
          tabFormData['hasPartyBeenMet'] = '';
          tabFormData['escalatedComplaintId'] = '';
          tabFormData['preferPartyPresent'] = '';

          // Add UI field names for easy access in form
          Object.keys(fieldMapping).forEach(uiField => {
            if (!tabFormData[uiField]) {
              tabFormData[uiField] = '';
            }
          });

          // Add declaration field
          tabFormData.declaration = false;

          return tabFormData;
        };

        setFormData({
          suggestion: initializeTabData(),
          complaint: initializeTabData()
        });
        setLoadError(null);
      } catch (error) {
        console.error('Error fetching form fields:', error);
        setLoadError(error.message);
      } finally {
        setIsLoadingFields(false);
      }
    };

    fetchFormFields();
  }, [isUserDataLoaded, userData]);
  useEffect(() => {
    if (isUserDataLoaded && userData && Object.keys(formData.suggestion).length > 0) {
      console.log('Updating form data with user information:', userData);

      // Since userData now comes from API, use direct properties - update both tabs
      setFormData(prevData => ({
        suggestion: {
          ...prevData.suggestion,
          firstName: userData.firstName || prevData.suggestion.firstName || '',
          lastName: userData.lastName || prevData.suggestion.lastName || '',
          nationalId: userData.nationalId || userData.national_id || prevData.suggestion.nationalId || '',
          phoneNumber: userData.phoneNumber || userData.phone || prevData.suggestion.phoneNumber || '',
        },
        complaint: {
          ...prevData.complaint,
          firstName: userData.firstName || prevData.complaint.firstName || '',
          lastName: userData.lastName || prevData.complaint.lastName || '',
          nationalId: userData.nationalId || userData.national_id || prevData.complaint.nationalId || '',
          phoneNumber: userData.phoneNumber || userData.phone || prevData.complaint.phoneNumber || '',
        }
      }));
    }
  }, [userData, isUserDataLoaded]);
  // Update cities when region changes for active tab
  useEffect(() => {
    const currentFormData = formData[activeTab];
    if (currentFormData?.region) {
      const selectedRegion = regions.find(r => r.value === currentFormData.region);

      if (selectedRegion && selectedRegion.cities) {
        const cities = selectedRegion.cities.map(city => ({
          value: city.id,
          label: city.name
        }));
        setCitiesOptions(prev => ({
          ...prev,
          [activeTab]: cities
        }));

        // Reset city when region changes only if the city is not valid for the new region
        if (currentFormData.city && !selectedRegion.cities.some(city => city.id === currentFormData.city)) {
          setFormData(prev => ({
            ...prev,
            [activeTab]: {
              ...prev[activeTab],
              city: ''
            }
          }));
        }
      } else {
        // Add dummy data if no cities available
        setCitiesOptions(prev => ({
          ...prev,
          [activeTab]: [
            { value: 'dummy_city_1', label: 'City 1' },
            { value: 'dummy_city_2', label: 'City 2' }
          ]
        }));
      }
    } else {
      // Add dummy data if no region selected
      setCitiesOptions(prev => ({
        ...prev,
        [activeTab]: [
          { value: 'dummy_city_1', label: 'City 1' },
          { value: 'dummy_city_2', label: 'City 2' }
        ]
      }));
    }
  }, [formData[activeTab]?.region, regions, activeTab]);

  // Load user data from localStorage

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Main Page', path: '/' },
    { label: 'Contact Us', path: '/PresidentStaff' },
    { label: 'Contact His Excellency the President of the Saudi Water Authority', active: true },
  ];

  // Handle input changes
  // Helper function to count words
  const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  const handleAlphaInput = (e) => {
    const char = e.key;
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' ||
      e.key === 'Escape' || e.key === 'Enter' || e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'z')) {
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
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' ||
      e.key === 'Escape' || e.key === 'Enter' || e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'z')) {
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
        } else if (fieldValue.length > 1000) {
          error = `Complaint message cannot exceed 5000 characters (current: ${fieldValue.length} characters)`;
        }
        break;

      case 'region':
        if (!fieldValue) error = 'Region is required';
        break;
 
      case 'city':
        if (!fieldValue) error = 'City is required';
        break;

      case 'declaration':
        if (!fieldValue) error = 'You must agree to the declaration';
        break;
      // Meeting Information
      case 'meetingOption':
        if (!fieldValue) error = 'Please select a meeting option';
        break;
      case 'visitSubject':
        if (!fieldValue?.trim()) error = 'Visit Subject is required';
        break;
      case 'visitPurpose':
        if (!fieldValue?.trim()) {
          error = 'Visit Purpose is required';
        } else if (fieldValue.length > 1000) {
          error = `Visit Purpose cannot exceed 1000 characters (current: ${fieldValue.length} characters)`;
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Enhanced handleChange function with input filtering
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const apiFieldName = Object.entries(fieldMapping).find(([uiField, apiField]) => uiField === name)?.[1];
    let fieldValue = type === 'checkbox' ? checked : value;

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
      if (fieldValue.length > 1000) {
        fieldValue = fieldValue.slice(0, 1000);
      }
    }

    if (name === 'visitPurpose') {
      // Remove non-English/Arabic characters
      fieldValue = fieldValue.replace(/[^a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-.,!?()'\n\r"]/g, '');
      if (fieldValue.length > 1000) {
        fieldValue = fieldValue.slice(0, 1000);
      }
    }

    // Update form data for active tab
    setFormData(prevData => {
      const updatedTabData = {
        ...prevData[activeTab],
        [name]: fieldValue
      };

      if (apiFieldName && apiFieldName !== name) {
        updatedTabData[apiFieldName] = fieldValue;
      }

      return {
        ...prevData,
        [activeTab]: updatedTabData
      };
    });

    // Real-time validation for active tab
    const fieldError = validateField(name, fieldValue);
    setErrors(prevErrors => ({
      ...prevErrors,
      [activeTab]: {
        ...prevErrors[activeTab],
        [name]: fieldError
      }
    }));
  };

  // Validate form for active tab
  const validateForm = () => {
    const currentFormData = formData[activeTab];
    const newErrors = {};

    // First Name validation - English letters, spaces, and hyphens with 25 character limit
    if (!currentFormData.firstName?.trim()) {
      newErrors.firstName = 'First Name is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(currentFormData.firstName.trim())) {
      newErrors.firstName = 'First Name can only contain English letters, spaces, and hyphens';
    } else if (currentFormData.firstName.trim().length > 25) {
      newErrors.firstName = 'First Name cannot exceed 25 characters';
    }

    // Last Name validation - English letters, spaces, and hyphens with 25 character limit
    if (!currentFormData.lastName?.trim()) {
      newErrors.lastName = 'Last Name is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(currentFormData.lastName.trim())) {
      newErrors.lastName = 'Last Name can only contain English letters, spaces, and hyphens';
    } else if (currentFormData.lastName.trim().length > 25) {
      newErrors.lastName = 'Last Name cannot exceed 25 characters';
    }

    // National ID validation - numbers only, start with 1 or 2, exactly 10 digits
    if (!currentFormData.nationalId?.trim()) {
      newErrors.nationalId = 'National ID/Iqama is required';
    } else if (!/^[12]\d{9}$/.test(currentFormData.nationalId.trim())) {
      newErrors.nationalId = 'National ID must be exactly 10 digits, starting with 1 or 2';
    }

    // Phone Number validation - must start with 05 and follow Saudi format
    if (!currentFormData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^05\d{8}$/.test(currentFormData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone Number must start with "05" and be exactly 10 digits (05XXXXXXXX)';
    }

    // Region validation
    if (!currentFormData.region) newErrors.region = 'Region is required';

    // City validation
    if (!currentFormData.city) newErrors.city = 'City is required';

    // Meeting Information validation
    if (!currentFormData.meetingOption) newErrors.meetingOption = 'Please select a meeting option';
    
    // Complaint Visit Request specific validation
    if (activeTab === 'complaint') {
      if (!currentFormData.relevantEntity) newErrors.relevantEntity = 'Relevant Entity is required';
      if (!currentFormData.hasPartyBeenMet) newErrors.hasPartyBeenMet = 'Please select whether the relevant party has been met';
      if (!currentFormData.escalatedComplaintId) newErrors.escalatedComplaintId = 'Escalated Complaint ID to the Authority is required';
      if (!currentFormData.preferPartyPresent) newErrors.preferPartyPresent = 'Please select whether you prefer the relevant party to be present';
    }
    
    if (!currentFormData.visitSubject?.trim()) newErrors.visitSubject = 'Visit Subject is required';
    if (!currentFormData.visitPurpose?.trim()) {
      newErrors.visitPurpose = 'Visit Purpose is required';
    } else if (currentFormData.visitPurpose.length > 1000) {
      newErrors.visitPurpose = `Visit Purpose cannot exceed 1000 characters (current: ${currentFormData.visitPurpose.length} characters)`;
    }

    // Declaration validation
    if (!currentFormData.declaration) newErrors.declaration = 'You must agree to the declaration';

    setErrors(prev => ({
      ...prev,
      [activeTab]: newErrors
    }));
    return Object.keys(newErrors).length === 0;
  };

  // Prepare backend payload for active tab
  const preparePayload = () => {
    const currentFormData = formData[activeTab];
    // Start with the current tab's form data
    const payload = { ...currentFormData };

    // Map UI field values to API field names
    Object.entries(fieldMapping).forEach(([uiField, apiField]) => {
      if (apiField !== uiField) {
        // If API field exists and is different from UI field, ensure it has the correct value
        payload[apiField] = currentFormData[uiField];
      }
    });

    // Add documents structure if files were uploaded successfully for active tab
    if (Object.keys(documentsStructure[activeTab] || {}).length > 0) {
      payload.documents = documentsStructure[activeTab];
    }
    // Include meeting information
    payload.meetingOption = currentFormData.meetingOption;
    payload.visitSubject = currentFormData.visitSubject;
    payload.visitPurpose = currentFormData.visitPurpose;
    
    // Include Complaint Visit Request specific fields
    if (activeTab === 'complaint') {
      payload.relevantEntity = currentFormData.relevantEntity;
      payload.hasPartyBeenMet = currentFormData.hasPartyBeenMet;
      payload.escalatedComplaintId = currentFormData.escalatedComplaintId;
      payload.preferPartyPresent = currentFormData.preferPartyPresent;
    }

    console.log('Payload with documents:', payload);
    return payload;
  };

  // API call to submit form data
  const submitFormToBackend = async (data) => {
    try {
      // Prepare payload with correct API field names
      const payload = preparePayload();

      // Log the form data to console before sending to API
      console.log("Submitting form data:", payload);

      const response = await fetch(`${config.API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

    // Log current form data before validation
    console.log("Current form data (before validation):", formData[activeTab]);

    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // Submit form data to backend using real API for active tab
        const result = await submitFormToBackend(formData[activeTab]);

        if (result.success) {
          // Extract ticket number from API response
          // The ticket number comes from your main form submission endpoint
          const responseTicketNumber = result.data?.ticknumber || null;
          const responseIncidentId = result.data?.incidentId || null;
          const responseContactId = result.data?.contactid || null

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
            contactId: responseContactId
          });

          // Show success modal with the real ticket number from API
          setShowSuccessModal(true);

          // Reset form on success
          const emptyFormData = {};
          Object.keys(formData).forEach(key => {
            emptyFormData[key] = '';
          });
          emptyFormData.declaration = false;
          setFormData(emptyFormData);

        } else {
          // Handle API error
          setApiResponse({
            success: false,
            message: result.message || 'Failed to submit your complaint. Please try again later.'
          });
          setShowErrorModal(true);
        }

      } catch (error) {
        console.error("Error in submit handler:", error);
        setApiResponse({
          success: false,
          message: 'Failed to submit your complaint. Please try again later.'
        });
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form validation failed. Errors:", errors);

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
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/virus-scanclam`, {
        method: 'POST',
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketType', 'cust');  // Add bucketType parameter
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/upload`, {
        method: 'POST',
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
  // File upload functionality with virus scanning for active tab
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    const maxFiles = 5; // Maximum 5 files allowed
    const currentUploadedFiles = uploadedFiles[activeTab] || [];

    // Check if total files would exceed limit
    if (currentUploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files. Currently you have ${currentUploadedFiles.length} files.`);
      return;
    }

    const validFiles = [];
    const newFileUploadErrors = [];

    // Validate files first
    Array.from(files).forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        newFileUploadErrors.push(`File "${file.name}" is not supported. Please upload .jpg, .png, or .pdf files only.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        newFileUploadErrors.push(`File "${file.name}" is too large. Maximum file size is 2MB.`);
        return;
      }

      // Check if file already exists (by name and size)
      const fileExists = currentUploadedFiles.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      );

      if (fileExists) {
        newFileUploadErrors.push(`File "${file.name}" is already uploaded.`);
        return;
      }

      validFiles.push(file);
    });

    // Update file upload errors for active tab
    if (newFileUploadErrors.length > 0) {
      setFileUploadErrors(prev => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), ...newFileUploadErrors]
      }));
      // Auto-clear errors after 5 seconds
      setTimeout(() => {
        setFileUploadErrors(prev => ({
          ...prev,
          [activeTab]: (prev[activeTab] || []).filter(error => !newFileUploadErrors.includes(error))
        }));
      }, 5000);
    }

    // SEQUENTIAL PROCESSING - Scan and upload files one by one
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = Date.now() + Math.random() + i; // Ensure unique ID

      console.log(`Processing file ${i + 1}/${validFiles.length}: ${file.name}`);

      // Add file to uploading state for active tab
      setUploadingFiles(prev => ({
        ...prev,
        [activeTab]: new Set([...(prev[activeTab] || []), fileId])
      }));

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
        scanResult: null
      };

      setUploadedFiles(prev => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), fileWithMetadata]
      }));

      try {
        // STEP 1: Scan file for viruses
        console.log(`Scanning file: ${file.name}`);
        const scanResult = await scanSingleFile(file);
        
        if (!scanResult.success) {
          // Virus detected or scan failed
          console.error(`Scan failed for file: ${file.name}`, scanResult.data?.error || scanResult.message);
          
          // Update file status to scan_failed for active tab
          setUploadedFiles(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).map(f =>
              f.id === fileId
                ? { 
                    ...f, 
                    status: 'scan_failed', 
                    error: scanResult.data?.error || 'Virus detected in file',
                    scanResult: scanResult.data
                  }
                : f
            )
          }));

          // Add to file upload errors for active tab
          const errorMessage = scanResult.data?.error || 'Virus detected in file';
          setFileUploadErrors(prev => ({
            ...prev,
            [activeTab]: [...(prev[activeTab] || []), `Scan failed for "${file.name}": ${errorMessage}`]
          }));
          
          // Skip upload for infected files
          continue;
        }

        // STEP 2: File is clean, update status to scanned for active tab
        console.log(`File is clean: ${file.name}`, scanResult.data);
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: (prev[activeTab] || []).map(f =>
            f.id === fileId
              ? { 
                  ...f, 
                  status: 'scanned', 
                  scanResult: scanResult.data
                }
              : f
          )
        }));

        // STEP 3: Upload clean file
        console.log(`Uploading clean file: ${file.name}`);
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: (prev[activeTab] || []).map(f =>
            f.id === fileId
              ? { ...f, status: 'uploading' }
              : f
          )
        }));

        const uploadResult = await uploadSingleFile(file);

        if (uploadResult.success) {
          console.log(`Successfully uploaded: ${file.name}`, uploadResult.data);

          // Update file status to success for active tab
          setUploadedFiles(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).map(f =>
              f.id === fileId
                ? { ...f, status: 'success', uploadResponse: uploadResult.data }
                : f
            )
          }));

          // Update documents structure with proper sequential numbering for active tab
          setDocumentsStructure(prev => {
            const currentDocs = prev[activeTab] || {};
            const currentDocCount = Object.keys(currentDocs).length;
            const docKey = `doc${currentDocCount + 1}`;

            const newStructure = {
              ...prev,
              [activeTab]: {
                ...currentDocs,
                [docKey]: {
                  message: uploadResult.data.message,
                  bucketType: uploadResult.data.bucketType,
                  fileName: uploadResult.data.fileName,
                  url: uploadResult.data.url,
                  originalFileName: file.name,
                  fileSize: file.size,
                  fileType: file.type,
                  uploadDate: new Date().toISOString(),
                  scanResult: scanResult.data // Include scan result in document structure
                }
              }
            };

            console.log(`Added document ${docKey} to structure:`, newStructure);
            return newStructure;
          });

        } else {
          console.error(`Failed to upload: ${file.name}`, uploadResult.message);

          // Update file status to error for active tab
          setUploadedFiles(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).map(f =>
              f.id === fileId
                ? { ...f, status: 'error', error: uploadResult.message }
                : f
            )
          }));

          // Add to file upload errors for active tab
          setFileUploadErrors(prev => ({
            ...prev,
            [activeTab]: [...(prev[activeTab] || []), `Failed to upload "${file.name}": ${uploadResult.message}`]
          }));
        }
      } catch (error) {
        console.error(`Unexpected error processing file: ${file.name}`, error);

        // Handle unexpected errors for active tab
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: (prev[activeTab] || []).map(f =>
            f.id === fileId
              ? { ...f, status: 'error', error: 'Unexpected error occurred' }
              : f
          )
        }));

        setFileUploadErrors(prev => ({
          ...prev,
          [activeTab]: [...(prev[activeTab] || []), `Failed to process "${file.name}": Unexpected error occurred`]
        }));
      } finally {
        // Remove from uploading state for active tab
        setUploadingFiles(prev => {
          const currentSet = prev[activeTab] || new Set();
          const newSet = new Set(currentSet);
          newSet.delete(fileId);
          return {
            ...prev,
            [activeTab]: newSet
          };
        });
      }

      // Add a small delay between processing to prevent overwhelming the server
      if (i < validFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      }
    }

    console.log('All files processed. Final document structure will be updated.');
  };

  const removeFile = (fileId) => {
    const currentUploadedFiles = uploadedFiles[activeTab] || [];
    const fileToRemove = currentUploadedFiles.find(f => f.id === fileId);

    // Only remove from documents structure if file was successfully uploaded
    if (fileToRemove && (fileToRemove.status === 'success' || fileToRemove.status === 'scanned')) {
      // Find and remove from documents structure for active tab
      const currentDocs = documentsStructure[activeTab] || {};
      const docEntries = Object.entries(currentDocs);
      const docToRemove = docEntries.find(([key, doc]) =>
        doc.originalFileName === fileToRemove.name &&
        doc.fileSize === fileToRemove.size
      );

      if (docToRemove) {
        setDocumentsStructure(prev => {
          const currentDocs = { ...(prev[activeTab] || {}) };
          delete currentDocs[docToRemove[0]];

          // Reorder document keys (doc1, doc2, etc.) - IMPORTANT FOR SEQUENTIAL NUMBERING
          const remainingDocs = Object.values(currentDocs);
          const reorderedDocs = {};
          remainingDocs.forEach((doc, index) => {
            reorderedDocs[`doc${index + 1}`] = doc;
          });

          console.log('Reordered documents after removal:', reorderedDocs);
          return {
            ...prev,
            [activeTab]: reorderedDocs
          };
        });
      }
    }

    // Remove file from uploaded files list regardless of status for active tab
    setUploadedFiles(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(file => file.id !== fileId)
    }));
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
    const currentUploadedFiles = uploadedFiles[activeTab] || [];
    const currentFileUploadErrors = fileUploadErrors[activeTab] || [];
    if (currentUploadedFiles.length === 0 && currentFileUploadErrors.length === 0) return null;

    const getFileIcon = (fileType) => {
      if (fileType.includes('image')) {
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      } else if (fileType.includes('pdf')) {
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      }
      return (
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
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

    const getStatusIcon = (status) => {
      switch (status) {
        case 'success':
        case 'scanned':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 19.1666C15.0626 19.1666 19.1667 15.0626 19.1667 9.99998C19.1667 4.93737 15.0626 0.833313 10 0.833313C4.9374 0.833313 0.833344 4.93737 0.833344 9.99998C0.833344 15.0626 4.9374 19.1666 10 19.1666Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M10 19.1666C15.0626 19.1666 19.1667 15.0626 19.1667 9.99998C19.1667 4.93737 15.0626 0.833313 10 0.833313C4.9374 0.833313 0.833344 4.93737 0.833344 9.99998C0.833344 15.0626 4.9374 19.1666 10 19.1666ZM5.87519 9.26775C5.54975 9.59318 5.54975 10.1208 5.87519 10.4463L8.23221 12.8033C8.55765 13.1287 9.08529 13.1287 9.41072 12.8033L14.1248 8.08923C14.4502 7.7638 14.4502 7.23616 14.1248 6.91072C13.7993 6.58529 13.2717 6.58529 12.9463 6.91072L8.82147 11.0355L7.0537 9.26775C6.72827 8.94231 6.20063 8.94231 5.87519 9.26775Z" fill="#067647"/>
            </svg>
          );
        case 'scanning':
        case 'uploading':
          return (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#161616" strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
              <path d="M10 2L10 6M10 14L10 18M2 10L6 10M14 10L18 10" stroke="#161616" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 2C12.5 2 14.5 3.5 15.5 5.5" stroke="#161616" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          );
        case 'scan_failed':
        case 'error':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 19.1666C15.0626 19.1666 19.1667 15.0626 19.1667 9.99998C19.1667 4.93737 15.0626 0.833313 10 0.833313C4.9374 0.833313 0.833344 4.93737 0.833344 9.99998C0.833344 15.0626 4.9374 19.1666 10 19.1666Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M10 19.1666C15.0626 19.1666 19.1667 15.0626 19.1667 9.99998C19.1667 4.93737 15.0626 0.833313 10 0.833313C4.9374 0.833313 0.833344 4.93737 0.833344 9.99998C0.833344 15.0626 4.9374 19.1666 10 19.1666ZM10 5.83331C9.53977 5.83331 9.16668 6.20641 9.16668 6.66665V9.99998C9.16668 10.4602 9.53977 10.8333 10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 9.99998V6.66665C10.8333 6.20641 10.4602 5.83331 10 5.83331ZM10 12.5C9.53977 12.5 9.16668 12.8731 9.16668 13.3333C9.16668 13.7935 9.53977 14.1666 10 14.1666C10.4602 14.1666 10.8333 13.7935 10.8333 13.3333C10.8333 12.8731 10.4602 12.5 10 12.5Z" fill="#B42318"/>
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="mt-4">
        {/* File Upload Errors Section */}
        {currentFileUploadErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-medium text-red-800">File Upload Issues:</h4>
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              {currentFileUploadErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Uploaded Files Section */}
        {currentUploadedFiles.length > 0 && (
          <>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentUploadedFiles.map((fileData) => (
                <div key={fileData.id}>
                  <div className={`flex items-center justify-between border rounded-md p-3 transition-colors ${
                    fileData.status === 'success' || fileData.status === 'scanned' ? 'bg-gray-50 border-gray-200' :
                    fileData.status === 'scan_failed' || fileData.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`} style={{ width: '469px', backgroundColor: '#F3F4F6' }}>
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="mr-3 flex-shrink-0">
                        {getStatusIcon(fileData.status)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate" title={fileData.name}>
                        {fileData.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(fileData.id)}
                      className="ml-3 flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
                      title="Remove file"
                      disabled={fileData.status === 'uploading' || fileData.status === 'scanning'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.146447 0.146447C0.341709 -0.0488155 0.658292 -0.0488155 0.853554 0.146447L4.5 3.79289L8.14645 0.146447C8.34171 -0.0488153 8.65829 -0.0488153 8.85355 0.146447C9.04882 0.341709 9.04882 0.658292 8.85355 0.853554L5.20711 4.5L8.85355 8.14645C9.04882 8.34171 9.04882 8.65829 8.85355 8.85355C8.65829 9.04882 8.34171 9.04882 8.14645 8.85355L4.5 5.20711L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.79289 4.5L0.146447 0.853553C-0.0488153 0.658291 -0.0488153 0.341709 0.146447 0.146447Z" fill="#161616"/>
                      </svg>
                    </button>
                  </div>
                  {(fileData.status === 'scan_failed' || fileData.status === 'error') && fileData.error && (
                    <p className="text-xs text-red-600 mt-1 ml-8">
                      {fileData.error.includes('Maximum file size') 
                        ? 'Maximum file size allowed is 2MB. Supported formats: .jpg, .png, .pdf.'
                        : fileData.error}
                    </p>
                  )}
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
              <div className="h-full bg-green-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Submission Error
          </h2>
          <p className="text-gray-700 break-words">
            {apiResponse.message || "An unknown error occurred."}
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
    <div className="min-h-screen flex flex-col bg-white">
      <Nv language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-grow">
        {/* Hero section with gradient background */}
        <div className="bg-gradient-to-br from-[#14573a] to-[#1b8354] text-white py-12 md:py-16 relative overflow-hidden">
          <img src="/images/img_group_40016.png" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />

            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="md:w-3/4">
                {/* Page title */}
                <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
                  Contact His Excellency the President of the Saudi Water Authority
                </h1>

                {/* Service type badge */}
                {/* <div className="inline-flex items-center px-2 py-1 bg-[#ecfdf3] border border-[#abefc6] rounded text-[#085d3a] text-xs font-medium mb-6">
                  Individual
                </div> */}

                {/* Service description */}
                <p className="text-lg md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-12">
                  This service enables beneficiaries to submit feedback, and complaints through various channels. It reflects the Saudi Water Authority's commitment to enhancing communication and addressing beneficiary needs effectively.
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
                <p className="text-red-600">{loadError}</p>
                <p className="mt-4 text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Tab Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 mb-14 pb-0">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('suggestion')}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors outline-none focus:outline-none ${
                        activeTab === 'suggestion'
                          ? 'border-[#1B8354] text-[#1B8354]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      style={activeTab === 'suggestion' ? { width: '480px' } : {}}
                    >
                      Suggestion Visit Request
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('complaint')}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors outline-none focus:outline-none ${
                        activeTab === 'complaint'
                          ? 'border-[#1B8354] text-[#1B8354]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      style={activeTab === 'complaint' ? { width: '480px' } : {}}
                    >
                      Complaint Visit Request
                    </button>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Applicant Information</h3>
                  <hr className="border-[#e5e7eb] my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={formData[activeTab]?.firstName || ''}
                      onChange={handleChange}
                      onKeyDown={handleAlphaInput}
                      onPaste={handleAlphaPaste}
                      required
                      error={errors[activeTab]?.firstName}
                      placeholder="Enter your first name"
                      maxLength={25}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={formData[activeTab]?.lastName || ''}
                      onChange={handleChange}
                      onKeyDown={handleAlphaInput}
                      onPaste={handleAlphaPaste}
                      required
                      error={errors[activeTab]?.lastName}
                      placeholder="Enter your last name"
                      maxLength={25}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="National ID/Iqama"
                      name="nationalId"
                      value={formData[activeTab]?.nationalId || ''}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      onPaste={handleNumericPaste}
                      required
                      error={errors[activeTab]?.nationalId}
                      placeholder="Enter your National ID or Iqama"
                      maxLength={10}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData[activeTab]?.phoneNumber || ''}
                      onChange={handleChange}
                      onKeyDown={handleNumericInput}
                      onPaste={handleNumericPaste}
                      required
                      error={errors[activeTab]?.phoneNumber}
                      placeholder="e.g., 05xxxxxxxx"
                      maxLength={10}
                      disabled={isUserDataLoaded && userData} // Only disable if user data exists AND has firstName
                      readOnly={isUserDataLoaded && userData}
                    />
                    <Dropdown
                      label="Region"
                      name="region"
                      value={formData[activeTab]?.region || ''}
                      onChange={handleChange}
                      options={regions}
                      placeholder="Select Region"
                      required
                      error={errors[activeTab]?.region}
                    />
                    <Dropdown
                      label="City"
                      name="city"
                      value={formData[activeTab]?.city || ''}
                      onChange={handleChange}
                      options={citiesOptions[activeTab] || []}
                      placeholder="Select City"
                      required
                      error={errors[activeTab]?.city}
                    />
                  </div>
                </div>

                {/* Meeting Information Section */}
                <div className="mb-6 mt-14">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Meeting Information</h3>
                  <hr className="border-[#e5e7eb] my-4" />
                  <div className="grid grid-cols-1 gap-6">
                    {/* Meeting Options */}
                    <div>
                      <label className="block text-[14px] font-semibold text-[#161616] mb-2">
                        <span className="text-[#b42318] mr-1 text-[14px]">*</span>Meeting Options
                      </label>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="meetingOption"
                            value="office"
                            checked={formData[activeTab]?.meetingOption === 'office'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-[14px] text-[#161616] font-medium">President Office (Riyadh)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="meetingOption"
                            value="online"
                            checked={formData[activeTab]?.meetingOption === 'online'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-[14px] text-[#161616] font-medium">Online (Virtual Meeting)</span>
                        </label>
                      </div>
                      {errors[activeTab]?.meetingOption && <p className="mt-1 text-[#b42318] text-sm">{errors[activeTab].meetingOption}</p>}
                    </div>

                    {/* Complaint Visit Request Specific Fields */}
                    {activeTab === 'complaint' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Relevant Entity */}
                          <Dropdown
                            label="Relevant Entity"
                            name="relevantEntity"
                            value={formData[activeTab]?.relevantEntity || ''}
                            onChange={handleChange}
                            options={relevantEntities}
                            placeholder="Select your Escalated Complaint ID"
                            required
                            error={errors[activeTab]?.relevantEntity}
                          />
                          
                          {/* Has the relevant party been met? */}
                          <div>
                            <label className="block text-[14px] font-semibold text-[#161616] mb-2">
                              <span className="text-[#b42318] mr-1 text-[14px]">*</span>Has the relevant party been met?
                            </label>
                            <div className="flex items-center space-x-6">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="hasPartyBeenMet"
                                  value="yes"
                                  checked={formData[activeTab]?.hasPartyBeenMet === 'yes'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-[14px] text-[#161616] font-medium">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="hasPartyBeenMet"
                                  value="no"
                                  checked={formData[activeTab]?.hasPartyBeenMet === 'no'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-[14px] text-[#161616] font-medium">No</span>
                              </label>
                            </div>
                            {errors[activeTab]?.hasPartyBeenMet && <p className="mt-1 text-[#b42318] text-sm">{errors[activeTab].hasPartyBeenMet}</p>}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Escalated Complaint ID to the Authority */}
                          <Dropdown
                            label="Escalated Complaint ID to the Authority"
                            name="escalatedComplaintId"
                            value={formData[activeTab]?.escalatedComplaintId || ''}
                            onChange={handleChange}
                            options={escalatedComplaintIds}
                            placeholder="Select your Escalated Complaint ID"
                            required
                            error={errors[activeTab]?.escalatedComplaintId}
                          />
                          
                          {/* Would you prefer the relevant party to be present at the interview? */}
                          <div>
                            <label className="block text-[14px] font-semibold text-[#161616] mb-2">
                              <span className="text-[#b42318] mr-1 text-[14px]">*</span>Would you prefer the relevant party to be present at the interview?
                            </label>
                            <div className="flex items-center space-x-6">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="preferPartyPresent"
                                  value="yes"
                                  checked={formData[activeTab]?.preferPartyPresent === 'yes'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-[14px] text-[#161616] font-medium">Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="preferPartyPresent"
                                  value="no"
                                  checked={formData[activeTab]?.preferPartyPresent === 'no'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-[#1B8354] accent-[#1B8354] hover:accent-[#1B8354] hover:text-[#1B8354] border-gray-300 outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-[14px] text-[#161616] font-medium">No</span>
                              </label>
                            </div>
                            {errors[activeTab]?.preferPartyPresent && <p className="mt-1 text-[#b42318] text-sm">{errors[activeTab].preferPartyPresent}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visit Subject and Purpose */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Visit Subject"
                        name="visitSubject"
                        value={formData[activeTab]?.visitSubject || ''}
                        onChange={handleChange}
                        required
                        error={errors[activeTab]?.visitSubject}
                        placeholder="Enter visit subject"
                      />
                      <TextArea
                        label="Visit Purpose"
                        name="visitPurpose"
                        value={formData[activeTab]?.visitPurpose || ''}
                        onChange={handleChange}
                        rows={3}
                        required
                        error={errors[activeTab]?.visitPurpose}
                        placeholder="Describe the purpose of the visit"
                        className="md:col-span-1"
                        maxLength={1000}
                        helperText={`${(formData[activeTab]?.visitPurpose || '').length} / 1000 characters`}
                      />
                    </div>
                  </div>
                </div>

                {/* Required Attachments Section */}
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Required Attachments</h3>
                  <hr className="border-[#e5e7eb] my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* File Upload */}
                    <div className="md:col-start-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload File
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-300'
                            }`}
                          style={{ width: '469px', height: '220px', backgroundColor: isDragOver ? undefined : '#F3F4F6' }}
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
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.2498 0.00012207C13.4108 0.00012207 15.153 0.00012207 16.48 0.93512C16.861 1.20312 17.2 1.52312 17.49 1.88612C18.501 3.15712 18.501 4.78412 18.501 8.02312V10.5681C18.501 13.6231 18.501 15.1561 17.979 16.4721C17.145 18.5771 15.389 20.2341 13.161 21.0161C11.9597 21.4369 10.5748 21.4911 8.10332 21.4981C8.091 21.4991 8.07868 21.5002 8.06633 21.5011C8.05186 21.5022 8.03781 21.5011 8.02406 21.4983C7.68151 21.4991 7.3183 21.4991 6.93208 21.4991C5.05016 21.4991 4.10498 21.4991 3.26699 21.2051C1.90599 20.7271 0.831995 19.7131 0.320995 18.4241C0 17.6151 0 16.7181 0 14.9322V10.4195C0 10.0055 0.336 9.66954 0.75 9.66954C1.164 9.66954 1.5 10.0055 1.5 10.4195V14.9321C1.5 16.528 1.5 17.3291 1.71499 17.8721C2.06599 18.7571 2.81301 19.4571 3.76301 19.7911C4.36001 20.0011 5.21899 20.0011 6.93096 20.0011C7.3134 20.0011 7.67207 20.0011 8.00907 20.0003C9.31194 19.8699 10.333 18.7668 10.333 17.4302C10.333 17.2703 10.325 17.098 10.3166 16.9158L10.3147 16.8753C10.2898 16.3308 10.2615 15.7142 10.415 15.1382C10.638 14.3062 11.293 13.6512 12.125 13.4282C12.7006 13.2749 13.3159 13.303 13.8612 13.3279L13.9011 13.3298C14.0839 13.3382 14.2567 13.3462 14.417 13.3462C15.8166 13.3462 16.9602 12.2266 16.999 10.8361C16.999 10.7486 16.999 10.6597 16.999 10.5693V8.02412C16.999 5.13312 16.999 3.68212 16.314 2.82112C16.114 2.57012 15.879 2.34812 15.614 2.16312C14.715 1.53012 13.2368 1.50212 10.2478 1.50212C9.83381 1.50212 9.49781 1.16612 9.49781 0.752123C9.49781 0.338123 9.83381 0.00212288 10.2478 0.00212288L10.2498 0.00012207ZM16.9444 13.9677C16.2486 14.5176 15.3704 14.8462 14.417 14.8462C14.2262 14.8462 14.0311 14.8376 13.8405 14.8291C13.8263 14.8285 13.8121 14.8279 13.798 14.8272L13.7821 14.8265C13.3281 14.8057 12.8609 14.7843 12.513 14.8782C12.198 14.9622 11.949 15.2112 11.865 15.5262C11.7712 15.8784 11.7929 16.351 11.8138 16.808L11.814 16.8112C11.824 17.0152 11.833 17.2252 11.833 17.4302C11.833 18.3662 11.5163 19.2298 10.9844 19.9193C11.6626 19.8623 12.1962 19.7658 12.663 19.6021C14.48 18.9641 15.909 17.6221 16.583 15.9211C16.7875 15.4049 16.8915 14.7948 16.9444 13.9677Z" fill="#161616"/>
                                <path d="M2.83933 3.10943C2.64711 3.35416 2.44487 3.61127 2.28781 3.77286C1.99911 4.06989 1.52428 4.07664 1.22726 3.78793C0.930234 3.49923 0.923487 3.02441 1.21219 2.72738C1.30089 2.63612 1.44651 2.45431 1.65971 2.18288L1.70675 2.12296C1.89683 1.88082 2.1198 1.59675 2.34954 1.32563C2.59574 1.03507 2.87131 0.73328 3.14679 0.498659C3.28484 0.381083 3.44043 0.265114 3.60782 0.175536C3.76926 0.089142 3.99172 0.00012207 4.25 0.00012207C4.50829 0.00012207 4.73074 0.089142 4.89218 0.175536C5.05957 0.265114 5.21517 0.381083 5.35321 0.498658C5.62869 0.73328 5.90426 1.03507 6.15047 1.32563C6.3802 1.59675 6.60317 1.8808 6.79324 2.12295L6.84029 2.18288C7.05349 2.45431 7.19911 2.63612 7.28781 2.72738C7.57651 3.0244 7.56977 3.49923 7.27274 3.78793C6.97572 4.07663 6.50089 4.06989 6.21219 3.77286C6.05513 3.61127 5.8529 3.35416 5.66067 3.10943L5.61595 3.05248C5.42304 2.80675 5.21675 2.54398 5.00606 2.29534L5 2.28819V8.75012C5 9.16434 4.66421 9.50012 4.25 9.50012C3.83579 9.50012 3.5 9.16434 3.5 8.75012V2.28819L3.49394 2.29534C3.28326 2.54397 3.07698 2.80673 2.88408 3.05245L2.83933 3.10943Z" fill="#161616"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                Drag and drop files here to upload
                              </p>
                              <p className="text-xs text-gray-500">
                                Maximum file size allowed is 2MB, supported file formats include .jpg, .png, and .pdf.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => document.getElementById('file-input').click()}
                              className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
                              disabled={(uploadedFiles[activeTab] || []).length >= 5}
                            >
                              {(uploadedFiles[activeTab] || []).length >= 5 ? 'Maximum Files Reached' : 'Browse Files'}
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
                        <div className="flex items-center mt-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.00008 15.3333C12.0502 15.3333 15.3334 12.05 15.3334 7.99996C15.3334 3.94987 12.0502 0.666626 8.00008 0.666626C3.94999 0.666626 0.666748 3.94987 0.666748 7.99996C0.666748 12.05 3.94999 15.3333 8.00008 15.3333Z" fill="white"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.3334 7.99996C15.3334 12.05 12.0502 15.3333 8.00008 15.3333C3.94999 15.3333 0.666748 12.05 0.666748 7.99996C0.666748 3.94987 3.94999 0.666626 8.00008 0.666626C12.0502 0.666626 15.3334 3.94987 15.3334 7.99996ZM7.21135 5.51712C7.48282 5.35758 7.802 5.29926 8.11234 5.35249C8.42269 5.40572 8.70418 5.56707 8.90697 5.80796C9.10975 6.04885 9.22073 6.35374 9.22026 6.66862L9.22026 6.66961C9.22026 6.98237 8.97686 7.30842 8.51713 7.61491C8.30755 7.75463 8.09323 7.86227 7.92867 7.9354C7.84734 7.97155 7.78049 7.99824 7.73554 8.01537C7.71312 8.02391 7.69631 8.03001 7.68605 8.03366L7.67576 8.03727C7.32669 8.15384 7.13808 8.53125 7.25447 8.88043C7.37091 9.22972 7.74845 9.4185 8.09775 9.30207L7.88693 8.66961C8.09775 9.30207 8.09858 9.30179 8.09858 9.30179L8.09961 9.30145L8.1022 9.30057L8.10958 9.29805L8.13273 9.28994C8.15177 9.28317 8.17793 9.27365 8.2102 9.26135C8.27462 9.23681 8.36402 9.201 8.47019 9.15382C8.68063 9.06029 8.96631 8.91793 9.25673 8.72431C9.79689 8.36421 10.5533 7.69046 10.5536 6.67022C10.5544 6.0406 10.3325 5.43098 9.927 4.9493C9.52143 4.46752 8.95845 4.14481 8.33775 4.03835C7.71706 3.93188 7.07871 4.04852 6.53578 4.36761C5.99284 4.6867 5.58036 5.18764 5.37137 5.78172C5.24919 6.12904 5.43171 6.50965 5.77903 6.63183C6.12636 6.75402 6.50697 6.5715 6.62915 6.22417C6.73364 5.92714 6.93989 5.67667 7.21135 5.51712ZM7.94026 10.6696C7.57207 10.6696 7.2736 10.9681 7.2736 11.3363C7.2736 11.7045 7.57207 12.0029 7.94026 12.0029H7.94693C8.31512 12.0029 8.6136 11.7045 8.6136 11.3363C8.6136 10.9681 8.31512 10.6696 7.94693 10.6696H7.94026Z" fill="#384250"/>
                          </svg>
                          <span className="text-sm text-gray-700">Combine all your files in 1 PDF document.</span>
                        </div>
                    </div>
                    {/* Right column intentionally left empty to keep upload on the left */}
                    <div className="hidden md:block md:col-start-2" />
                  </div>
                </div>

                <hr className="border-[#e5e7eb] mt-4 mb-6 -mx-6 md:-mx-8 lg:-mx-12" />

                {/* Declaration Section */}
                <div className="mb-6">
                  <Checkbox
                    name="declaration"
                    checked={formData[activeTab]?.declaration || false}
                    onChange={handleChange}
                    label="I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data"
                    error={errors[activeTab]?.declaration}
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center gap-3 justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md px-6"
                    onClick={handleCancel}
                    style={{
                      width: '132px',
                      height: '40px',
                      minHeight: '40px',
                      maxHeight: '40px',
                      borderRadius: 'var(--Radius-radius-sm, 4px)',
                      border: '1px solid var(--Border-border-neutral-primary, #D2D6DB)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={formData[activeTab]?.declaration ? "primary" : "secondary"}
                    className="rounded-md font-medium hover:bg-darkgreen-300 transition-colors px-8 py-3 text-base"
                    disabled={isSubmitting || !formData[activeTab]?.declaration}
                    style={{
                      width: '132px',
                      height: '40px',
                      minHeight: '40px',
                      maxHeight: '40px',
                      borderRadius: 'var(--Radius-radius-sm, 4px)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>

      {/* Modals */}
      <LoadingModal />
      <ErrorModal />

      {/* Success Modal - Using your ResponseModal component */}
      <ComplaintFeedbackForm
        isVisible={showSuccessModal}
        onClose={handleCloseModal}
        ticketNumber={ticketNumber}
        incidentId={incidentId}           // Add this prop
        contactId={contactId}             //
        onSubmit={handleFeedbackSubmit}
      />

      <ServiceRatingFeedback />

      {/* No Complaints Found Modal */}
      <NoComplaintsModal
        isVisible={noComplaintsModal === 1}
        onClose={() => setNoComplaintsModal(0)}
        onEscalate={() => {
          setNoComplaintsModal(0);
          // Add your escalate logic here
        }}
      />

      {/* Request Limit Reached Modal */}
      <RequestLimitReachedModal
        isVisible={requestLimitReachedModal === 1}
        onClose={() => setRequestLimitReachedModal(0)}
      />

      <Footer />
    </div>
  );
};

export default PresidentStaff;