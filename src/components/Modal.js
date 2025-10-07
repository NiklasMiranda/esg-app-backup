import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, position = 'center', children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'modal-open' : ''}`} onClick={onClose}>
      <div className={`modal-content modal-${position}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
