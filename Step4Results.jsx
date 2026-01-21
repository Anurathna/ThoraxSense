import React from 'react';
import { useTranslation } from 'react-i18next';

const Step4Results = ({ 
  results, 
  userData, 
  onRestart, 
  onFindClinic, 
  onShowTBInfo, 
  onPrintResults,
  foundClinics  // ADD THIS PROP
}) => {
  const { t } = useTranslation();

  const getNearestFacilityName = () => {
    const facilityNames = {
      'none': t('step3.noFacility'),
      'subcenter': t('step3.subcenter'),
      'phc': t('step3.phc'),
      'chc': t('step3.chc'),
      'hospital': t('step3.hospital'),
      'tribal': t('step3.tribalCenter'),
      'mobile': t('step3.mobile')
    };
    return facilityNames[userData.healthcare] || t('step4.goToFacility', { facility: t('step3.selectFacility') });
  };

  // Function to render found clinics preview
  const renderFoundClinics = () => {
    if (!foundClinics || foundClinics.length === 0) return null;
    
    return (
      <div className="found-clinics-section">
        <h3><i className="fas fa-hospital"></i> Nearby Health Centers Found</h3>
        <div className="clinics-preview">
          {foundClinics.slice(0, 3).map(clinic => (
            <div key={clinic.id} className="clinic-preview">
              <strong>{clinic.name}</strong>
              <p>
                <i className="fas fa-map-marker-alt"></i>
                {clinic.distance} km away • {clinic.type}
                {clinic.isGovernment && <span className="gov-badge">Gov</span>}
              </p>
            </div>
          ))}
          <button className="view-more-btn" onClick={onFindClinic}>
            <i className="fas fa-map-marked-alt"></i> View All {foundClinics.length} Centers
          </button>
        </div>
      </div>
    );
  };

  if (results.tb.score >= 70) {
    return (
      <section className="step active">
        <div className="card">
          <h2><i className="fas fa-clipboard-check"></i> {t('step4.title')}</h2>
          
          <div className="result-card">
            <div className="result-header high-risk">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h3>{t('step4.tbHighRisk')}</h3>
                <p>{t('step4.tbUrgent')}</p>
              </div>
            </div>
            
            <div className="result-body">
              <div className="result-reasons">
                <h4><i className="fas fa-info-circle"></i> {t('step4.whyResult')}</h4>
                <ul>
                  {results.tb.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
              
              {/* SHOW FOUND CLINICS IF AVAILABLE */}
              {renderFoundClinics()}
              
              <div className="result-action">
                <h4><i className="fas fa-bell"></i> {t('step4.immediateActions')}</h4>
                <div className="action-steps">
                  <div className="action-step">
                    <span className="step-number">1</span>
                    <div>
                      <h5>{t('step4.visitFacility')}</h5>
                      <p>{t('step4.goToFacility', { facility: getNearestFacilityName() })}</p>
                    </div>
                  </div>
                  <div className="action-step">
                    <span className="step-number">2</span>
                    <div>
                      <h5>{t('step4.getTests')}</h5>
                      <p>{t('step4.sputumTest')}</p>
                    </div>
                  </div>
                  <div className="action-step">
                    <span className="step-number">3</span>
                    <div>
                      <h5>{t('step4.protectOthers')}</h5>
                      <p>{t('step4.coverCough')}</p>
                    </div>
                  </div>
                  <div className="action-step">
                    <span className="step-number">4</span>
                    <div>
                      <h5>{t('step4.informContacts')}</h5>
                      <p>{t('step4.familyCheck')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ALWAYS SHOW CLINIC FINDER - FOR EVERYONE */}
              <div className="result-help">
                <h4><i className="fas fa-hands-helping"></i> {t('step4.availableSupport')}</h4>
                <div className="help-options">
                  <button className="help-btn" onClick={onShowTBInfo}>
                    <i className="fas fa-book"></i> {t('step4.learnTB')}
                  </button>
                  <button className="help-btn" onClick={onFindClinic}>
                    <i className="fas fa-map-marker-alt"></i> {t('step4.findCenter')}
                  </button>
                  <button className="help-btn" onClick={onPrintResults}>
                    <i className="fas fa-print"></i> {t('step4.printResults')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="navigation center">
            <button className="btn-restart" onClick={onRestart}>
              <i className="fas fa-redo"></i> {t('button.restart')}
            </button>
          </div>
        </div>
      </section>
    );
  } else if (results.pneumonia.score >= 60) {
    return (
      <section className="step active">
        <div className="card">
          <h2><i className="fas fa-clipboard-check"></i> {t('step4.title')}</h2>
          
          <div className="result-card">
            <div className="result-header medium-risk">
              <i className="fas fa-exclamation-circle"></i>
              <div>
                <h3>{t('step4.pneumoniaHighRisk')}</h3>
                <p>{t('step4.pneumoniaEval')}</p>
              </div>
            </div>
            
            <div className="result-body">
              <div className="result-reasons">
                <h4><i className="fas fa-info-circle"></i> {t('step4.whyResult')}</h4>
                <ul>
                  {results.pneumonia.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
              
              {/* SHOW FOUND CLINICS IF AVAILABLE */}
              {renderFoundClinics()}
              
              <div className="result-action">
                <h4><i className="fas fa-bell"></i> {t('step4.recommendedActions')}</h4>
                <div className="action-steps">
                  <div className="action-step">
                    <span className="step-number">1</span>
                    <div>
                      <h5>{t('step4.seeDoctor')}</h5>
                      <p>{t('step4.visit48Hours')}</p>
                    </div>
                  </div>
                  <div className="action-step">
                    <span className="step-number">2</span>
                    <div>
                      <h5>{t('step4.chestExam')}</h5>
                      <p>{t('step4.xrayNeeded')}</p>
                    </div>
                  </div>
                  <div className="action-step">
                    <span className="step-number">3</span>
                    <div>
                      <h5>{t('step4.homeCare')}</h5>
                      <p>{t('step4.restFluids')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ALWAYS SHOW CLINIC FINDER - FOR EVERYONE */}
              <div className="result-help">
                <h4><i className="fas fa-hands-helping"></i> {t('step4.availableSupport')}</h4>
                <div className="help-options">
                  <button className="help-btn" onClick={onFindClinic}>
                    <i className="fas fa-map-marker-alt"></i> {t('step4.findCenter')}
                  </button>
                  <button className="help-btn" onClick={onPrintResults}>
                    <i className="fas fa-print"></i> {t('step4.printResults')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="navigation center">
            <button className="btn-restart" onClick={onRestart}>
              <i className="fas fa-redo"></i> {t('button.restart')}
            </button>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="step active">
        <div className="card">
          <h2><i className="fas fa-clipboard-check"></i> {t('step4.title')}</h2>
          
          <div className="result-card">
            <div className="result-header low-risk">
              <i className="fas fa-check-circle"></i>
              <div>
                <h3>{t('step4.lowRisk')}</h3>
                <p>{t('step4.monitorHealth')}</p>
              </div>
            </div>
            
            <div className="result-body">
              <div className="result-reasons">
                <h4><i className="fas fa-info-circle"></i> {t('step4.assessment')}</h4>
                <p>{t('step4.mildInfection')}</p>
              </div>
              
              {/* SHOW FOUND CLINICS IF AVAILABLE */}
              {renderFoundClinics()}
              
              <div className="result-action">
                <h4><i className="fas fa-heart"></i> {t('step4.selfCare')}</h4>
                <div className="advice-list">
                  <div className="advice-item">
                    <i className="fas fa-bed"></i>
                    <p>{t('step4.getRest')}</p>
                  </div>
                  <div className="advice-item">
                    <i className="fas fa-tint"></i>
                    <p>{t('step4.drinkFluids')}</p>
                  </div>
                  <div className="advice-item">
                    <i className="fas fa-thermometer"></i>
                    <p>{t('step4.monitorTemp')}</p>
                  </div>
                  <div className="advice-item">
                    <i className="fas fa-hospital"></i>
                    <p>{t('step4.seekHelp')}</p>
                  </div>
                </div>
              </div>
              
              {/* ALWAYS SHOW CLINIC FINDER - FOR EVERYONE */}
              <div className="result-help">
                <h4><i className="fas fa-hands-helping"></i> {t('step4.availableSupport')}</h4>
                <div className="help-options">
                  <button className="help-btn" onClick={onFindClinic}>
                    <i className="fas fa-map-marker-alt"></i> {t('step4.findCenter')}
                  </button>
                  <button className="help-btn" onClick={onShowTBInfo}>
                    <i className="fas fa-book"></i> {t('step4.learnTB')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="navigation center">
            <button className="btn-restart" onClick={onRestart}>
              <i className="fas fa-redo"></i> {t('button.restart')}
            </button>
          </div>
        </div>
      </section>
    );
  }
};

export default Step4Results;