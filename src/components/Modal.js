import React, { useState, useEffect } from 'react';


function Modal({ isOpen, onClose, position = 'center', children }) {
  const [status, setStatus] = useState(isOpen ? 'entered' : 'left'); // 'entering', 'entered', 'leaving', 'left'
  const enterDuration = 300; // Match CSS data-enter duration
  const leaveDuration = 200; // Match CSS data-leave duration

  useEffect(() => {
    if (isOpen) {
      if (status === 'left' || status === 'leaving') {
        setStatus('entering');
        const timer = setTimeout(() => {
          setStatus('entered');
        }, enterDuration);
        return () => clearTimeout(timer);
      }
    } else {
      if (status === 'entered' || status === 'entering') {
        setStatus('leaving');
        const timer = setTimeout(() => {
          setStatus('left');
        }, leaveDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, status]);

  if (status === 'left') {
    return null;
  }

  const isModalClosed = status === 'left';
  const isEntering = status === 'entering';
  const isLeaving = status === 'leaving';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex" onClick={onClose}>
        <div className={`bg-white p-6 rounded-lg shadow-lg z-50 max-w-md w-full mx-4 relative ${position === 'right' ? 'ml-auto' : 'mx-auto'} ${position === 'question-center' ? 'self-center' : 'self-center'}`} onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
