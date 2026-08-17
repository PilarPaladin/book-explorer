import React from 'react';
import { XMarkIcon, MagnifyingGlassIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import { useScrollLock } from '../hooks/useScrollLock';

interface LogActionModalProps {
    onClose: () => void;
    onSelectSearch: () => void;
    onSelectAddFic: () => void;
}

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

export default function LogActionModal({ onClose, onSelectSearch, onSelectAddFic }: LogActionModalProps) {
    useScrollLock();

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '90%', padding: '30px' }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}>
                    <XMarkIcon style={{ width: '24px', color: 'var(--color-dark)' }} />
                </button>

                <h3 className="rakkas-regular" style={{ fontSize: '24px', color: 'var(--color-red)', margin: '0 0 20px 0', textAlign: 'center' }}>
                    How would you like to log?
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        onClick={onSelectSearch}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '15px',
                            backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px',
                            cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    >
                        <MagnifyingGlassIcon style={{ width: '24px', color: 'var(--color-red)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="inter-bold" style={{ fontSize: '16px', color: 'var(--color-dark)' }}>Search</span>
                            <span className="inter-regular" style={{ fontSize: '14px', color: 'var(--color-gray)' }}>Find a fanfic already in myArkived</span>
                        </div>
                    </button>

                    <button
                        onClick={onSelectAddFic}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '15px',
                            backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px',
                            cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    >
                        <DocumentPlusIcon style={{ width: '24px', color: 'var(--color-red)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="inter-bold" style={{ fontSize: '16px', color: 'var(--color-dark)' }}>Add Manually</span>
                            <span className="inter-regular" style={{ fontSize: '14px', color: 'var(--color-gray)' }}>Add a fanfic to myArkived</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
