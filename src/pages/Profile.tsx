import { useState, useEffect } from 'react';
import { getRelativeTimeStrict } from '../utils/timeFormat';
import { Book } from '../components/BookCard';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { getUserActivityFeed } from '../services/dbService';
import { supabase } from '../services/supabase';

interface ProfileProps {
  onBookSelect?: (book: Book) => void;
}

export default function Profile({ onBookSelect }: ProfileProps) {
  const { user, username, signOut } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({ reads: 0, bookmarks: 0, readlist: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      // Fetch activity
      const activity = await getUserActivityFeed(user.id);
      setRecentActivity(activity);

      // Fetch stats
      const { count: reads } = await supabase.from('user_fics').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('reading_status', 'finished');
      const { count: readlist } = await supabase.from('user_fics').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('reading_status', 'readlist');
      const { count: bookmarks } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      setStats({
        reads: reads || 0,
        bookmarks: bookmarks || 0,
        readlist: readlist || 0
      });
    };

    fetchProfileData();
  }, [user]);

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className="page-container">
      <div className="profile-header-expanded" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <button
          onClick={signOut}
          className="inter-bold"
          style={{
            position: 'absolute', top: '20px', right: '20px',
            padding: '8px 16px', backgroundColor: 'transparent',
            border: '1px solid var(--color-gray)', borderRadius: '4px',
            cursor: 'pointer', color: 'var(--color-dark)'
          }}
        >
          Logout
        </button>
        <div className="avatar inter-bold profile-avatar-large">{avatarLetter}</div>
        <h2 className="rakkas-regular profile-name-large">{username}</h2>
      </div>

      <div className="stats-row profile-stats-row">
        <div className="stat-item profile-stat-item">
          <span className="stat-value inter-bold profile-stat-value">{stats.reads}</span>
          <span className="stat-label inter-regular uppercase profile-stat-label">READS</span>
        </div>
        <div className="stat-item profile-stat-item">
          <span className="stat-value inter-bold profile-stat-value">{stats.bookmarks}</span>
          <span className="stat-label inter-regular uppercase profile-stat-label">BOOKMARKS</span>
        </div>
        <div className="stat-item profile-stat-item">
          <span className="stat-value inter-bold profile-stat-value">{stats.readlist}</span>
          <span className="stat-label inter-regular uppercase profile-stat-label">READLIST</span>
        </div>
      </div>

      <h3 className="inter-bold uppercase profile-section-title">FAVOURITE READS</h3>
      <div className="profile-fav-reads-grid">
        {[0, 1, 2].map((index) => (
          <div key={index} className="fav-book-cover-container profile-fav-book-cover-container">
            <img
              src="/tempCover.png"
              alt={`Empty slot ${index + 1}`}
              className="fav-book-cover"
              style={{ opacity: 0.6 }}
            />
          </div>
        ))}
      </div>

      <h3 className="inter-bold uppercase profile-section-title">RECENT ACTIVITY</h3>
      <div className="activity-list profile-activity-list">
        {recentActivity.length === 0 ? (
          <div className="activity-item inter-regular" style={{ color: 'var(--color-gray)' }}>
            No recent activity
          </div>
        ) : (
          recentActivity.map((item) => {
            const lower = item.actions.map((a: string) => a.toLowerCase());
            let actionString = lower.join(', ');
            if (lower.length > 1) {
              actionString = lower.slice(0, -1).join(', ') + (lower.length > 2 ? ',' : '') + ' and ' + lower[lower.length - 1];
            }

            return (
              <div key={item.id} className="activity-item inter-regular profile-activity-item">
                <div className="profile-activity-text">
                  You {actionString} {' '}
                  {onBookSelect && item.bookData ? (
                    <span className="activity-title inter-bold" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onBookSelect(item.bookData)}>"{item.bookTitle}"</span>
                  ) : (
                    <span className="activity-title inter-bold">"{item.bookTitle}"</span>
                  )}
                  {item.isReread ? ' again' : ''}
                  {item.rating ? (
                    <span style={{ marginLeft: '4px', verticalAlign: 'middle', display: 'inline-flex', gap: '2px' }}>
                      {[...Array(Math.max(0, Math.floor(Number(item.rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '14px', color: 'var(--color-dark)' }} />)}
                    </span>
                  ) : null}
                  {item.finishedDate || item.startedDate ? ` on ${item.finishedDate || item.startedDate}` : ''}
                </div>
                <div className="profile-activity-time">
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
