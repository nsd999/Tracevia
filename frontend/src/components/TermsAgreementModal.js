import React from 'react';
import './TermsAgreementModal.css';

const TermsAgreementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleContinue = () => {
    localStorage.setItem('agreedToTerms', 'true');
    onClose();
  };

  const handleViewTerms = () => {
    window.open('https://tracevia.com/terms-and-conditions', '_blank');
  };

  const handleViewPrivacy = () => {
    window.open('https://tracevia.com/privacy-policy', '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🔒 Agreement Required</h2>
        </div>
        <div className="modal-body">
          <p>
            By clicking Continue, you agree to the{' '}
            <a href="#" onClick={handleViewTerms} className="link">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" onClick={handleViewPrivacy} className="link">
              Privacy Policy
            </a>{' '}
            of Tracevia.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleViewTerms}>
            View Terms
          </button>
          <button className="btn btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAgreementModal;
