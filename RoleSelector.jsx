import React from 'react';
import './RoleSelector.css';

const RoleSelector = ({ onSelectRole, onLogout }) => {
  return (
    <div className="role-selector-overlay">
      <div className="role-selector">
        <div className="role-header">
          <h2>Welcome to HealthSync Pro</h2>
          <p>Please select your role to continue</p>
        </div>

        <div className="role-options">
          <button 
            className="role-card doctor-role"
            onClick={() => onSelectRole('doctor')}
          >
            <div className="role-icon">🩺</div>
            <h3>Medical Professional</h3>
            <p>Access diagnostic tools, analyze scans, and manage patient records</p>
            <div className="role-features">
              <span>• AI-Powered Disease Detection</span>
              <span>• Medical Scan Analysis</span>
              <span>• Patient Records</span>
            </div>
          </button>

          <button 
            className="role-card patient-role"
            onClick={() => onSelectRole('patient')}
          >
            <div className="role-icon">👤</div>
            <h3>Patient</h3>
            <p>Find healthcare centers, check symptoms, and access health resources</p>
            <div className="role-features">
              <span>• Find Nearby Clinics</span>
              <span>• Live Location Services</span>
              <span>• Health Information</span>
            </div>
          </button>
        </div>

        <div className="role-footer">
          <button 
            className="logout-link" 
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;