import React, { useState, useEffect } from 'react';
import { EllipsisHorizontalIcon, ArrowPathIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import EditReviewModal from '../components/EditReviewModal';
import AddReviewModal from '../components/AddReviewModal';
import { useAuth } from '../context/AuthContext';
import { getUserActivityFeed, updateReadingSession, deleteReadingSession } from '../services/dbService';
import { useBookActivity } from '../hooks/useBookActivity';

interface JournalProps {
  onBookSelect?: (book: any) => void;
}

function EditModalWrapper({ itemData, onClose }: { itemData: any, onClose: () => void }) {
  const { user } = useAuth();
  
  if (!user) return null;

  const activity = {
    isRead: !!itemData.finishedDate,
    readOnDate: itemData.finishedDate ? new Date(itemData.finishedDate).toISOString().split('T')[0] : undefined,
    startedOnDate: itemData.startedDate ? new Date(itemData.startedDate).toISOString().split('T')[0] : undefined,
    readBefore: !!itemData.isReread,
    review: itemData.review || '',
    rating: itemData.rating || 0,
    isLoved: false,
    inReadlist: false,
    bookmarks: [],
    bookData: itemData.bookData,
    timestamp: Date.now()
  };

  const handleSave = async (updates: any) => {
    if (itemData.id.startsWith('log-')) {
      const logId = itemData.id.replace('log-start-', '').replace('log-', '');
      const ficKey = itemData.bookKey.replace('/works/', '');
      await updateReadingSession(logId, user.id, ficKey, {
        readOnDate: updates.readOnDate,
        startedOnDate: updates.startedOnDate,
        readBefore: updates.readBefore,
        review: updates.review,
        rating: updates.rating
      });
      window.location.reload();
    }
  };

  return (
    <EditReviewModal
      book={itemData.bookData}
      activity={activity as any}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}

function LogModalWrapper({ book, onClose }: { book: any, onClose: () => void }) {
  const { activity, updateActivity } = useBookActivity(book);
  return (
    <AddReviewModal
      book={book}
      activity={activity}
      onClose={onClose}
      onSave={updateActivity}
    />
  );
}

function JournalDateBadge({ monthStr, yearStr }: { monthStr: string, yearStr: string }) {
  return (
    <div style={{ width: '46px', backgroundColor: 'var(--color-white)', borderRadius: '6px', overflow: 'hidden', margin: '0 auto', border: '1px solid var(--color-gray)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '4px' }}>
      <div style={{ backgroundColor: 'var(--color-red)', height: '10px', position: 'relative', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', borderBottom: '1px solid var(--color-gray)' }}>
        <div style={{ width: '3px', height: '6px', backgroundColor: 'var(--color-white)', borderRadius: '1.5px', marginTop: '-4px', border: '1px solid var(--color-gray)' }}></div>
        <div style={{ width: '3px', height: '6px', backgroundColor: 'var(--color-white)', borderRadius: '1.5px', marginTop: '-4px', border: '1px solid var(--color-gray)' }}></div>
        <div style={{ width: '3px', height: '6px', backgroundColor: 'var(--color-white)', borderRadius: '1.5px', marginTop: '-4px', border: '1px solid var(--color-gray)' }}></div>
      </div>
      <div className="inter-bold" style={{ color: 'var(--color-dark)', fontSize: '13px', paddingTop: '4px', letterSpacing: '0.5px' }}>{monthStr}</div>
      <div className="inter-bold" style={{ color: 'var(--color-dark)', fontSize: '11px', paddingBottom: '6px', opacity: 0.8 }}>{yearStr}</div>
    </div>
  );
}

interface JournalTableRowProps {
  data: any;
  onBookSelect?: (book: any) => void;
  setEditingItem: (item: any) => void;
  setLoggingAgainBook: (book: any) => void;
  onDeleteSession: (item: any) => void;
}

function JournalTableRow({ data, onBookSelect, setEditingItem, setLoggingAgainBook, onDeleteSession }: JournalTableRowProps) {
  const { item, showMonth, dayStr, monthStr, yearStr, statusText, rating, isLoved, hasReview, isReread } = data;
  const coverUrl = '/tempCover.png';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr style={{ borderBottom: '1px solid var(--color-gray)' }}>
      <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '15px 0' }}>
        {showMonth && <JournalDateBadge monthStr={monthStr} yearStr={yearStr} />}
      </td>
      <td className="inter-bold" style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: '28px', color: 'var(--color-dark)', fontWeight: 'bold', opacity: 0.9 }}>
        {dayStr}
      </td>
      <td style={{ verticalAlign: 'middle', padding: '20px 0', paddingLeft: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '42px', height: '64px', border: '1px solid var(--color-gray)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundImage: "url('/tempCover.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 5px', alignItems: 'flex-start', justifyContent: 'center' }}>
            {onBookSelect && item.bookData ? (
              <span className="rakkas-regular" style={{ cursor: 'pointer', color: 'var(--color-red)', fontSize: '25px', fontWeight: 'bold', letterSpacing: '1.5px', textDecoration: 'underline', lineHeight: 1.2 }} onClick={() => onBookSelect(item.bookData)}>
                {item.bookTitle}
              </span>
            ) : (
              <span className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '25px', fontWeight: 'bold', letterSpacing: '1.5px', lineHeight: 1.2 }}>{item.bookTitle}</span>
            )}
            <span className="inter-regular" style={{ color: 'var(--color-dark)', fontSize: '14px', marginTop: '4px' }}>
              {item.bookData?.author_name?.join(', ') || ''}
            </span>
          </div>
        </div>
      </td>
      <td className="inter-bold" style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: '15px', color: 'var(--color-dark)' }}>
        {statusText}
      </td>
      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <StarSolid key={star} style={{ width: '18px', height: '18px', color: star <= rating ? 'var(--color-dark)' : 'var(--color-gray)' }} />
          ))}
        </div>
      </td>
      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <HeartSolid style={{ width: '20px', height: '20px', color: isLoved ? 'var(--color-red)' : 'var(--color-gray)', margin: '0 auto' }} />
      </td>
      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        {isReread && <ArrowPathIcon style={{ width: '20px', height: '20px', color: 'var(--color-dark)', margin: '0 auto' }} title="Reread" />}
      </td>
      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <Bars3Icon style={{ width: '24px', height: '24px', color: hasReview ? 'var(--color-dark)' : 'transparent', margin: '0 auto' }} />
      </td>
      <td style={{ verticalAlign: 'middle', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-dark)' }}>
          <EllipsisHorizontalIcon
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          />
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
              <div 
                className="inter-regular"
                style={{ 
                  position: 'absolute', right: '10px', top: '70%', zIndex: 10, 
                  backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '140px',
                  display: 'flex', flexDirection: 'column', textAlign: 'left',
                  fontSize: '14px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                 <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => { setMenuOpen(false); if (item.bookData) setEditingItem(item); }}>Edit review</div>
                 <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => { setMenuOpen(false); if (item.bookData) setLoggingAgainBook(item.bookData); }}>Log again</div>
                 <div style={{ padding: '10px 15px', cursor: 'pointer', color: 'red' }} onClick={() => { setMenuOpen(false); onDeleteSession(item); }}>Delete review</div>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function Journal({ onBookSelect }: JournalProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loggingAgainBook, setLoggingAgainBook] = useState<any>(null);
  
  // Mobile dropdown state tracking which row's menu is open
  const [mobileMenuOpenId, setMobileMenuOpenId] = useState<string | null>(null);

  const handleDeleteSession = async (item: any) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      if (item.id.startsWith('log-')) {
        const logId = item.id.replace('log-start-', '').replace('log-', '');
        await deleteReadingSession(logId);
        window.location.reload();
      } else {
         alert("Cannot delete this type of event directly.");
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchActivity = async () => {
      const feed = await getUserActivityFeed(user.id);
      // Journal strictly shows reading progression (started/finished dates)
      const journalFeed = feed.filter((item: any) => 
        item.actions.includes('Started') || item.actions.includes('Finished')
      );
      setActivities(journalFeed);
    };
    fetchActivity();
  }, [user]);

  const parsedActivities = activities.map((item, index) => {
    const itemDateStr = item.actions.includes('Finished') ? item.finishedDate : item.startedDate!;
    const date = new Date(itemDateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const monthStr = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const monthStrLong = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const yearStr = date.getFullYear().toString();
    const dayStr = date.getDate().toString().padStart(2, '0');

    const prevItem = index > 0 ? activities[index - 1] : null;
    const prevDateStr = prevItem ? (prevItem.actions.includes('Finished') ? prevItem.finishedDate : prevItem.startedDate!) : null;
    const prevDate = prevDateStr ? new Date(prevDateStr) : null;
    if (prevDate) prevDate.setMinutes(prevDate.getMinutes() + prevDate.getTimezoneOffset());
    const showMonth = !prevDate || prevDate.getMonth() !== date.getMonth() || prevDate.getFullYear() !== date.getFullYear();

    let statusText = 'Finished';
    if (item.actions.includes('Started')) statusText = 'Started';
    else if (item.actions.includes('Finished') || item.actions.includes('Read')) statusText = 'Finished';

    const rating = item.rating || 0;
    const isLoved = false; // Supabase bookmark/love separate logic if needed
    const hasReview = !!item.review;

    const isReread = !!item.isReread;
    return { item, date, showMonth, dayStr, monthStr, monthStrLong, yearStr, statusText, rating, isLoved, hasReview, isReread };
  });

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h2 className="rakkas-regular page-title">
          My Journal
        </h2>
      </div>

      <div className="desktop-journal">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: 'var(--color-dark)' }}>
          <thead>
            <tr>
              <th className="inter-bold" style={{ width: '70px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>MONTH</th>
              <th className="inter-bold" style={{ width: '50px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>DAY</th>
              <th className="inter-bold" style={{ padding: '15px 0', textAlign: 'left', paddingLeft: '20px', borderBottom: '1px solid var(--color-gray)' }}>FIC</th>
              <th className="inter-bold" style={{ width: '90px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>STATUS</th>
              <th className="inter-bold" style={{ width: '110px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>RATING</th>
              <th className="inter-bold" style={{ width: '60px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>LIKE</th>
              <th className="inter-bold" style={{ width: '80px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>REREAD</th>
              <th className="inter-bold" style={{ width: '70px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>REVIEW</th>
              <th className="inter-bold" style={{ width: '80px', padding: '15px 0', textAlign: 'center', borderBottom: '1px solid var(--color-gray)' }}>EDIT</th>
            </tr>
          </thead>
          <tbody>
            {parsedActivities.length === 0 ? (
              <tr>
                <td colSpan={9} className="inter-bold" style={{ textAlign: 'center', padding: '50px', color: 'var(--color-dark)', fontSize: '16px' }}>No activity yet. Start logging your fics!</td>
              </tr>
            ) : (
              parsedActivities.map((data) => (
                <JournalTableRow
                  key={data.item.id}
                  data={data}
                  onBookSelect={onBookSelect}
                  setEditingItem={setEditingItem}
                  setLoggingAgainBook={setLoggingAgainBook}
                  onDeleteSession={handleDeleteSession}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-journal">
        {parsedActivities.length === 0 ? (
          <div className="inter-bold" style={{ textAlign: 'center', padding: '50px', color: 'var(--color-dark)', fontSize: '16px' }}>No activity yet. Start logging your fics!</div>
        ) : (
          parsedActivities.map((data) => {
            const { item, showMonth, dayStr, monthStrLong, yearStr, rating, isLoved, isReread } = data;
            const coverUrl = '/tempCover.png';

            return (
              <React.Fragment key={item.id}>
                {showMonth && (
                  <div className="inter-bold" style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-white)', padding: '6px 15px', fontSize: '13px', letterSpacing: '1.5px', marginTop: '15px' }}>
                    {monthStrLong} {yearStr}
                  </div>
                )}
                <div style={{ display: 'flex', padding: '15px', borderBottom: '1px solid #e5e7eb', gap: '15px', alignItems: 'center' }}>
                  <div className="inter-bold" style={{ width: '45px', height: '45px', border: '1px solid var(--color-red)', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: 'var(--color-red)', flexShrink: 0 }}>
                    {parseInt(dayStr, 10)}
                  </div>
                  <div style={{ width: '40px', height: '60px', flexShrink: 0, border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                    <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundImage: "url('/tempCover.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      {onBookSelect && item.bookData ? (
                        <span className="rakkas-regular" style={{ fontSize: '24px', color: 'var(--color-red)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onBookSelect(item.bookData)}>
                          {item.bookTitle}
                        </span>
                      ) : (
                        <span className="inter-bold" style={{ fontSize: '20px', color: 'var(--color-red)' }}>{item.bookTitle}</span>
                      )}
                      <span className="inter-regular" style={{ fontSize: '12px', color: 'var(--color-dark)' }}>
                        {(() => {
                          const authorText = item.bookData?.author_name?.join(', ') || '';
                          return authorText.length > 21 ? authorText.substring(0, 21) + '...' : authorText;
                        })()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {rating > 0 && (
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {[...Array(Math.max(0, Math.floor(Number(rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '14px', color: 'var(--color-dark)' }} />)}
                        </div>
                      )}
                      {isLoved && <HeartSolid style={{ width: '14px', color: 'var(--color-red)' }} />}
                      {isReread && <ArrowPathIcon style={{ width: '14px', color: 'var(--color-dark)' }} title="Reread" />}
                      <div style={{ position: 'relative' }}>
                        <EllipsisHorizontalIcon 
                          style={{ width: '24px', color: '#6b7280', cursor: 'pointer' }} 
                          onClick={(e) => { e.stopPropagation(); setMobileMenuOpenId(mobileMenuOpenId === item.id ? null : item.id); }} 
                        />
                        {mobileMenuOpenId === item.id && (
                          <>
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} onClick={(e) => { e.stopPropagation(); setMobileMenuOpenId(null); }} />
                            <div 
                              className="inter-regular"
                              style={{ 
                                position: 'absolute', right: '0', top: '100%', zIndex: 10, 
                                backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '140px',
                                display: 'flex', flexDirection: 'column', textAlign: 'left',
                                fontSize: '14px'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                               <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => { setMobileMenuOpenId(null); if (item.bookData) setEditingItem(item); }}>Edit review</div>
                               <div style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => { setMobileMenuOpenId(null); if (item.bookData) setLoggingAgainBook(item.bookData); }}>Log again</div>
                               <div style={{ padding: '10px 15px', cursor: 'pointer', color: 'red' }} onClick={() => { setMobileMenuOpenId(null); handleDeleteSession(item); }}>Delete review</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {editingItem && (
        <EditModalWrapper
          itemData={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {loggingAgainBook && (
        <LogModalWrapper
          book={loggingAgainBook}
          onClose={() => setLoggingAgainBook(null)}
        />
      )}
    </div>
  );
}
