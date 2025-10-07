import React, { useEffect, useRef } from 'react';

function Drawer({ isOpen, onClose, children, title = "Info", placement = 'left' }) {
  const drawerRef = useRef(null);

  const drawerClasses = `fixed top-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 transform ${placement === 'right' ? 'right-0' : 'left-0'} ${
    isOpen ? (placement === 'right' ? 'translate-x-0' : 'translate-x-0') : (placement === 'right' ? 'translate-x-full' : '-translate-x-full')
  }`;

  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
      document.body.style.overflow = 'hidden'; // Disable body scrolling
    } else {
      document.body.style.overflow = ''; // Enable body scrolling
    }
    return () => {
      document.body.style.overflow = ''; // Clean up on unmount
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        ref={drawerRef}
        id="drawer-js-example"
        className={drawerClasses}
        tabIndex="-1"
        aria-labelledby="drawer-js-label"
        role="dialog"
        aria-modal="true"
      >
        <h5
          id="drawer-js-label"
          className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            class="me-2 h-5 w-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          {title}
        </h5>
        <button
          id="drawer-hide-button"
          type="button"
          onClick={onClose}
          aria-controls="drawer-example"
          className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            class="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
        {children}
      </div>
    </>
  );
}

export default Drawer;
