import React from 'react';
import { useTranslation } from 'react-i18next';

const ProgressBar = ({ currentStep }) => {
  const { t } = useTranslation();

  return (
    <div className="progress-container">
      <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`}>
        {t('step.1')}
      </div>
      <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`}>
        {t('step.2')}
      </div>
      <div className={`progress-step ${currentStep === 3 ? 'active' : ''}`}>
        {t('step.3')}
      </div>
      <div className={`progress-step ${currentStep === 4 ? 'active' : ''}`}>
        {t('step.4')}
      </div>
    </div>
  );
};

export default ProgressBar;