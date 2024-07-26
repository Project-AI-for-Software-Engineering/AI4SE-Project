// ConfirmationDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import '../css/ConfirmationDialogue.css'; // Optional: For custom styles

function ConfirmationDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog">
      <div className="confirmation-dialog-overlay" onClick={onCancel}></div>
      <div className="confirmation-dialog-content">
        <p>{message}</p>
        <div className="confirmation-dialog-buttons">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
