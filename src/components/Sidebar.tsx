import React, { useState, useEffect } from 'react';
import { getRecentActivity, RecentActivityItem } from '../services/activityLogger';
import { getRelativeTimeStrict } from '../utils/timeFormat';
import { Book } from './BookCard';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface SidebarProps {
  isLoading: boolean;
  setCurrentPage?: (page: string) => void;
  onBookSelect?: (book: Book) => void;
}

export default function Sidebar({ isLoading, setCurrentPage, onBookSelect }: SidebarProps) {
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [userActivity, setUserActivity] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setRecentActivity(getRecentActivity());
    
    const stored = localStorage.getItem('userActivity');
    if (stored) {
      try {
        setUserActivity(JSON.parse(stored));
      } catch {}
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {}
    }

    const handleRecent = () => setRecentActivity(getRecentActivity());
    const handleActivity = () => {
      const updated = localStorage.getItem('userActivity');
      if (updated) {
        try {
          setUserActivity(JSON.parse(updated));
        } catch {}
      }
    };

    window.addEventListener('recent-activity-updated', handleRecent);
    window.addEventListener('activity-updated', handleActivity);
    
    return () => {
      window.removeEventListener('recent-activity-updated', handleRecent);
      window.removeEventListener('activity-updated', handleActivity);
    };
  }, []);

  const username = currentUser?.username || 'Guest';
  const avatarLetter = username.charAt(0).toUpperCase();

  const activityValues = Object.values(userActivity) as any[];
  const readsCount = activityValues.filter(v => v.isRead).length;
  const bookmarksCount = activityValues.reduce((sum, v) => {
    if (v.bookmarks && v.bookmarks.length > 0) {
      return sum + v.bookmarks.length;
    }
    return sum + (v.isBookmarked ? 1 : 0);
  }, 0);
  const readlistCount = activityValues.filter(v => v.inReadlist).length;

  return (
    <div className="right-column">
      <div className="profile-section">
        <div className="avatar inter-bold">{avatarLetter}</div>
        <h3 className="profile-name inter-bold">{username}</h3>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value inter-bold">{readsCount}</span>
          <span className="stat-label inter-regular uppercase">READS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">{bookmarksCount}</span>
          <span className="stat-label inter-regular uppercase">BOOKMARKS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">{readlistCount}</span>
          <span className="stat-label inter-regular uppercase">READLIST</span>
        </div>
      </div>

      <h4 className="section-title inter-bold uppercase">FAVOURITE READS</h4>
      <div className="fav-reads-grid">
        {isLoading ? (
          <>
            <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
            <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
            <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
          </>
        ) : (
          [0, 1, 2].map((index) => (
            <div key={index} className="fav-book-cover-container">
              <img 
                src="/tempCover.png" 
                alt={`Empty slot ${index + 1}`} 
                className="fav-book-cover" 
                style={{ opacity: 0.6 }}
              />
            </div>
          ))
        )}
      </div>

      <h4 
        className="section-title inter-bold uppercase" 
        style={{ cursor: setCurrentPage ? 'pointer' : 'default' }}
        onClick={() => setCurrentPage?.('activity')}
      >
        RECENT ACTIVITY
      </h4>
      <div className="activity-list">
        {recentActivity.length === 0 ? (
          <div className="activity-item inter-regular" style={{ color: 'var(--color-gray)' }}>
            No recent activity
          </div>
        ) : (
          recentActivity.slice(0, 8).map((item) => {
            const lower = item.actions.map(a => a.toLowerCase());
            let actionString = lower.join(', ');
            if (lower.length > 1) {
              actionString = lower.slice(0, -1).join(', ') + (lower.length > 2 ? ',' : '') + ' and ' + lower[lower.length - 1];
            }
            
            const bookState = userActivity[item.bookKey];
            const bookData = bookState?.bookData;

            return (
              <div key={item.id} className="activity-item inter-regular" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ paddingRight: '10px' }}>
                  {actionString === 'added to readlist' ? (
                    <>You added {' '}
                      {onBookSelect && bookData ? (
                        <span className="activity-title inter-bold" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onBookSelect(bookData)}>"{item.bookTitle}"</span>
                      ) : (
                        <span className="activity-title inter-bold">"{item.bookTitle}"</span>
                      )}
                      {' '}to your readlist</>
                  ) : (
                    <>You {actionString} {' '}
                      {onBookSelect && bookData ? (
                        <span className="activity-title inter-bold" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onBookSelect(bookData)}>"{item.bookTitle}"</span>
                      ) : (
                        <span className="activity-title inter-bold">"{item.bookTitle}"</span>
                      )}
                      {item.rating ? (
                        <span style={{ marginLeft: '4px', verticalAlign: 'middle', display: 'inline-flex', gap: '1px' }}>
                          {[...Array(Math.max(0, Math.floor(Number(item.rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '12px', color: 'var(--color-dark)' }} />)}
                        </span>
                      ) : null}
                      {item.finishedDate || item.startedDate ? ` on ${item.finishedDate || item.startedDate}` : ''}</>
                  )}
                </div>
                <div style={{ color: 'var(--color-gray)', fontSize: '12px', minWidth: '35px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {getRelativeTimeStrict(item.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
