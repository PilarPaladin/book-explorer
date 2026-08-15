import React, { useState, useEffect } from 'react';
import { getRecentActivity, RecentActivityItem } from '../services/activityLogger';
import { BookActivity, useBookActivity } from '../hooks/useBookActivity';
import { PencilIcon, Bars3Icon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import FinishedModal from '../components/FinishedModal';

interface JournalProps {
  onBookSelect?: (book: any) => void;
}

function EditModalWrapper({ book, onClose }: { book: any, onClose: () => void }) {
  const { activity, updateActivity } = useBookActivity(book);
  return (
    <FinishedModal
      isEditMode={true}
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
  setEditingItem: (item: { book: any, activity: any }) => void;
}

function JournalTableRow({ data, onBookSelect, setEditingItem }: JournalTableRowProps) {
  const { item, bookState, showMonth, dayStr, monthStr, yearStr, statusText, rating, isLoved, hasReview, isReread } = data;
  const coverUrl = bookState?.bookData?.cover_i
    ? `https://covers.openlibrary.org/b/id/${bookState.bookData.cover_i}-S.jpg`
    : '/tempCover.png';

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
            <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 5px', alignItems: 'flex-start', justifyContent: 'center' }}>
            {onBookSelect && bookState?.bookData ? (
              <span className="rakkas-regular" style={{ cursor: 'pointer', color: 'var(--color-red)', fontSize: '25px', fontWeight: 'bold', letterSpacing: '1.5px', textDecoration: 'underline', lineHeight: 1.2 }} onClick={() => onBookSelect(bookState.bookData)}>
                {item.bookTitle}
              </span>
            ) : (
              <span className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '25px', fontWeight: 'bold', letterSpacing: '1.5px', lineHeight: 1.2 }}>{item.bookTitle}</span>
            )}
            <span className="inter-regular" style={{ color: 'var(--color-dark)', fontSize: '14px', marginTop: '4px' }}>
              {bookState?.bookData?.author_name?.join(', ') || ''}
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
      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: 'var(--color-dark)' }}>
          <PencilIcon
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            onClick={() => {
              if (bookState?.bookData) {
                setEditingItem({ book: bookState.bookData, activity: bookState });
              }
            }}
          />
        </div>
      </td>
    </tr>
  );
}

export default function Journal({ onBookSelect }: JournalProps) {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [userActivity, setUserActivity] = useState<Record<string, BookActivity>>({});
  const [editingItem, setEditingItem] = useState<{ book: any, activity: any } | null>(null);

  useEffect(() => {
    const getFilteredActivity = () => {
      return getRecentActivity()
        .filter(a => a.startedDate || a.finishedDate)
        .sort((a, b) => {
          const aDate = new Date(a.finishedDate || a.startedDate!).getTime();
          const bDate = new Date(b.finishedDate || b.startedDate!).getTime();
          return bDate - aDate;
        });
    };

    setActivities(getFilteredActivity());

    const storedUserActivity = localStorage.getItem('userActivity');
    if (storedUserActivity) {
      try {
        setUserActivity(JSON.parse(storedUserActivity));
      } catch (e) {
        console.error('Failed to parse user activity', e);
      }
    }

    const handleActivityUpdated = () => {
      const stored = localStorage.getItem('userActivity');
      if (stored) {
        try {
          setUserActivity(JSON.parse(stored));
        } catch { }
      }
    };

    const handleRecent = () => setActivities(getFilteredActivity());
    window.addEventListener('recent-activity-updated', handleRecent);
    window.addEventListener('activity-updated', handleActivityUpdated);
    return () => {
      window.removeEventListener('recent-activity-updated', handleRecent);
      window.removeEventListener('activity-updated', handleActivityUpdated);
    };
  }, []);

  const parsedActivities = activities.map((item, index) => {
    const itemDateStr = item.finishedDate || item.startedDate!;
    const date = new Date(itemDateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const monthStr = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const monthStrLong = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const yearStr = date.getFullYear().toString();
    const dayStr = date.getDate().toString().padStart(2, '0');

    const prevItem = index > 0 ? activities[index - 1] : null;
    const prevDateStr = prevItem ? (prevItem.finishedDate || prevItem.startedDate!) : null;
    const prevDate = prevDateStr ? new Date(prevDateStr) : null;
    if (prevDate) prevDate.setMinutes(prevDate.getMinutes() + prevDate.getTimezoneOffset());
    const showMonth = !prevDate || prevDate.getMonth() !== date.getMonth() || prevDate.getFullYear() !== date.getFullYear();

    const bookState = userActivity[item.bookKey];
    let statusText = 'Finished';
    if (item.actions.includes('Started')) statusText = 'Started';
    else if (item.actions.includes('Finished') || item.actions.includes('Read')) statusText = 'Finished';

    const rating = item.rating || bookState?.rating || 0;
    const isLoved = bookState?.isLoved || false;
    const hasReview = !!bookState?.review;

    const isReread = !!item.isReread;
    return { item, date, showMonth, dayStr, monthStr, monthStrLong, yearStr, statusText, rating, isLoved, hasReview, bookState, isReread };
  });

  return (
    <div style={{ padding: '0px 0px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="journal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--color-red)', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 className="rakkas-regular" style={{ fontSize: '42px', color: 'var(--color-red)', margin: 0 }}>
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
                <td colSpan={9} className="inter-bold" style={{ textAlign: 'center', padding: '50px', color: 'var(--color-dark)', fontSize: '16px' }}>No activity yet. Start interacting with books!</td>
              </tr>
            ) : (
              parsedActivities.map((data) => (
                <JournalTableRow
                  key={data.item.id}
                  data={data}
                  onBookSelect={onBookSelect}
                  setEditingItem={setEditingItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-journal">
        {parsedActivities.length === 0 ? (
          <div className="inter-bold" style={{ textAlign: 'center', padding: '50px', color: 'var(--color-dark)', fontSize: '16px' }}>No activity yet. Start interacting with books!</div>
        ) : (
          parsedActivities.map((data) => {
            const { item, showMonth, dayStr, monthStrLong, yearStr, rating, isLoved, bookState, isReread } = data;
            const coverUrl = bookState?.bookData?.cover_i
              ? `https://covers.openlibrary.org/b/id/${bookState.bookData.cover_i}-S.jpg`
              : '/tempCover.png';

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
                    <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      {onBookSelect && bookState?.bookData ? (
                        <span className="rakkas-regular" style={{ fontSize: '24px', color: 'var(--color-red)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onBookSelect(bookState.bookData)}>
                          {item.bookTitle}
                        </span>
                      ) : (
                        <span className="inter-bold" style={{ fontSize: '20px', color: 'var(--color-red)' }}>{item.bookTitle}</span>
                      )}
                      <span className="inter-regular" style={{ fontSize: '12px', color: 'var(--color-dark)' }}>
                        {(() => {
                          const authorText = bookState?.bookData?.author_name?.join(', ') || '';
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
                      <Bars3Icon style={{ width: '16px', color: '#6b7280', cursor: 'pointer' }} onClick={() => { if (bookState?.bookData) setEditingItem({ book: bookState.bookData, activity: bookState }); }} />
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
          book={editingItem.book}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
