// Create file: src/components/LiveLocationMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

// Fix for default icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to center map on user location
function LocationMarker({ position, clinics, onClinicsFound }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <>
      <Marker position={position}>
        <Popup>
          <strong>Your Current Location</strong><br />
          Latitude: {position[0].toFixed(6)}<br />
          Longitude: {position[1].toFixed(6)}
        </Popup>
      </Marker>
      
      {clinics.map((clinic, index) => (
        <Marker 
          key={index} 
          position={[clinic.lat, clinic.lon]}
          icon={new L.Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          })}
        >
          <Popup>
            <strong>{clinic.name}</strong><br />
            {clinic.type}<br />
            Distance: {clinic.distance} km<br />
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}`, '_blank')}
              style={{ marginTop: '10px', padding: '5px 10px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Get Directions
            </button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

const LiveLocationMap = ({ onClose, onClinicsFound }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clinics, setClinics] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  // Get user's live location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
        setLoading(false);
        setError('');
        
        // Find nearby clinics when location is available
        findNearbyClinics(lat, lon);
      },
      (err) => {
        setLoading(false);
        let errorMsg = t('clinic.error');
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location access denied. Please allow location access in browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable.";
            break;
          case err.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
        }
        
        setError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [t]);

  const findNearbyClinics = (lat, lon) => {
    // Demo clinics - in real app, call API
    const demoClinics = [
      {
        id: 1,
        name: "Tribal Health Center",
        type: "Government Health Center",
        lat: lat + 0.01,
        lon: lon + 0.01,
        distance: "2.5",
        isGovernment: true
      },
      {
        id: 2,
        name: "Primary Health Center (PHC)",
        type: "Primary Health Care",
        lat: lat - 0.01,
        lon: lon + 0.02,
        distance: "3.8",
        isGovernment: true
      },
      {
        id: 3,
        name: "Community Health Center",
        type: "CHC",
        lat: lat + 0.02,
        lon: lon - 0.01,
        distance: "5.2",
        isGovernment: true
      }
    ];

    const clinicsWithDistance = demoClinics.map(clinic => ({
      ...clinic,
      distance: calculateDistance(lat, lon, clinic.lat, clinic.lon).toFixed(1)
    }));

    setClinics(clinicsWithDistance);
    if (onClinicsFound) {
      onClinicsFound(clinicsWithDistance);
    }
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

  return (
    <div className="live-location-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-map-marker-alt"></i> Live GPS Location Tracker</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Getting your live location...</p>
              <p className="small">Please allow location access</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ marginTop: '15px', padding: '10px 20px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Try Again
              </button>
            </div>
          ) : position ? (
            <>
              <div className="location-info">
                <p>
                  <i className="fas fa-location-dot"></i> 
                  <strong> Your Live Location: </strong>
                  Latitude: {position[0].toFixed(6)}, Longitude: {position[1].toFixed(6)}
                </p>
              </div>
              
              <div className="map-container">
                {mapReady || typeof window !== 'undefined' ? (
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '400px', width: '100%', borderRadius: '10px' }}
                    whenCreated={() => setMapReady(true)}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© OpenStreetMap contributors'
                    />
                    <LocationMarker position={position} clinics={clinics} />
                  </MapContainer>
                ) : (
                  <div className="map-placeholder">
                    <i className="fas fa-map"></i>
                    <p>Loading map...</p>
                  </div>
                )}
              </div>
              
              {clinics.length > 0 && (
                <div className="clinics-list">
                  <h4><i className="fas fa-hospital"></i> Nearby Health Centers ({clinics.length})</h4>
                  <div className="clinics-container">
                    {clinics.map(clinic => (
                      <div key={clinic.id} className="clinic-item">
                        <div className="clinic-name">
                          <i className="fas fa-hospital"></i>
                          {clinic.name}
                          {clinic.isGovernment && <span className="gov-badge">Gov</span>}
                        </div>
                        <div className="clinic-details">
                          <p><strong>Type:</strong> {clinic.type}</p>
                          <p><strong>Distance:</strong> {clinic.distance} km</p>
                        </div>
                        <div className="clinic-actions">
                          <button 
                            className="clinic-btn directions"
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}`, '_blank')}
                          >
                            <i className="fas fa-directions"></i> Get Directions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="location-actions">
                <button 
                  className="location-btn"
                  onClick={() => navigator.clipboard.writeText(`${position[0]},${position[1]}`)}
                >
                  <i className="fas fa-copy"></i> Copy Coordinates
                </button>
                <button 
                  className="location-btn"
                  onClick={() => window.open(`https://www.google.com/maps?q=${position[0]},${position[1]}`, '_blank')}
                >
                  <i className="fas fa-external-link-alt"></i> Open in Google Maps
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveLocationMap;