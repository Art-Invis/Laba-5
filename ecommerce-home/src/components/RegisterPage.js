
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Паролі не співпадають');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert('Реєстрація успішна! Виконайте вхід.');
                navigate('/login'); // Перенаправлення на сторінку входу
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Помилка реєстрації', error);
        }
    };

    return (
        <div>
            <h2>Реєстрація</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Підтвердьте пароль"
            />
            <button onClick={handleRegister}>Зареєструватися</button>
        </div>
    );
};

export default RegisterPage;
