import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = ({ onFindClinic, onLiveLocation }) => {  // Add onLiveLocation prop
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <i className="fas fa-shield-alt"></i>
          <h4>{t('footer.title')}</h4>
        </div>
        <div className="footer-info">
          <p><i className="fas fa-info-circle"></i> {t('footer.disclaimer')}</p>
          <p className="footer-note">{t('footer.note')}</p>
          
          {/* FOOTER ACTIONS WITH LIVE LOCATION */}
          <div className="footer-actions">
            <button 
              className="footer-btn" 
              onClick={onLiveLocation}
            >
              <i className="fas fa-satellite"></i> Live GPS Location
            </button>
            <button 
              className="footer-btn" 
              onClick={onFindClinic}
            >
              <i className="fas fa-map-marker-alt"></i> {t('step4.findCenter')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;