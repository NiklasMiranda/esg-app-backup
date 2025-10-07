import React from 'react';

function InfoIcon({ onClick }) {
  return (
    <span 
      onClick={onClick} 
      style={{
        cursor: 'pointer', 
        marginLeft: '8px', 
        fontWeight: 'bold', 
        color: '#0b3954',
        border: '2px solid #0b3954',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      i
    </span>
  );
}

export default InfoIcon;
