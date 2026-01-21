import React from 'react';
import { useTranslation } from 'react-i18next';

const Step2Symptoms = ({ userData, updateUserData, onPrev, onNext }) => {
  const { t } = useTranslation();
  
  const handleOptionClick = (question, value) => {
    updateUserData(question, value);
  };

  return (
    <section className="step active">
      <div className="card">
        <h2><i className="fas fa-stethoscope"></i> {t('step2.title')}</h2>
        <p>{t('step2.description')}</p>
        
        <div className="form-group">
          <label>
            <i className="fas fa-calendar-alt"></i> {t('step2.sickDays')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.sick_days === 'less7' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('sick_days', 'less7')}
            >
              {t('step2.lessWeek')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.sick_days === '7-14' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('sick_days', '7-14')}
            >
              {t('step2.oneTwoWeeks')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.sick_days === '15-21' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('sick_days', '15-21')}
            >
              {t('step2.twoThreeWeeks')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.sick_days === 'more21' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('sick_days', 'more21')}
            >
              {t('step2.moreThreeWeeks')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-temperature-high"></i> {t('step2.fever')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.fever === 'high' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('fever', 'high')}
            >
              {t('step2.highFever')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.fever === 'low' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('fever', 'low')}
            >
              {t('step2.mildFever')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.fever === 'none' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('fever', 'none')}
            >
              {t('step2.noFever')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-wind"></i> {t('step2.cough')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.cough === 'dry' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('cough', 'dry')}
            >
              {t('step2.dryCough')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.cough === 'wet' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('cough', 'wet')}
            >
              {t('step2.wetCough')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.cough === 'blood' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('cough', 'blood')}
            >
              {t('step2.bloodCough')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.cough === 'none' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('cough', 'none')}
            >
              {t('step2.noCough')}
            </button>
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label>
              <i className="fas fa-weight"></i> {t('step2.weightLoss')}
            </label>
            <div className="button-group">
              <button 
                type="button" 
                className={`btn-option ${userData.weight_loss === 'yes' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('weight_loss', 'yes')}
              >
                {t('step2.yes')}
              </button>
              <button 
                type="button" 
                className={`btn-option ${userData.weight_loss === 'no' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('weight_loss', 'no')}
              >
                {t('step2.no')}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>
              <i className="fas fa-bed"></i> {t('step2.nightSweats')}
            </label>
            <div className="button-group">
              <button 
                type="button" 
                className={`btn-option ${userData.night_sweats === 'yes' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('night_sweats', 'yes')}
              >
                {t('step2.yes')}
              </button>
              <button 
                type="button" 
                className={`btn-option ${userData.night_sweats === 'no' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('night_sweats', 'no')}
              >
                {t('step2.no')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-heartbeat"></i> {t('step2.otherSymptoms')}
          </label>
          <div className="button-grid">
            <button 
              type="button" 
              className={`btn-option ${userData.chest_pain === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('chest_pain', 'yes')}
            >
              {t('step2.chestPain')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.breath === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('breath', 'yes')}
            >
              {t('step2.shortBreath')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.appetite === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('appetite', 'yes')}
            >
              {t('step2.lossAppetite')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.tired === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('tired', 'yes')}
            >
              {t('step2.extremeTired')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="navigation">
        <button className="btn-prev" onClick={onPrev}>
          <i className="fas fa-arrow-left"></i> {t('button.back')}
        </button>
        <button className="btn-next" onClick={onNext}>
          {t('button.next')}: {t('step.3')} <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default Step2Symptoms;