import React from 'react';

interface WelcomeProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    onGetStarted: () => void;
}

interface FeatureBlockProps {
    title: string;
    description: React.ReactNode;
    imageSrc: string;
    imageLeft?: boolean;
}

function FeatureBlock({ title, description, imageSrc, imageLeft = false }: FeatureBlockProps) {
    return (
        <div className={`feature-block-row ${imageLeft ? 'image-left' : ''}`}>
            <div className="feature-content">
                <h3 className="rakkas-regular feature-title">{title}</h3>
                <p className="inter-regular feature-desc">
                    {description}
                </p>
            </div>
            <div className="feature-content">
                <img src={imageSrc} alt={title} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
    );
}

export default function Welcome({ setIsLoggedIn, onGetStarted }: WelcomeProps) {
    return (
        <div style={{
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            backgroundColor: 'var(--color-white)'
        }}>
            {/* Banner Section */}
            <div className="welcome-banner">
                <img src="/welcomebanner.png" alt="Welcome Banner" className="welcome-banner-img" />
                {/* Bottom Right Slogan */}
                <div className="hero-text-container">
                    <p className="rakkas-regular hero-text">
                        count every word.<br />
                        keep every kudo.<br />
                        track every ship.
                    </p>
                    <button className="inter-bold hero-btn" onClick={onGetStarted}>
                        Get Started
                    </button>
                </div>
            </div>

            {/* How it works section */}
            <div style={{ padding: '1px 20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: 'var(--color-white)', color: 'var(--color-red)' }}>
                <h2 className="rakkas-regular welcome-section-title">
                    How myArkived works
                </h2>

                <p className="inter-regular welcome-section-subtitle">
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
        </div>
    );
}
