import React, { useState } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  setCurrentPage: (page: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsLogModalOpen: (isOpen: boolean) => void;
}

export default function Header({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  setCurrentPage,
  handleSearch,
  searchQuery,
  setSearchQuery,
  setIsLogModalOpen
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <div onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" className="logo" />
            <h1 className="brand-name rakkas-regular">myArkived</h1>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="mobile-actions" style={{ flexGrow: isMobileSearchOpen ? 1 : 0, marginLeft: isMobileSearchOpen ? '10px' : '0' }}>
            <button className="inter-bold" onClick={() => { setIsLogModalOpen(true); setIsMobileMenuOpen(false); }} style={{
              backgroundColor: 'var(--color-red)', color: 'white', border: '1px solid var(--color-white)',
              borderRadius: '4px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              flexShrink: 0
            }}>
              + LOG
            </button>

            {isMobileSearchOpen ? (
              <form className="search-form" onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }} style={{ position: 'relative', display: 'flex', flexGrow: 1, margin: '0 5px', minWidth: '100px' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input inter-regular"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '4px 25px 4px 10px', height: '28px', fontSize: '13px', width: '100%', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none', boxSizing: 'border-box' }}
                  autoFocus
                />
                <button type="button" onClick={() => setIsMobileSearchOpen(false)} style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#64748b' }}>
                  <XMarkIcon style={{ width: '16px' }} />
                </button>
              </form>
            ) : (
              <button className="mobile-action-btn" onClick={() => { setIsMobileSearchOpen(true); setIsMobileMenuOpen(false); }} style={{ flexShrink: 0 }}>
                <MagnifyingGlassIcon style={{ width: '24px' }} />
              </button>
            )}

            <button className="mobile-action-btn" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsMobileSearchOpen(false); }} style={{ flexShrink: 0 }}>
              {isMobileMenuOpen ? <XMarkIcon style={{ width: '28px' }} /> : <Bars3Icon style={{ width: '28px' }} />}
            </button>
          </div>
        ) : (
          <div className="mobile-auth-buttons">
            <button className="inter-bold mobile-auth-btn mobile-auth-btn-solid" onClick={() => { onRegisterClick?.(); setIsMobileMenuOpen(false); }}>
              Sign Up
            </button>
            <button className="inter-bold mobile-auth-btn mobile-auth-btn-outline" onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }}>
              Log In
            </button>
          </div>
        )}
      </div>


      <nav className={`header-nav inter-bold ${isLoggedIn && isMobileMenuOpen ? 'mobile-open' : ''} ${!isLoggedIn ? 'desktop-only' : ''}`}>
        {isLoggedIn ? (
          <>
            <div className="nav-links">
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('bookmarks'); }}>Bookmarks</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('readlist'); }}>Readlist</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('journal'); }}>Journal</a>
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('activity'); }}>Activity</a>
            </div>

            <form className="search-container desktop-search" onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} style={{ margin: 0, height: '36px', display: 'flex', position: 'relative', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search myArkived"
                className="search-input inter-regular"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0 35px 0 15px', height: '100%', fontSize: '14px', width: '240px', borderRadius: '4px', border: 'none', outline: 'none' }}
              />
              <button type="submit" style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <MagnifyingGlassIcon style={{ width: '18px' }} />
              </button>
            </form>
            
            <button className="inter-bold desktop-log-btn" onClick={() => { setIsLogModalOpen(true); setIsMobileMenuOpen(false); }} style={{
              backgroundColor: 'var(--color-red)', color: 'white', border: '2px solid var(--color-white)',
              borderRadius: '4px', padding: '8px 16px', fontSize: '15px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              justifyContent: 'center'
            }}>
              + LOG
            </button>
          </>
        ) : (
          <div className="desktop-auth-buttons" style={{ display: 'flex', gap: '15px' }}>
            <button className="inter-bold" onClick={() => { onRegisterClick?.(); setIsMobileMenuOpen(false); }} style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-white)', border: 'none', borderRadius: '4px', padding: '8px 16px', fontSize: '15px', cursor: 'pointer' }}>
              Sign Up
            </button>
            <button className="inter-bold" onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }} style={{ background: 'none', border: '1px solid var(--color-white)', color: 'var(--color-white)', borderRadius: '4px', padding: '8px 16px', fontSize: '15px', cursor: 'pointer' }}>
              Log In
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}