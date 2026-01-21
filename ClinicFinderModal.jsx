import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ClinicFinderModal = ({ onClose, onLiveLocation }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [liveTracking, setLiveTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Extended Tamil Nadu/Tribal Area Default Locations
  const tribalDefaultLocations = {
    // Nilgiris District
    'நீலகிரி': { lat: 11.4067, lon: 76.6932, region: 'Nilgiris' },
    'ஊட்டி': { lat: 11.4067, lon: 76.6932, region: 'Nilgiris' },
    'குன்னூர்': { lat: 11.3200, lon: 76.5100, region: 'Nilgiris' },
    'மேட்டுப்பாளையம்': { lat: 11.3000, lon: 76.9500, region: 'Nilgiris' },
    'கோத்தகிரி': { lat: 11.4500, lon: 76.7500, region: 'Nilgiris' },
    'அவினாசி': { lat: 11.1800, lon: 76.9500, region: 'Nilgiris' },
    
    // Coimbatore District
    'கோயம்புத்தூர்': { lat: 11.0168, lon: 76.9558, region: 'Coimbatore' },
    'பொள்ளாச்சி': { lat: 10.6590, lon: 77.0080, region: 'Coimbatore' },
    'திருப்பூர்': { lat: 11.1085, lon: 77.3411, region: 'Coimbatore' },
    'ஆனைமலை': { lat: 10.5667, lon: 76.9167, region: 'Coimbatore' },
    
    // Wayanad Border Areas
    'வயநாடு': { lat: 11.6000, lon: 76.0800, region: 'Wayanad' },
    'கோழிக்கோடு': { lat: 11.2588, lon: 75.7804, region: 'Wayanad' },
    'சுல்தான் பத்தேரி': { lat: 11.6667, lon: 76.2667, region: 'Wayanad' },
    
    // Theni District
    'தேனி': { lat: 10.0100, lon: 77.4800, region: 'Theni' },
    'பொடிநாயக்கன்பட்டி': { lat: 10.0333, lon: 77.4833, region: 'Theni' },
    'கம்பம்': { lat: 9.7333, lon: 77.2000, region: 'Theni' },
    'பெரியகுளம்': { lat: 10.1833, lon: 77.4833, region: 'Theni' },
    
    // Dindigul District
    'திண்டுக்கல்': { lat: 10.3600, lon: 77.9800, region: 'Dindigul' },
    'பழனி': { lat: 10.4667, lon: 77.5333, region: 'Dindigul' },
    'ஆத்தூர்': { lat: 11.5333, lon: 78.0667, region: 'Dindigul' },
    
    // Erode District
    'ஈரோடு': { lat: 11.3410, lon: 77.7172, region: 'Erode' },
    'சத்தியமங்கலம்': { lat: 11.5167, lon: 78.2333, region: 'Erode' },
    
    // Salem District
    'சேலம்': { lat: 11.6643, lon: 78.1460, region: 'Salem' },
    'ஏற்காடு': { lat: 11.8000, lon: 78.0833, region: 'Salem' },
    
    // Krishnagiri District
    'கிருஷ்ணகிரி': { lat: 12.5196, lon: 78.2137, region: 'Krishnagiri' },
    'ஊசிலம்பட்டி': { lat: 12.2167, lon: 78.1333, region: 'Krishnagiri' },
    
    // Dharmapuri District
    'தர்மபுரி': { lat: 12.1270, lon: 78.1579, region: 'Dharmapuri' },
    'பென்னாகரம்': { lat: 12.2500, lon: 78.0667, region: 'Dharmapuri' },
    
    // Tirunelveli District
    'திருநெல்வேலி': { lat: 8.7139, lon: 77.7567, region: 'Tirunelveli' },
    'காந்தி நகர்': { lat: 8.8000, lon: 77.7667, region: 'Tirunelveli' },
    
    // Kanyakumari District
    'கன்னியாகுமரி': { lat: 8.0883, lon: 77.5385, region: 'Kanyakumari' },
    'மார்த்தாண்டம்': { lat: 8.3167, lon: 77.2167, region: 'Kanyakumari' },
    
    // Other Tribal Areas
    'சிறுமலை': { lat: 10.9667, lon: 76.8833, region: 'Tribal' },
    'ஆலத்தூர்': { lat: 10.6333, lon: 79.3167, region: 'Tribal' },
    'மயிலாடுதுறை': { lat: 11.1031, lon: 79.6550, region: 'Tribal' },
    'வேலூர்': { lat: 12.9202, lon: 79.1333, region: 'Tribal' },
    
    // Major Cities with Medical Facilities
    'சென்னை': { lat: 13.0827, lon: 80.2707, region: 'Chennai' },
    'மதுரை': { lat: 9.9252, lon: 78.1198, region: 'Madurai' },
    'திருச்சிராப்பள்ளி': { lat: 10.7905, lon: 78.7047, region: 'Trichy' },
    'தஞ்சாவூர்': { lat: 10.7870, lon: 79.1378, region: 'Thanjavur' },
    'விழுப்புரம்': { lat: 11.9271, lon: 79.5122, region: 'Villupuram' }
  };

  // Function to start live location tracking
  const startLiveLocation = () => {
    if (onLiveLocation) {
      onLiveLocation(); // Open live location map in parent component
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError(t('clinic.noGeolocation'));
      setIsLoading(false);
      return;
    }
    
    // Start watching position for live updates
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon });
        setLiveTracking(true);
        setIsLoading(false);
        findRealClinics(lat, lon);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = t('clinic.locationError');
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += " " + t('clinic.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += " " + t('clinic.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage += " " + t('clinic.timeout');
            break;
          default:
            errorMessage += " " + t('clinic.unknownError');
        }
        
        setError(errorMessage);
        setLiveTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        distanceFilter: 100 // Update every 100 meters
      }
    );
    
    setWatchId(id);
  };

  // Stop live tracking
  const stopLiveLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setLiveTracking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getUserLocation = () => {
    setIsLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError(t('clinic.noGeolocation'));
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon });
        findRealClinics(lat, lon);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = t('clinic.locationError');
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += " " + t('clinic.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += " " + t('clinic.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage += " " + t('clinic.timeout');
            break;
          default:
            errorMessage += " " + t('clinic.unknownError');
        }
        
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const searchByLocation = () => {
    if (!searchQuery.trim()) {
      alert(t('clinic.enterLocationAlert'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Check if it's a known tribal location
    const queryLower = searchQuery.toLowerCase();
    let foundLocation = null;
    
    Object.entries(tribalDefaultLocations).forEach(([name, coords]) => {
      if (queryLower.includes(name.toLowerCase())) {
        foundLocation = coords;
      }
    });
    
    if (foundLocation) {
      // Use predefined coordinates for tribal areas
      setUserLocation(foundLocation);
      findRealClinics(foundLocation.lat, foundLocation.lon);
    } else {
      // Use OpenStreetMap Nominatim API for other locations
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Tamil Nadu, India')}&limit=1`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setUserLocation({ lat, lon });
            findRealClinics(lat, lon);
          } else {
            setIsLoading(false);
            setError(t('clinic.locationNotFound'));
          }
        })
        .catch(error => {
          setIsLoading(false);
          setError(t('clinic.searchError'));
        });
    }
  };

  // REAL OpenStreetMap API for Health Facilities in Tamil Nadu/Tribal Areas
  const findRealClinics = (lat, lon) => {
    setIsLoading(true);
    
    // OpenStreetMap Overpass API - REAL hospitals, clinics, health centers
    // Searching within 20km radius for Tamil Nadu tribal areas
    const overpassQuery = `
      [out:json][timeout:30];
      (
        node["amenity"="hospital"](around:20000,${lat},${lon})["name"];
        node["amenity"="clinic"](around:20000,${lat},${lon})["name"];
        node["healthcare"="hospital"](around:20000,${lat},${lon})["name"];
        node["healthcare"="clinic"](around:20000,${lat},${lon})["name"];
        node["healthcare"="health_centre"](around:20000,${lat},${lon})["name"];
        node["healthcare"="doctor"](around:20000,${lat},${lon})["name"];
        node["amenity"="doctors"](around:20000,${lat},${lon})["name"];
        node["building"="hospital"](around:20000,${lat},${lon})["name"];
        node["amenity"="pharmacy"](around:20000,${lat},${lon})["name"];
        node["healthcare"="pharmacy"](around:20000,${lat},${lon})["name"];
        way["amenity"="hospital"](around:20000,${lat},${lon})["name"];
        way["amenity"="clinic"](around:20000,${lat},${lon})["name"];
        way["healthcare"="hospital"](around:20000,${lat},${lon})["name"];
        way["healthcare"="clinic"](around:20000,${lat},${lon})["name"];
      );
      out body;
      >;
      out skel qt;
    `;
    
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    fetch(overpassUrl)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        
        if (data.elements && data.elements.length > 0) {
          const realClinics = processOpenStreetMapData(data.elements, lat, lon);
          
          if (realClinics.length > 0) {
            setClinics(realClinics);
          } else {
            // If no OSM data found, show government health centers
            showGovernmentHealthCenters(lat, lon);
          }
        } else {
          // Fallback to government health centers
          showGovernmentHealthCenters(lat, lon);
        }
      })
      .catch(error => {
        setIsLoading(false);
        // Fallback if API fails
        showGovernmentHealthCenters(lat, lon);
      });
  };

  const processOpenStreetMapData = (elements, userLat, userLon) => {
    const clinics = [];
    const uniqueNames = new Set();
    
    elements.forEach(element => {
      if (element.tags && element.tags.name) {
        const name = element.tags.name.trim();
        
        // Skip duplicates
        if (uniqueNames.has(name)) return;
        uniqueNames.add(name);
        
        let elementLat = element.lat;
        let elementLon = element.lon;
        
        // For ways/polygons, use center point if available
        if (element.type === 'way' && element.center) {
          elementLat = element.center.lat;
          elementLon = element.center.lon;
        }
        
        const distance = calculateDistance(userLat, userLon, elementLat, elementLon);
        
        // Filter for Tamil Nadu/Tribal relevant facilities
        const nameLower = name.toLowerCase();
        const isRelevant = nameLower.includes('hospital') || 
                          nameLower.includes('clinic') || 
                          nameLower.includes('health') ||
                          nameLower.includes('medical') ||
                          nameLower.includes('centre') ||
                          nameLower.includes('center') ||
                          nameLower.includes('pharmacy') ||
                          nameLower.includes('dispensary') ||
                          nameLower.includes('doctor');
        
        if (isRelevant && distance < 50) { // Within 50km
          clinics.push({
            id: element.id,
            name: name,
            type: element.tags.amenity || element.tags.healthcare || element.tags.building || 'Health Facility',
            address: element.tags['addr:street'] || element.tags['addr:full'] || element.tags['addr:city'] || t('clinic.addressNotAvailable'),
            phone: element.tags.phone || element.tags['contact:phone'] || element.tags['contact:mobile'] || '104',
            distance: distance.toFixed(1),
            lat: elementLat,
            lon: elementLon,
            fromOSM: true
          });
        }
      }
    });
    
    // Sort by distance
    clinics.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return clinics.slice(0, 20); // Return max 20 clinics
  };

  // Government Health Centers for Tamil Nadu Tribal Areas
  const showGovernmentHealthCenters = (lat, lon) => {
    const tribalHealthCenters = [
      // Nilgiris District
      {
        id: 1,
        name: 'நீலகிரி பழங்குடி சுகாதார மையம்',
        type: 'Tribal Health Center',
        address: 'ஊட்டி மலைப்பகுதி, நீலகிரி',
        phone: '104',
        distance: calculateDistance(lat, lon, 11.4067, 76.6932).toFixed(1),
        isGovernment: true,
        lat: 11.4067,
        lon: 76.6932
      },
      {
        id: 2,
        name: 'முதன்மை சுகாதார மையம் (PHC) - குன்னூர்',
        type: 'Primary Health Center',
        address: 'குன்னூர், நீலகிரி மாவட்டம்',
        phone: '102',
        distance: calculateDistance(lat, lon, 11.3200, 76.5100).toFixed(1),
        isGovernment: true,
        lat: 11.3200,
        lon: 76.5100
      },
      {
        id: 3,
        name: 'சமூக சுகாதார மையம் (CHC) - மேட்டுப்பாளையம்',
        type: 'Community Health Center',
        address: 'மேட்டுப்பாளையம், கோயம்புத்தூர் மாவட்டம்',
        phone: '108',
        distance: calculateDistance(lat, lon, 11.3000, 76.9500).toFixed(1),
        isGovernment: true,
        lat: 11.3000,
        lon: 76.9500
      },
      {
        id: 4,
        name: 'மாவட்ட மருத்துவமனை - கோயம்புத்தூர்',
        type: 'District Hospital',
        address: 'கோயம்புத்தூர், தமிழ்நாடு',
        phone: '0422-2301000',
        distance: calculateDistance(lat, lon, 11.0168, 76.9558).toFixed(1),
        isGovernment: true,
        lat: 11.0168,
        lon: 76.9558
      },
      {
        id: 5,
        name: 'அச்சு மருத்துவமனை - நீலகிரி',
        type: 'Mobile Medical Unit',
        address: 'நீலகிரி மலைப்பகுதி',
        phone: '1800-180-1104',
        distance: calculateDistance(lat, lon, 11.4067, 76.6932).toFixed(1),
        isGovernment: true,
        lat: 11.4067,
        lon: 76.6932
      },
      {
        id: 6,
        name: 'பழங்குடி சுகாதார துணை மையம் - வயநாடு',
        type: 'Tribal Sub-Center',
        address: 'வயநாடு, கேரளா எல்லை',
        phone: '104',
        distance: calculateDistance(lat, lon, 11.6000, 76.0800).toFixed(1),
        isGovernment: true,
        lat: 11.6000,
        lon: 76.0800
      },
      // Theni District
      {
        id: 7,
        name: 'தேனி மாவட்ட மருத்துவமனை',
        type: 'District Hospital',
        address: 'தேனி, தமிழ்நாடு',
        phone: '04546-222222',
        distance: calculateDistance(lat, lon, 10.0100, 77.4800).toFixed(1),
        isGovernment: true,
        lat: 10.0100,
        lon: 77.4800
      },
      {
        id: 8,
        name: 'பழங்குடி சுகாதார மையம் - பொடிநாயக்கன்பட்டி',
        type: 'Tribal Health Center',
        address: 'பொடிநாயக்கன்பட்டி, தேனி மாவட்டம்',
        phone: '104',
        distance: calculateDistance(lat, lon, 10.0333, 77.4833).toFixed(1),
        isGovernment: true,
        lat: 10.0333,
        lon: 77.4833
      },
      // Dindigul District
      {
        id: 9,
        name: 'திண்டுக்கல் மருத்துவமனை',
        type: 'Government Hospital',
        address: 'திண்டுக்கல், தமிழ்நாடு',
        phone: '0451-2433300',
        distance: calculateDistance(lat, lon, 10.3600, 77.9800).toFixed(1),
        isGovernment: true,
        lat: 10.3600,
        lon: 77.9800
      },
      {
        id: 10,
        name: 'பழங்குடி சுகாதார மையம் - பழனி',
        type: 'Tribal Health Center',
        address: 'பழனி, திண்டுக்கல் மாவட்டம்',
        phone: '04542-260300',
        distance: calculateDistance(lat, lon, 10.4667, 77.5333).toFixed(1),
        isGovernment: true,
        lat: 10.4667,
        lon: 77.5333
      },
      // Erode District
      {
        id: 11,
        name: 'சத்தியமங்கலம் பழங்குடி சுகாதார மையம்',
        type: 'Tribal Health Center',
        address: 'சத்தியமங்கலம், ஈரோடு மாவட்டம்',
        phone: '104',
        distance: calculateDistance(lat, lon, 11.5167, 78.2333).toFixed(1),
        isGovernment: true,
        lat: 11.5167,
        lon: 78.2333
      },
      // Salem District
      {
        id: 12,
        name: 'ஏற்காடு பழங்குடி சுகாதார மையம்',
        type: 'Tribal Health Center',
        address: 'ஏற்காடு, சேலம் மாவட்டம்',
        phone: '104',
        distance: calculateDistance(lat, lon, 11.8000, 78.0833).toFixed(1),
        isGovernment: true,
        lat: 11.8000,
        lon: 78.0833
      },
      // Krishnagiri District
      {
        id: 13,
        name: 'ஊசிலம்பட்டி பழங்குடி சுகாதார மையம்',
        type: 'Tribal Health Center',
        address: 'ஊசிலம்பட்டி, கிருஷ்ணகிரி மாவட்டம்',
        phone: '104',
        distance: calculateDistance(lat, lon, 12.2167, 78.1333).toFixed(1),
        isGovernment: true,
        lat: 12.2167,
        lon: 78.1333
      },
      // Mobile Units
      {
        id: 14,
        name: 'அச்சு மருத்துவமனை - தமிழ்நாடு',
        type: 'Mobile Medical Unit',
        address: 'தமிழ்நாடு அரசு',
        phone: '1800-425-2002',
        distance: 'Mobile',
        isGovernment: true,
        isMobile: true,
        lat: lat,
        lon: lon
      }
    ];
    
    // Sort by distance
    tribalHealthCenters.sort((a, b) => {
      if (a.distance === 'Mobile') return 1;
      if (b.distance === 'Mobile') return -1;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
    setClinics(tribalHealthCenters);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (lat, lon) => {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
      window.open(`geo:${lat},${lon}?q=${lat},${lon}`);
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`);
    }
  };

  const callClinic = (phone) => {
    if (phone && phone !== 'Phone not available') {
      window.location.href = `tel:${phone}`;
    } else {
      alert(t('clinic.noPhone'));
    }
  };

  const showEmergencyContacts = () => {
    alert(`🚑 அவசர தொலைபேசி எண்கள் - Emergency Contacts:
    
    🚨 அவசர ஊர்தி (Ambulance): 102
    🏥 சுகாதார உதவி (Health Helpline): 104
    ⚕️ அவசர சேவை (Emergency): 108
    👩 மகளிர் உதவி (Women Helpline): 1091
    👶 குழந்தை உதவி (Child Helpline): 1098
    🎯 பழங்குடி உதவி (Tribal Welfare): 1800-180-1104
    💊 மருந்து உதவி (Drug Helpline): 1800-425-2002
    
    📞 மாவட்ட கட்டுப்பாட்டு அறை (District Control Room):
    நீலகிரி: 0423-2444099
    கோயம்புத்தூர்: 0422-2301000
    தேனி: 04546-222222
    திண்டுக்கல்: 0451-2433300
    சேலம்: 0427-2419000
    மதுரை: 0452-2525000`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === 'clinicModal') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      stopLiveLocation();
    };
  }, [onClose]);

  return (
    <div id="clinicModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-map-marker-alt"></i> {t('clinic.title')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="location-options">
            <button 
              className="location-btn live" 
              onClick={startLiveLocation}
              disabled={liveTracking}
            >
              <i className="fas fa-satellite"></i> 
              {liveTracking ? 'Live Tracking Active' : 'Use Live GPS Location'}
              {liveTracking && <span className="live-pulse"></span>}
            </button>
            
            {liveTracking && (
              <button className="location-btn stop-live" onClick={stopLiveLocation}>
                <i className="fas fa-stop-circle"></i> Stop Live Tracking
              </button>
            )}
            
            <button className="location-btn" onClick={getUserLocation}>
              <i className="fas fa-location-dot"></i> {t('clinic.currentLocation')}
            </button>
            
            <div className="or-divider">{t('clinic.or')}</div>
            
            <div className="manual-location">
              <input 
                type="text" 
                id="locationInput" 
                placeholder={t('clinic.enterLocation') + " (எ.கா: ஊட்டி, நீலகிரி, தேனி, பழனி)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list="tribalLocations"
              />
              <datalist id="tribalLocations">
                {Object.keys(tribalDefaultLocations).map((location, index) => (
                  <option key={index} value={location}>{location} - {tribalDefaultLocations[location].region}</option>
                ))}
              </datalist>
              <button onClick={searchByLocation}>{t('clinic.search')}</button>
            </div>
          </div>
          
          {liveTracking && userLocation && (
            <div className="live-location-info">
              <p><i className="fas fa-satellite fa-spin"></i> 
                <strong> Live Location Active</strong> | 
                Latitude: {userLocation.lat.toFixed(6)}, 
                Longitude: {userLocation.lon.toFixed(6)}
              </p>
            </div>
          )}
          
          <div className="emergency-contacts">
            <button className="emergency-btn" onClick={showEmergencyContacts}>
              <i className="fas fa-phone-alt"></i> அவசர தொலைபேசி எண்கள் / Emergency Contacts
            </button>
          </div>
          
          {userLocation && !liveTracking && (
            <div className="location-info">
              <p><i className="fas fa-info-circle"></i> 
                தேடும் பகுதி: {searchQuery || t('clinic.yourLocation')} 
                (Lat: {userLocation.lat.toFixed(4)}, Lon: {userLocation.lon.toFixed(4)})
              </p>
            </div>
          )}
          
          {clinics.length > 0 && (
            <div className="clinics-list">
              <h4>
                <i className="fas fa-hospital"></i> {t('clinic.nearby')} ({clinics.length})
                {liveTracking && <span className="live-badge">Live</span>}
              </h4>
              <div id="clinicsContainer">
                {clinics.map(clinic => (
                  <div key={clinic.id} className="clinic-item">
                    <div className="clinic-name">
                      <i className="fas fa-hospital"></i>
                      {clinic.name}
                      {clinic.isGovernment && <span className="gov-badge">அரசு</span>}
                      {clinic.isMobile && <span className="mobile-badge">Mobile Unit</span>}
                      {clinic.fromOSM && <span className="osm-badge">OSM</span>}
                    </div>
                    <div className="clinic-details">
                      <p><strong>{t('clinic.type')}:</strong> {clinic.type}</p>
                      <p><strong>{t('clinic.address')}:</strong> {clinic.address}</p>
                      <p><strong>{t('clinic.contact')}:</strong> {clinic.phone}</p>
                    </div>
                    <div className="clinic-distance">
                      <i className="fas fa-location-dot"></i>
                      {clinic.distance === 'Mobile' ? 'Mobile Unit' : `${clinic.distance} ${t('clinic.away')}`}
                    </div>
                    <div className="clinic-actions">
                      <button className="clinic-btn directions" onClick={() => getDirections(clinic.lat, clinic.lon)}>
                        <i className="fas fa-directions"></i> {t('clinic.directions')}
                      </button>
                      <button className="clinic-btn call" onClick={() => callClinic(clinic.phone)}>
                        <i className="fas fa-phone"></i> {t('clinic.call')}
                      </button>
                      {clinic.isMobile && (
                        <button className="clinic-btn mobile" onClick={() => alert('Mobile Medical Unit: Call for current location')}>
                          <i className="fas fa-truck-medical"></i> Track
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>{t('clinic.searching')}</p>
              <p className="loading-sub">
                {liveTracking ? 'Live tracking active...' : 'தமிழ்நாடு சுகாதார வசதிகள் தேடப்படுகிறது...'}
              </p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button className="retry-btn" onClick={getUserLocation}>
                மீண்டும் முயற்சிக்கவும் / Try Again
              </button>
            </div>
          )}
          
          {clinics.length === 0 && !isLoading && !error && (
            <div className="no-results">
              <i className="fas fa-map"></i>
              <p>{t('clinic.mapPlaceholder')}</p>
              <p className="hint">தயவு செய்து உங்கள் கிராமம் அல்லது நகரத்தின் பெயரை உள்ளிடவும்</p>
              <div className="suggested-locations">
                <p><strong>Suggested Tribal Locations:</strong></p>
                <div className="suggested-tags">
                  {['நீலகிரி', 'ஊட்டி', 'தேனி', 'பழனி', 'வயநாடு', 'ஏற்காடு', 'சத்தியமங்கலம்'].map((loc, idx) => (
                    <span key={idx} className="location-tag" onClick={() => {
                      setSearchQuery(loc);
                      setTimeout(() => searchByLocation(), 100);
                    }}>
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicFinderModal;