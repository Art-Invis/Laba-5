import React from 'react';
import '../styles/Button.css';

const Button = ({ onClick, text }) => {
    return (
        <label>
            <button className='main-button' onClick={onClick}>{text}</button>
        </label>
    );
}

export default Button;
