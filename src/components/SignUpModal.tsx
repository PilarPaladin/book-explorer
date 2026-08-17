import React, { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useScrollLock } from '../hooks/useScrollLock';
import { supabase } from '../services/supabase';

interface SignUpModalProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}



export default function SignUpModal({ onClose, onSwitchToLogin }: SignUpModalProps) {
    useScrollLock();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !username || !password) {
            toast.error('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            toast.error('Password must be at least 8 characters, with an uppercase letter and a number');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Try to create profile
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: data.user.id,
                    username,
                    words_per_minute: 250 // Default
                });
                if (profileError) {
                    console.error('Failed to create profile:', profileError);
                }
            }

            toast.success('Account created successfully! You can now log in.');
            onSwitchToLogin();
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during sign up');
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
                    Join myArkived
                </h2>
                <p className="inter-regular" style={{ fontSize: '15px', margin: '0 0 25px 0', color: 'var(--color-dark)' }}>
                    Already have an account? <span onClick={onSwitchToLogin} style={{ color: 'var(--color-red)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Log in instead!</span>
                </p>

                {/* Form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit} noValidate>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="inter-regular" style={{ fontSize: '15px' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                    <button type="submit" className="auth-btn inter-bold">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}
