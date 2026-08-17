import React, { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useScrollLock } from '../hooks/useScrollLock';
import { supabase } from '../services/supabase';

interface LogInModalProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
    onLoginSuccess?: () => void;
}

export default function LogInModal({ onClose, onSwitchToRegister, onLoginSuccess }: LogInModalProps) {
    useScrollLock();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;

        if (!email && !password) {
            toast.error('All fields are required');
            isValid = false;
        } else if (!email) {
            toast.error('Email is required');
            isValid = false;
        } else if (!password) {
            toast.error('Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                if (!keepSignedIn) {
                    sessionStorage.setItem('tempSession', 'true');
                } else {
                    sessionStorage.removeItem('tempSession');
                }

                toast.success('Logged in successfully!');
                onClose();
                if (onLoginSuccess) onLoginSuccess();
            } catch (error: any) {
                toast.error(error.message || 'Invalid email or password');
            }
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>

            {/* Modal Container */}
            <div className="auth-modal" onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}>
                    <XMarkIcon style={{ width: '32px', color: 'var(--color-red)' }} />
                </button>

                {/* Title */}
                <h2 className="rakkas-regular">
                    Welcome Back !
                </h2>

                <p className="inter-regular" style={{ fontSize: '15px', margin: '0 0 25px 0', color: 'var(--color-dark)' }}>
                    Don't have an account? <span onClick={onSwitchToRegister} style={{ color: 'var(--color-red)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Sign up instead!</span>
                </p>

                {/* Form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Email address</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
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
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                        <input
                            type="checkbox"
                            id="keepSignedIn"
                            checked={keepSignedIn}
                            onChange={(e) => setKeepSignedIn(e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-red)' }}
                        />
                        <label htmlFor="keepSignedIn" className="inter-regular" style={{ fontSize: '14px', cursor: 'pointer', color: 'var(--color-dark)' }}>
                            Keep me signed in
                        </label>
                    </div>

                    <button type="submit" className="auth-btn inter-bold">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
