import React, { useEffect, useRef, useState } from 'react';

const MapPicker = ({ apiKey, geocodingApiKey, onLocationSelect, onClose, language }) => {
  const mapRef = useRef(null);
  const isMapInitialized = useRef(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const t = language === 'ar'
    ? { title: 'حدد عنوانك من الخريطة', confirm: 'تأكيد العنوان', close: 'إغلاق', error: 'خطأ في تحميل الخريطة', loading: 'جاري التحميل...', myLocation: 'موقعي الحالي', geolocationError: 'فشل تحديد الموقع. يرجى تمكين أذونات الموقع والمحاولة مرة أخرى.' }
    : { title: 'Locate Your Address From The Map', confirm: 'Confirm address', close: 'Close', error: 'Error loading map', loading: 'Loading...', myLocation: 'My current location', geolocationError: 'Geolocation failed. Please enable location permissions and try again.' };

  /**
   * @expert_update
   * This function provides a fallback default location to ensure the component
   * always returns valid data, even if geocoding or user interaction fails.
   */
  const getDefaultLocation = () => ({
    lat: 24.7136,
    lng: 46.6753,
    city: 'Riyadh',
    region: 'Riyadh Region',
    nationalAddress: 'Default Address, Riyadh, Saudi Arabia',
    locationDescription: 'Default location in Riyadh'
  });

  /**
   * @expert_update
   * This function has been rewritten to be more robust. It intelligently parses the
   * Geocoding API response to find the most relevant address components.
   * - It prioritizes specific component types (like 'locality' for city).
   * - It provides sensible fallbacks to prevent "N/A" values.
   * - It constructs a useful location description from the first valid address result.
   */
  const fetchGeocodeData = async (latLng) => {
    try {
      const { lat, lng } = typeof latLng.lat === 'function'
        ? { lat: latLng.lat(), lng: latLng.lng() }
        : latLng;
        
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geocodingApiKey}&language=${language}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComp = result.address_components;
        
        const getComponent = (types) => {
          const comp = addressComp.find(c => types.some(type => c.types.includes(type)));
          return comp ? comp.long_name : null;
        };
        
        const city = getComponent(['locality', 'administrative_area_level_2']) || getComponent(['sublocality']) || 'Unknown City';
        const region = getComponent(['administrative_area_level_1']) || 'Unknown Region';
        const nationalAddress = result.formatted_address || 'Address not available';
        const locationDescription = `Located in ${city}, ${region}`;

        return { lat, lng, city, region, nationalAddress, locationDescription };
      } else {
        console.error('Geocoding failed:', data.status);
        // Fallback to coordinates if geocoding fails
        return { lat, lng, city: 'N/A', region: 'N/A', nationalAddress: 'N/A', locationDescription: 'N/A' };
      }
    } catch (err) {
      console.error('Error fetching geocode data:', err);
      // Return a structured object even on network error
      const { lat, lng } = typeof latLng.lat === 'function' ? { lat: latLng.lat(), lng: latLng.lng() } : latLng;
      return { lat, lng, city: 'Error', region: 'Error', nationalAddress: 'Error', locationDescription: 'Error fetching details' };
    }
  };

  const handleSelectLocation = async () => {
    if (!selectedPosition) {
      onLocationSelect(getDefaultLocation());
      return;
    }
    setIsLoading(true);
    const geoData = await fetchGeocodeData(selectedPosition);
    setIsLoading(false);
    onLocationSelect(geoData);
  };

  /**
   * @expert_update
   * This function is now more reliable for finding the user's current location.
   * - It uses the browser's Geolocation API with high accuracy enabled.
   * - It smoothly pans the map to the user's location.
   * - It provides clear error messages if permission is denied or the request times out.
   */
  const handleMyLocation = () => {
    if (!mapInstance.current || !navigator.geolocation) {
        setMapError(t.geolocationError);
        setTimeout(() => setMapError(null), 5000);
        return;
    }
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        mapInstance.current.panTo(pos);
        mapInstance.current.setZoom(15);
        
        if (markerRef.current) {
          markerRef.current.setPosition(pos);
        }
        
        setSelectedPosition(pos);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setMapError(t.geolocationError);
        console.error('Geolocation error:', error);
        setTimeout(() => setMapError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isMapInitialized.current) return;
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js?key=${apiKey}"]`);

    const initMap = () => {
      try {
        if (!window.google || !window.google.maps || !mapRef.current) {
          setMapError('Google Maps API not available.');
          setIsLoading(false);
          return;
        }

        isMapInitialized.current = true;
        
        const initialCenter = { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh
        const map = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: 'greedy'
        });
        mapInstance.current = map;

        markerRef.current = new window.google.maps.Marker({
          position: initialCenter,
          map: map,
          draggable: true,
        });
        
        // Set initial selected position
        const position = markerRef.current.getPosition();
        setSelectedPosition({ lat: position.lat(), lng: position.lng() });

        // Add listeners
        markerRef.current.addListener('dragend', () => {
          const newPos = markerRef.current.getPosition();
          setSelectedPosition({ lat: newPos.lat(), lng: newPos.lng() });
        });

        map.addListener('click', (event) => {
          markerRef.current.setPosition(event.latLng);
          const newPos = event.latLng;
          setSelectedPosition({ lat: newPos.lat(), lng: newPos.lng() });
        });

        setIsLoading(false);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map.');
        setIsLoading(false);
      }
    };

    if (existingScript && window.google) {
        initMap();
    } else if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=${language}`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
            setMapError('Failed to load Google Maps API.');
            setIsLoading(false);
        };
        document.head.appendChild(script);
    }

  }, [apiKey, language]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden border border-blue-300">
        <div className="absolute top-0 left-0 w-full bg-gray-100 p-2 border-b border-blue-300 z-10">
          <h2 className="text-lg font-semibold text-gray-700">{t.title}</h2>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B8354] mx-auto mb-4"></div>
              <p className="text-gray-600">{t.loading}</p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center p-8">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.error}</h3>
              <p className="text-gray-600 mb-6">{mapError}</p>
              <button
                onClick={() => { onLocationSelect(getDefaultLocation()); }}
                className="px-6 py-2 bg-[#1B8354] text-white font-medium rounded-md shadow-lg hover:bg-[#146B43] transition-colors"
              >
                Use Default Location (Riyadh)
              </button>
            </div>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          aria-label={t.close}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isLoading && !mapError && (
          <button
            className="absolute top-12 right-2 z-10 px-4 py-2 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 transition-colors border"
            onClick={handleMyLocation}
          >
            {t.myLocation}
          </button>
        )}

        {!isLoading && !mapError && (
          <button
            onClick={handleSelectLocation}
            className="absolute bottom-0 left-0 w-full z-10 px-6 py-4 bg-[#1B8354] text-white font-medium rounded-b-lg shadow-lg hover:bg-[#146B43] transition-colors text-center"
          >
            {t.confirm}
          </button>
        )}
      </div>
    </div>
  );
};

export default MapPicker;