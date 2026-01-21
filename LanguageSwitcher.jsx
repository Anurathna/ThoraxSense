import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        <span role="img" aria-label="English">🇺🇸</span> English
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'ta' ? 'active' : ''}`}
        onClick={() => changeLanguage('ta')}
      >
        <span role="img" aria-label="Tamil">🇮🇳</span> தமிழ்
      </button>
    </div>
  );
};

export default LanguageSwitcher;