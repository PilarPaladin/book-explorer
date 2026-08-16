import React from 'react';

interface WelcomeProps {
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
                <img src={imageSrc} alt={title} className="feature-image" />
            </div>
        </div>
    );
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
    return (
        <div className="welcome-wrapper">
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
            <div className="welcome-content">
                <h2 className="rakkas-regular welcome-section-title">
                    How myArkived works
                </h2>

                <p className="inter-regular welcome-section-subtitle">
                    <strong>Sign in</strong> or <strong>register</strong> to unlock your personal vault. Curate your readlist with private custom images, and track your stats all in one place— completely for free.
                </p>

                <div className="welcome-features-container">
                    
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
