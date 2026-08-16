import { XMarkIcon } from '@heroicons/react/24/outline';
import { useScrollLock } from '../hooks/useScrollLock';

interface GuestModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export default function GuestModal({ onClose, onConfirm }: GuestModalProps) {
    useScrollLock();

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            {/* Modal Container */}
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button onClick={onClose} className="modal-close-btn">
                    <XMarkIcon />
                </button>

                {/* Title */}
                <h2 className="rakkas-regular">
                    Warning !
                    <div style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '10px', marginBottom: '20px' }}></div>
                </h2>

                {/* Warning Text */}
                <div className="guest-warning-container">
                    <p className="guest-warning-text inter-regular">
                        You are about to browse myArkive as a guest.
                    </p>
                    <p className="guest-warning-text inter-regular">
                        Please note that everything you do is saved locally on this device.
                    </p>
                    <p className="guest-warning-text inter-bold">
                        You might run into some issues, or the experience may feel incomplete and unpolished
                    </p>
                    <p className="guest-warning-text inter-regular">
                        If you clear your browser data or use a different device, your data will be lost and the app will not work as intended across sessions.
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={onConfirm}
                    className="auth-btn inter-bold"
                >
                    I understand
                </button>
            </div>
        </div>
    );
}
