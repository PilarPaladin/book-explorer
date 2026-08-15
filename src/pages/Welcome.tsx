import React, { useState } from 'react';
import SignInModal from '../components/SignInModal';
import LogInModal from '../components/LogInModal';

interface WelcomeProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

interface FeatureBlockProps {
    title: string;
    description: React.ReactNode;
    imageSrc: string;
    imageLeft?: boolean;
}

function FeatureBlock({ title, description, imageSrc, imageLeft = false }: FeatureBlockProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '50px', flexDirection: imageLeft ? 'row-reverse' : 'row' }}>
            <div style={{ flex: 1 }}>
                <h3 className="rakkas-regular" style={{ fontSize: '48px', margin: '0 0 20px 0' }}>{title}</h3>
                <p className="inter-regular" style={{ fontSize: '20px', lineHeight: '1.5', margin: 0 }}>
                    {description}
                </p>
            </div>
            <div style={{ flex: 1 }}>
                <img src={imageSrc} alt={title} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
    );
}

export default function Welcome({ setIsLoggedIn }: WelcomeProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalType, setAuthModalType] = useState<'register' | 'login'>('register');

    return (
        <div style={{
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            backgroundColor: 'var(--color-white)'
        }}>
            {/* Banner Section */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '80vh',
                    backgroundImage: `url(/welcomebanner.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Bottom Right Slogan */}
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', textAlign: 'center' }}>
                    <p className="rakkas-regular" style={{
                        fontSize: '44px',
                        color: 'var(--color-white)',
                        margin: 0,
                        lineHeight: '1.4',
                        textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
                    }}>
                        count every word.<br />
                        keep every kudo.<br />
                        track every ship.
                    </p>
                    <button
                        className="inter-bold"
                        onClick={() => { setIsAuthModalOpen(true); setAuthModalType('register'); }}
                        style={{
                            marginTop: '25px',
                            backgroundColor: 'var(--color-red)',
                            color: 'var(--color-white)',
                            border: 'none',
                            padding: '16px 48px',
                            fontSize: '20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* How it works section */}
            <div style={{ padding: '1px 20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: 'var(--color-white)', color: 'var(--color-red)' }}>
                <h2 className="rakkas-regular" style={{ fontSize: '72px', margin: '0 0 20px 0', textAlign: 'center' }}>
                    How myArkived works
                </h2>

                <p className="inter-regular" style={{ fontSize: '24px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto 80px auto', lineHeight: '1.4' }}>
                    <strong>Sign in</strong> or <strong>register</strong> to unlock your personal vault. Curate your readlist with private custom images, and track your stats all in one place— completely for free.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    
                    <FeatureBlock 
                        title="Log what you've read"
                        description="Get your myArkived underway by visiting our All section or pasting an AO3 link to log a few fics you've read. Click the 👁️ on any Fic poster to tell us you've read it (add a ❤️ if you loved it and/or a star rating). We add all logged titles to your profile."
                        imageSrc="/detailbannertemp.png"
                    />

                    <FeatureBlock 
                        title="Browse fics across fandoms"
                        description="You can find your logged fics in the tab of your profile. As you add more content, your profile starts to reflect your taste. You can also browse the fics uploaded by the community."
                        imageSrc="/detailbannertemp.png"
                        imageLeft={true}
                    />

                    <FeatureBlock 
                        title="Save fics to read later"
                        description="The watchlist, lets you keep a list of fics you want to start reading in the future."
                        imageSrc="/detailbannertemp.png"
                    />

                    <FeatureBlock 
                        title="Build a personal journal"
                        description="Track all your activity in your journal, see evrything you've interacted with."
                        imageSrc="/detailbannertemp.png"
                        imageLeft={true}
                    />

                </div>
            </div>

            {isAuthModalOpen && authModalType === 'register' && (
                <SignInModal
                    onClose={() => setIsAuthModalOpen(false)}
                    onSwitchToLogin={() => setAuthModalType('login')}
                />
            )}
            {isAuthModalOpen && authModalType === 'login' && (
                <LogInModal
                    onClose={() => setIsAuthModalOpen(false)}
                    onSwitchToRegister={() => setAuthModalType('register')}
                    onLoginSuccess={() => setIsLoggedIn(true)}
                />
            )}
        </div>
    );
}
