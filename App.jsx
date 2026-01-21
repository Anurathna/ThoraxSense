import React, { useState, Suspense, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginModal from './components/LoginModal';
import RoleSelector from './components/RoleSelector';
import DoctorDashboard from './components/DoctorDashboard';

// Import all patient screening components
import LiveLocationMap from './components/LiveLocationMap';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Step1Demographics from './components/Step1Demographics';
import Step2Symptoms from './components/Step2Symptoms';
import Step3History from './components/Step3History';
import Step4Results from './components/Step4Results';
import ClinicFinderModal from './components/ClinicFinderModal';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';

// =============== PATIENT SCREENING APP ===============
const PatientScreeningApp = ({ onLogout, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    age: '',
    gender: '',
    location: '',
    living: '',
    smoking: '',
    occupation: '',
    sick_days: '',
    fever: '',
    cough: '',
    weight_loss: '',
    night_sweats: '',
    chest_pain: '',
    breath: '',
    appetite: '',
    tired: '',
    hiv: '',
    diabetes: '',
    tb_contact: '',
    medicines: '',
    previous_tb: '',
    healthcare: ''
  });

  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [results, setResults] = useState(null);
  const [foundClinics, setFoundClinics] = useState([]);

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    let tbScore = 0;
    let tbReasons = [];
    let pneumoniaScore = 0;
    let pneumoniaReasons = [];
    
    // TB Calculation
    if (userData.sick_days === 'more21') {
      tbScore += 35;
      tbReasons.push('Sick for more than 3 weeks');
    } else if (userData.sick_days === '15-21') {
      tbScore += 20;
      tbReasons.push('Sick for 2-3 weeks');
    }
    
    if (userData.night_sweats === 'yes') {
      tbScore += 25;
      tbReasons.push('Night sweats (wet sheets)');
    }
    
    if (userData.weight_loss === 'yes') {
      tbScore += 20;
      tbReasons.push('Unintentional weight loss');
    }
    
    if (userData.cough === 'blood') {
      tbScore += 30;
      tbReasons.push('Coughing blood');
    } else if (userData.cough === 'wet') {
      tbScore += 15;
    }
    
    if (userData.tb_contact === 'family' || userData.tb_contact === 'close') {
      tbScore += 30;
      tbReasons.push('Close contact with TB patient');
    } else if (userData.tb_contact === 'community') {
      tbScore += 15;
    }
    
    if (userData.hiv === 'positive') {
      tbScore += 40;
      tbReasons.push('HIV positive');
    }
    
    if (userData.previous_tb === 'yes') {
      tbScore += 25;
      tbReasons.push('Previous TB infection');
    }
    
    if (userData.diabetes === 'yes') {
      tbScore += 15;
    }
    
    if (userData.living === 'crowded') {
      tbScore += 20;
      tbReasons.push('Living in crowded conditions');
    }
    
    // Pneumonia Calculation
    if (userData.sick_days === 'less7') {
      pneumoniaScore += 30;
      pneumoniaReasons.push('Recently sick (less than 1 week)');
    } else if (userData.sick_days === '7-14') {
      pneumoniaScore += 25;
      pneumoniaReasons.push('Sick for 1-2 weeks');
    }
    
    if (userData.fever === 'high') {
      pneumoniaScore += 25;
      pneumoniaReasons.push('High fever');
    } else if (userData.fever === 'low') {
      pneumoniaScore += 15;
    }
    
    if (userData.cough === 'dry') {
      pneumoniaScore += 20;
      pneumoniaReasons.push('Dry cough');
    } else if (userData.cough === 'wet') {
      pneumoniaScore += 15;
    }
    
    if (userData.chest_pain === 'yes') {
      pneumoniaScore += 15;
      pneumoniaReasons.push('Chest pain');
    }
    
    if (userData.breath === 'yes') {
      pneumoniaScore += 15;
      pneumoniaReasons.push('Shortness of breath');
    }
    
    if (userData.smoking === 'current' || userData.smoking === 'traditional') {
      pneumoniaScore += 20;
      pneumoniaReasons.push('Tobacco use');
    }
    
    const calculatedResults = {
      tb: { score: tbScore, reasons: tbReasons },
      pneumonia: { score: pneumoniaScore, reasons: pneumoniaReasons }
    };
    
    setResults(calculatedResults);
    setCurrentStep(4);
  };

  const restartScreening = () => {
    setCurrentStep(1);
    setUserData({
      age: '',
      gender: '',
      location: '',
      living: '',
      smoking: '',
      occupation: '',
      sick_days: '',
      fever: '',
      cough: '',
      weight_loss: '',
      night_sweats: '',
      chest_pain: '',
      breath: '',
      appetite: '',
      tired: '',
      hiv: '',
      diabetes: '',
      tb_contact: '',
      medicines: '',
      previous_tb: '',
      healthcare: ''
    });
    setResults(null);
  };

  const validateStep1 = () => {
    if (!userData.age || userData.age < 1 || userData.age > 120) {
      alert('Please enter a valid age (1-120)');
      return false;
    }
    if (!userData.gender) {
      alert('Please select your gender');
      return false;
    }
    if (!userData.location) {
      alert('Please select your area');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const required = ['sick_days', 'fever', 'cough', 'weight_loss', 'night_sweats'];
    for (const field of required) {
      if (!userData[field]) {
        alert('Please answer all symptom questions before continuing.');
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    const required = ['hiv', 'diabetes', 'tb_contact', 'medicines', 'previous_tb'];
    for (const field of required) {
      if (!userData[field]) {
        alert('Please answer all health history questions before checking results.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      nextStep();
    } else if (currentStep === 2 && validateStep2()) {
      nextStep();
    } else if (currentStep === 3 && validateStep3()) {
      calculateResults();
    }
  };

  const showTBInfo = () => {
    alert('Tuberculosis (TB) is a bacterial infection that mainly affects the lungs. It spreads through the air when infected people cough, sneeze or spit. TB is curable with proper treatment.');
  };

  const printResults = () => {
    window.print();
  };

  const handleClinicsFound = (clinics) => {
    setFoundClinics(clinics);
  };

  const openLiveLocationFinder = () => {
    setShowClinicModal(false);
    setShowLiveLocation(true);
  };

  const openClinicFinder = () => {
    setShowLiveLocation(false);
    setShowClinicModal(true);
  };

  const handleFindClinic = () => {
    if (navigator.geolocation && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      if (window.confirm('Use live GPS location for more accurate results?')) {
        openLiveLocationFinder();
      } else {
        openClinicFinder();
      }
    } else {
      openClinicFinder();
    }
  };

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <div className="app-container">
        {/* PATIENT APP TOP BAR */}
        <div className="top-bar">
          <h1>🩺 HealthSync Pro - Patient Portal</h1>
          <div className="user-info">
            <span className="user-name">
              👤 {user.name || user.email}
            </span>
            <button 
              className="logout-btn-small" 
              onClick={onLogout}
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
        
        {/* ORIGINAL HEADER */}
        <Header />
        
        {/* LANGUAGE SWITCHER */}
        <div className="language-container">
          <LanguageSwitcher />
        </div>
        
        <ProgressBar currentStep={currentStep} />
        
        <main className="main-content">
          {currentStep === 1 && (
            <Step1Demographics 
              userData={userData} 
              updateUserData={updateUserData} 
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <Step2Symptoms 
              userData={userData} 
              updateUserData={updateUserData} 
              onPrev={prevStep}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 3 && (
            <Step3History 
              userData={userData} 
              updateUserData={updateUserData} 
              onPrev={prevStep}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 4 && results && (
            <Step4Results 
              results={results}
              userData={userData}
              onRestart={restartScreening}
              onFindClinic={handleFindClinic}
              onShowTBInfo={showTBInfo}
              onPrintResults={printResults}
              foundClinics={foundClinics}
            />
          )}
        </main>
        
        <Footer 
          onFindClinic={handleFindClinic}
          onLiveLocation={openLiveLocationFinder}
        />
    
        {/* Clinic Finder Modal */}
        {showClinicModal && (
          <ClinicFinderModal 
            onClose={() => setShowClinicModal(false)} 
            onLiveLocation={openLiveLocationFinder}
          />
        )}
        
        {/* Live Location Map Modal */}
        {showLiveLocation && (
          <LiveLocationMap 
            onClose={() => setShowLiveLocation(false)} 
            onClinicsFound={handleClinicsFound}
          />
        )}
      </div>
    </Suspense>
  );
};

// =============== LOGIN PAGE ===============
const LoginPage = ({ onLoginClick }) => {
  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-header">
          <h1><i className="fas fa-shield-alt"></i> HealthSync Pro</h1>
          <p className="login-subtitle">AI-Powered Health Screening & Diagnosis Platform</p>
        </div>
        
        <div className="login-page-body">
          <div className="login-page-card">
            <div className="login-page-icon">
              <i className="fas fa-user-md"></i>
            </div>
            
            <h2>Welcome to HealthSync Pro</h2>
            <p className="login-description">
              A comprehensive health platform for medical professionals and patients.
              Get AI-powered disease detection, find nearby clinics, and access health resources.
            </p>
            
            <button 
              className="login-page-btn"
              onClick={onLoginClick}
            >
              <i className="fas fa-sign-in-alt"></i> Sign In / Login
            </button>
            
            <div className="login-page-features">
              <div className="feature">
                <i className="fas fa-stethoscope"></i>
                <span>AI Disease Detection</span>
              </div>
              <div className="feature">
                <i className="fas fa-map-marker-alt"></i>
                <span>Live Clinic Finder</span>
              </div>
              <div className="feature">
                <i className="fas fa-language"></i>
                <span>Multi-Language Support</span>
              </div>
              <div className="feature">
                <i className="fas fa-mobile-alt"></i>
                <span>Mobile Friendly</span>
              </div>
            </div>
            
            <div className="login-page-footer">
              <p><i className="fas fa-info-circle"></i> For demo: Use doctor@health.com / 123 or patient@health.com / 123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== MAIN APP CONTENT ===============
const AppContent = () => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Load selected role from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedRole = localStorage.getItem('selectedRole');
      if (savedRole) {
        setSelectedRole(savedRole);
      }
    }
  }, [user]);

  // =============== USER FLOW LOGIC ===============
  
  // 1. If NOT LOGGED IN → Show Login Page
  if (!user) {
    return (
      <>
        <LoginPage onLoginClick={() => setShowLoginModal(true)} />
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setShowLoginModal(false);
            }}
          />
        )}
      </>
    );
  }

  // 2. If LOGGED IN but NO ROLE SELECTED → Show Role Selector
  if (user && !selectedRole) {
    return (
      <RoleSelector 
        onSelectRole={(role) => {
          setSelectedRole(role);
          localStorage.setItem('selectedRole', role);
        }}
        onLogout={() => {
          logout();
          setSelectedRole(null);
          localStorage.removeItem('selectedRole');
        }}
      />
    );
  }

  // 3. If DOCTOR → Show Doctor Dashboard
  if (user && selectedRole === 'doctor') {
    return (
      <DoctorDashboard 
        onLogout={() => {
          logout();
          setSelectedRole(null);
          localStorage.removeItem('selectedRole');
        }}
      />
    );
  }

  // 4. If PATIENT → Show Patient Screening App
  if (user && selectedRole === 'patient') {
    return (
      <PatientScreeningApp 
        user={user}
        onLogout={() => {
          logout();
          setSelectedRole(null);
          localStorage.removeItem('selectedRole');
        }}
      />
    );
  }

  // Fallback (should never reach here)
  return (
    <div className="loading">
      <i className="fas fa-spinner fa-spin"></i>
      <p>Loading...</p>
    </div>
  );
};

// =============== MAIN APP WRAPPER ===============
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;