import React, { useState } from 'react';
import { saveFanficToLibrary, scrapeAo3Metadata, getAo3WorkId } from '../services/fanficService';
import { XMarkIcon, ExclamationTriangleIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface AddFicModalProps {
  onClose: () => void;
  onSuccess?: (book: any) => void;
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

const minimizedStyle: React.CSSProperties = {
  position: 'fixed', bottom: '20px', right: '20px',
  backgroundColor: 'white', padding: '15px 20px',
  borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  display: 'flex', alignItems: 'center', gap: '15px', zIndex: 2000,
  border: '1px solid var(--color-gray)'
};

export default function AddFicModal({ onClose, onSuccess }: AddFicModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scrapedBook, setScrapedBook] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const workId = getAo3WorkId(url);
      if (!workId) throw new Error("Invalid AO3 URL");

      // 1. Scrape metadata from AO3 via Edge Function
      const metadata = await scrapeAo3Metadata(url);

      // 2. Save it to our Supabase database (does NOT add to user's readlist)
      await saveFanficToLibrary(url, metadata);
      
      const bookData = {
        id: workId,
        title: metadata.title,
        author: metadata.authors?.join(', ') || '',
        cover: '',
        description: metadata.synopsis,
        key: `/works/${workId}`
      };
      
      setScrapedBook(bookData);
      setIsLoading(false);
      setIsMinimized(false); // Pop back up if it was minimized
      setIsSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the fanfic. Make sure the URL is correct.');
      setIsLoading(false);
      setIsMinimized(false);
    }
  };

  const handleSuccessClose = () => {
    onClose();
    if (onSuccess && scrapedBook) {
      onSuccess(scrapedBook);
    } else {
      window.location.reload();
    }
  };

  if (isMinimized) {
    return (
      <div style={minimizedStyle} className="inter-regular">
        <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid #f3f4f6', borderTop: '3px solid var(--color-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div>
          <strong style={{ display: 'block', fontSize: '14px', color: 'var(--color-dark)' }}>Scraping AO3...</strong>
          <span style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Adding fanfic to library</span>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()} style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'white', borderRadius: '8px' }}>
        
        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--color-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
          <h3 className="rakkas-regular" style={{ margin: 0, color: 'var(--color-red)', fontSize: '24px' }}>
            {isSuccess ? 'Success!' : 'Add Fanfic from AO3'}
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isLoading && (
              <button onClick={() => setIsMinimized(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Minimize">
                <MinusIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Close">
              <XMarkIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }} className="inter-regular">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircleIcon style={{ width: '60px', color: 'green', margin: '0 auto 15px' }} />
              <h3 className="rakkas-regular" style={{ fontSize: '24px', margin: '0 0 10px', color: 'var(--color-dark)' }}>Fic Successfully Added!</h3>
              <p style={{ color: 'var(--color-gray)', marginBottom: '25px' }}>Thank you for contributing to myArkive!</p>
              <button 
                onClick={handleSuccessClose}
                style={{
                  padding: '12px 25px', backgroundColor: 'var(--color-red)', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                View Fic Page
              </button>
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
               <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f4f6', borderTop: '4px solid var(--color-red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
               <h4 style={{ marginTop: '20px', color: 'var(--color-dark)', fontSize: '18px', marginBottom: '8px' }}>Scraping from AO3...</h4>
               <p style={{ color: 'var(--color-gray)', fontSize: '14px', margin: 0 }}>Hang tight while we pull all the tags, summary, and stats!</p>
               <style>
                 {`
                   @keyframes spin {
                     0% { transform: rotate(0deg); }
                     100% { transform: rotate(360deg); }
                   }
                 `}
               </style>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <ExclamationTriangleIcon style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                 <span style={{ fontSize: '14px' }}><strong>Note:</strong> AO3 works that are locked behind an account (only visible to registered AO3 users) cannot be added automatically. Ensure the work is public.</span>
              </div>

              {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>{error}</div>}
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>AO3 URL *</label>
                  <input 
                    type="url" 
                    required 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="https://archiveofourown.org/works/..."
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={!url}
                  style={{ 
                    padding: '12px 15px', 
                    backgroundColor: 'var(--color-red)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: !url ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    opacity: !url ? 0.7 : 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                  Fetch & Save Fanfic
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
