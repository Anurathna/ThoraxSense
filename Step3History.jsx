import React from 'react';
import { useTranslation } from 'react-i18next';

const Step3History = ({ userData, updateUserData, onPrev, onNext }) => {
  const { t } = useTranslation();
  
  const handleOptionClick = (question, value) => {
    updateUserData(question, value);
  };

  return (
    <section className="step active">
      <div className="card">
        <h2><i className="fas fa-history"></i> {t('step3.title')}</h2>
        <p>{t('step3.description')}</p>
        
        <div className="form-group">
          <label>
            <i className="fas fa-virus"></i> {t('step3.hiv')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.hiv === 'positive' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('hiv', 'positive')}
            >
              {t('step3.hivPositive')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.hiv === 'negative' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('hiv', 'negative')}
            >
              {t('step3.hivNegative')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.hiv === 'unknown' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('hiv', 'unknown')}
            >
              {t('step3.hivUnknown')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-syringe"></i> {t('step3.diabetes')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.diabetes === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('diabetes', 'yes')}
            >
              {t('step3.diabetesYes')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.diabetes === 'no' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('diabetes', 'no')}
            >
              {t('step3.diabetesNo')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.diabetes === 'unknown' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('diabetes', 'unknown')}
            >
              {t('step3.diabetesUnknown')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-users"></i> {t('step3.tbContact')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.tb_contact === 'family' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('tb_contact', 'family')}
            >
              {t('step3.family')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.tb_contact === 'community' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('tb_contact', 'community')}
            >
              {t('step3.community')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.tb_contact === 'close' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('tb_contact', 'close')}
            >
              {t('step3.closeContact')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.tb_contact === 'no' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('tb_contact', 'no')}
            >
              {t('step3.noContact')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-pills"></i> {t('step3.medicines')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.medicines === 'tb' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('medicines', 'tb')}
            >
              {t('step3.tbMeds')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.medicines === 'hiv' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('medicines', 'hiv')}
            >
              {t('step3.hivMeds')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.medicines === 'other' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('medicines', 'other')}
            >
              {t('step3.otherMeds')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.medicines === 'none' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('medicines', 'none')}
            >
              {t('step3.noMeds')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-shield-alt"></i> {t('step3.previousTB')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.previous_tb === 'yes' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('previous_tb', 'yes')}
            >
              {t('step3.hadTB')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.previous_tb === 'no' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('previous_tb', 'no')}
            >
              {t('step3.neverTB')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.previous_tb === 'suspect' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('previous_tb', 'suspect')}
            >
              {t('step3.suspectedTB')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="healthcare">
            <i className="fas fa-hospital"></i> {t('step3.healthcare')}
          </label>
          <select 
            id="healthcare" 
            value={userData.healthcare}
            onChange={(e) => updateUserData('healthcare', e.target.value)}
          >
            <option value="">{t('step3.selectFacility')}</option>
            <option value="none">{t('step3.noFacility')}</option>
            <option value="subcenter">{t('step3.subcenter')}</option>
            <option value="phc">{t('step3.phc')}</option>
            <option value="chc">{t('step3.chc')}</option>
            <option value="hospital">{t('step3.hospital')}</option>
            <option value="tribal">{t('step3.tribalCenter')}</option>
            <option value="mobile">{t('step3.mobile')}</option>
          </select>
        </div>
      </div>
      
      <div className="navigation">
        <button className="btn-prev" onClick={onPrev}>
          <i className="fas fa-arrow-left"></i> {t('button.back')}
        </button>
        <button className="btn-next" onClick={onNext}>
          {t('button.checkResults')} <i className="fas fa-check"></i>
        </button>
      </div>
    </section>
  );
};

export default Step3History;