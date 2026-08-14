import React, { useEffect, useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface LogInModalProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
    onLoginSuccess?: () => void;
}

export default function LogInModal({ onClose, onSwitchToRegister, onLoginSuccess }: LogInModalProps) {
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;

        if (!email && !password) {
            toast.error('All fields are required');
            isValid = false;
        } else if (!email) {
            toast.error('Email or username is required');
            isValid = false;
        } else if (!password) {
            toast.error('Password is required');
            isValid = false;
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Allow login with either email or username
            const user = users.find((u: any) =>
                (u.email === email || u.username === email) && u.password === password
            );

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                toast.success('Logged in successfully!');
                onClose();
                if (onLoginSuccess) onLoginSuccess();
            } else {
                toast.error('Invalid email/username or password');
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }} onClick={onClose}>

            {/* Modal Container */}
            <div style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '6px',
                width: '450px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                padding: '30px',
                color: 'var(--color-red)',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}>
                    <XMarkIcon style={{ width: '32px', color: 'var(--color-red)' }} />
                </button>

                {/* Title */}
                <h2 className="rakkas-regular" style={{
                    fontSize: '36px',
                    margin: '0 0 10px 0',
                    color: 'var(--color-red)'
                }}>
                    Welcome Back !
                </h2>

                <p className="inter-regular" style={{ fontSize: '15px', margin: '0 0 25px 0', color: 'var(--color-dark)' }}>
                    Don't have an account? <span onClick={onSwitchToRegister} style={{ color: 'var(--color-red)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Sign up instead!</span>
                </p>

                {/* Form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Email address or Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                padding: '12px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: 'var(--color-gray)',
                                fontSize: '16px',
                                outline: 'none',
                                color: 'var(--color-dark)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: '12px',
                                paddingRight: '40px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: 'var(--color-gray)',
                                fontSize: '16px',
                                outline: 'none',
                                color: 'var(--color-dark)'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                bottom: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            {showPassword ? (
                                <EyeSlashIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
                            ) : (
                                <EyeIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
                            )}
                        </button>
                    </div>

                    <button type="submit" className="inter-bold" style={{
                        marginTop: '20px',
                        backgroundColor: 'var(--color-red)',
                        color: 'var(--color-white)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '14px',
                        fontSize: '16px',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                    }}>
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
