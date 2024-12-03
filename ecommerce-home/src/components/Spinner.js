import React from 'react';
import '../styles/Spinner.css'; 

const Spinner = () => {
  return (
    <div className="spinner">
      {/* Можна вставити будь-який контент або анімацію */}
      <div className="loader"></div>
    </div>
  );
};

export default Spinner;
