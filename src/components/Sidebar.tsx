import { useState, useEffect } from 'react';
import { getRelativeTimeStrict } from '../utils/timeFormat';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { getUserActivityFeed } from '../services/dbService';
import { supabase } from '../services/supabase';

interface SidebarProps {
  isLoading: boolean;
  setCurrentPage?: (page: string) => void;
  onBookSelect?: (book: any) => void;
}

export default function Sidebar({ isLoading, setCurrentPage, onBookSelect }: SidebarProps) {
  const { user, username } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({ reads: 0, bookmarks: 0, readlist: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchSidebarData = async () => {
      // Fetch activity
      const activity = await getUserActivityFeed(user.id);
      setRecentActivity(activity);

      // Fetch stats (simplified for now, doing distinct counts)
      const { count: reads } = await supabase.from('user_fics').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('reading_status', 'finished');
      const { count: readlist } = await supabase.from('user_fics').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('reading_status', 'readlist');
      const { count: bookmarks } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      setStats({
        reads: reads || 0,
        bookmarks: bookmarks || 0,
        readlist: readlist || 0
      });
    };

    fetchSidebarData();
  }, [user]);

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className="right-column">
      <div className="profile-section">
        <div className="avatar inter-bold">{avatarLetter}</div>
        <h3 className="profile-name inter-bold" style={{ cursor: setCurrentPage ? 'pointer' : 'default' }} onClick={() => setCurrentPage?.('profile')}>{username}</h3>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value inter-bold">{stats.reads}</span>
          <span className="stat-label inter-regular uppercase">READS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">{stats.bookmarks}</span>
          <span className="stat-label inter-regular uppercase">BOOKMARKS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">{stats.readlist}</span>
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
            const lower = item.actions.map((a: string) => a.toLowerCase());
            let actionString = lower.join(', ');
            if (lower.length > 1) {
              actionString = lower.slice(0, -1).join(', ') + (lower.length > 2 ? ',' : '') + ' and ' + lower[lower.length - 1];
            }

            return (
              <div key={item.id} className="activity-item inter-regular" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ paddingRight: '10px' }}>
                  You {actionString} {' '}
                  <span className="activity-title inter-bold">"{item.bookTitle}"</span>
                  {item.isReread ? ' again' : ''}
                  {item.rating ? (
                    <span style={{ marginLeft: '4px', verticalAlign: 'middle', display: 'inline-flex', gap: '1px' }}>
                      {[...Array(Math.max(0, Math.floor(Number(item.rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '12px', color: 'var(--color-dark)' }} />)}
                    </span>
                  ) : null}
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
