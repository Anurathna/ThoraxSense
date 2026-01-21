import React from 'react';
import { useTranslation } from 'react-i18next';

const Step1Demographics = ({ userData, updateUserData, onNext }) => {
  const { t } = useTranslation();
  
  const handleOptionClick = (question, value) => {
    updateUserData(question, value);
  };

  return (
    <section className="step active">
      <div className="card">
        <h2><i className="fas fa-users"></i> {t('step1.title')}</h2>
        <p>{t('step1.description')}</p>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="age">
              <i className="fas fa-user"></i> {t('step1.age')}
            </label>
            <input 
              type="number" 
              id="age" 
              min="1" 
              max="120" 
              placeholder={t('step1.agePlaceholder')}
              value={userData.age}
              onChange={(e) => updateUserData('age', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>
              <i className="fas fa-venus-mars"></i> {t('step1.gender')}
            </label>
            <div className="button-group">
              <button 
                type="button" 
                className={`btn-option ${userData.gender === 'male' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('gender', 'male')}
              >
                {t('step1.genderMale')}
              </button>
              <button 
                type="button" 
                className={`btn-option ${userData.gender === 'female' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('gender', 'female')}
              >
                {t('step1.genderFemale')}
              </button>
              <button 
                type="button" 
                className={`btn-option ${userData.gender === 'other' ? 'selected' : ''}`}
                onClick={() => handleOptionClick('gender', 'other')}
              >
                {t('step1.genderOther')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">
            <i className="fas fa-map-marker-alt"></i> {t('step1.location')}
          </label>
          <select 
            id="location" 
            value={userData.location}
            onChange={(e) => updateUserData('location', e.target.value)}
          >
            <option value="">{t('step1.selectArea')}</option>
            <option value="forest">{t('step1.forest')}</option>
            <option value="hill">{t('step1.hill')}</option>
            <option value="rural">{t('step1.rural')}</option>
            <option value="remote">{t('step1.remote')}</option>
            <option value="other">{t('step1.otherArea')}</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-home"></i> {t('step1.living')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.living === 'crowded' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('living', 'crowded')}
            >
              {t('step1.crowded')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.living === 'shared' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('living', 'shared')}
            >
              {t('step1.shared')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.living === 'separate' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('living', 'separate')}
            >
              {t('step1.separate')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-smoking"></i> {t('step1.tobacco')}
          </label>
          <div className="button-group">
            <button 
              type="button" 
              className={`btn-option ${userData.smoking === 'current' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('smoking', 'current')}
            >
              {t('step1.currentSmoke')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.smoking === 'traditional' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('smoking', 'traditional')}
            >
              {t('step1.traditional')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.smoking === 'former' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('smoking', 'former')}
            >
              {t('step1.former')}
            </button>
            <button 
              type="button" 
              className={`btn-option ${userData.smoking === 'never' ? 'selected' : ''}`}
              onClick={() => handleOptionClick('smoking', 'never')}
            >
              {t('step1.never')}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="occupation">
            <i className="fas fa-briefcase"></i> {t('step1.occupation')}
          </label>
          <select 
            id="occupation" 
            value={userData.occupation}
            onChange={(e) => updateUserData('occupation', e.target.value)}
          >
            <option value="">{t('step1.selectWork')}</option>
            <option value="farming">{t('step1.farming')}</option>
            <option value="forest_work">{t('step1.forestWork')}</option>
            <option value="livestock">{t('step1.livestock')}</option>
            <option value="handicraft">{t('step1.handicraft')}</option>
            <option value="labor">{t('step1.labor')}</option>
            <option value="home">{t('step1.home')}</option>
            <option value="student">{t('step1.student')}</option>
            <option value="other">{t('step1.otherWork')}</option>
          </select>
        </div>
      </div>
      
      <div className="navigation">
        <div></div>
        <button className="btn-next" onClick={onNext}>
          {t('button.next')}: {t('step.2')} <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default Step1Demographics;