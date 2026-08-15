import React, { useState, useEffect } from 'react';
import { getRecentActivity, RecentActivityItem } from '../services/activityLogger';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { getRelativeTimeStrict } from '../utils/timeFormat';

function formatActions(actions: string[]) {
    const verbMap: Record<string, string> = {
        'Started': 'started',
        'Finished': 'finished',
        'Loved': 'liked',
        'Rated': 'rated',
        'Reviewed': 'reviewed',
        'Bookmarked': 'bookmarked',
        'Added to Readlist': 'added'
    };

    const verbs = actions.map(a => verbMap[a] || a.toLowerCase());

    if (verbs.includes('added')) {
        return { verbsText: 'added', suffix: 'to your readlist' };
    }

    let verbsText = '';
    if (verbs.length === 1) {
        verbsText = verbs[0];
    } else if (verbs.length === 2) {
        verbsText = `${verbs[0]} and ${verbs[1]}`;
    } else if (verbs.length > 2) {
        verbsText = `${verbs.slice(0, -1).join(', ')} and ${verbs[verbs.length - 1]}`;
    }

    return { verbsText, suffix: '' };
}

interface ActivityFeedProps {
  onBookSelect?: (book: any) => void;
}

interface ActivityFeedItemProps {
    item: RecentActivityItem;
    userActivity: any;
    onBookSelect?: (book: any) => void;
    verbsText: string;
    suffix: string;
    dateStr: string;
    relTime: string;
}

function ActivityFeedItem({ item, userActivity, onBookSelect, verbsText, suffix, dateStr, relTime }: ActivityFeedItemProps) {
    const hasReview = !!item.review;
    const bookState = userActivity[item.bookKey];
    const coverUrl = bookState?.bookData?.cover_i
        ? `https://covers.openlibrary.org/b/id/${bookState.bookData.cover_i}-M.jpg`
        : '/tempCover.png';
    const firstPublishYear = bookState?.bookData?.first_publish_year || '';

    return (
        <div style={{ borderBottom: '1px solid var(--color-gray)', padding: '15px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="inter-regular" style={{ color: 'var(--color-dark)', fontSize: '15px' }}>
                    You {verbsText} {' '}
                    {onBookSelect && bookState?.bookData ? (
                        <strong 
                            style={{ color: '#990000', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }} 
                            onClick={() => onBookSelect(bookState.bookData)}
                        >
                            {item.bookTitle}
                        </strong>
                    ) : (
                        <strong style={{ color: '#990000', fontWeight: 'bold' }}>{item.bookTitle}</strong>
                    )}
                    {suffix ? ` ${suffix}` : ''}
                    {!hasReview && item.rating ? (
                        <span style={{ marginLeft: '6px', color: 'var(--color-dark)', fontSize: '12px', verticalAlign: 'middle', display: 'inline-flex', gap: '1px' }}>
                            {[...Array(Math.max(0, Math.floor(Number(item.rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '13px' }} />)}
                        </span>
                    ) : null}
                    {dateStr}
                </div>
                <div className="inter-regular" style={{ color: 'var(--color-gray)', fontSize: '14px', minWidth: '40px', textAlign: 'right' }}>
                    {relTime}
                </div>
            </div>

            {hasReview && (
                <div style={{ display: 'flex', gap: '20px', marginTop: '15px', paddingLeft: '5px' }}>
                    <div style={{ width: '110px', flexShrink: 0, border: '1px solid var(--color-gray)', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', display: 'block', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }} />
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <h3 className="rakkas-regular" style={{ fontSize: '28px', color: 'var(--color-dark)', margin: 0, lineHeight: 1 }}>{item.bookTitle}</h3>
                            {firstPublishYear && <span className="inter-regular" style={{ color: 'var(--color-gray)', fontSize: '16px' }}>{firstPublishYear}</span>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', marginBottom: '15px' }}>
                            {item.rating ? (
                                <div style={{ display: 'flex', color: 'var(--color-dark)', gap: '1px' }}>
                                    {[...Array(Math.max(0, Math.floor(Number(item.rating) || 0)))].map((_, i) => <StarSolid key={i} style={{ width: '18px' }} />)}
                                </div>
                            ) : null}
                            {item.actions.includes('Loved') && <HeartSolid style={{ width: '18px', color: '#990000' }} />}
                        </div>

                        <p className="inter-regular" style={{ color: 'var(--color-dark)', fontSize: '16px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                            {item.review}
                        </p>

                        <div className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-gray)', fontSize: '14px', marginTop: 'auto' }}>
                            <HeartSolid style={{ width: '16px', color: 'var(--color-gray)' }} /> No likes yet
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ActivityFeed({ onBookSelect }: ActivityFeedProps) {
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [userActivity, setUserActivity] = useState<any>({});

    useEffect(() => {
        setActivities(getRecentActivity());

        const stored = localStorage.getItem('userActivity');
        if (stored) {
            try {
                setUserActivity(JSON.parse(stored));
            } catch { }
        }

        const handleRecent = () => setActivities(getRecentActivity());
        window.addEventListener('recent-activity-updated', handleRecent);
        return () => window.removeEventListener('recent-activity-updated', handleRecent);
    }, []);

    return (
        <div style={{ padding: '0px 0px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <div style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2 className="rakkas-regular" style={{ fontSize: '42px', color: '#990000', margin: 0 }}>
                    My Activity
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activities.length === 0 ? (
                    <div className="inter-bold" style={{ textAlign: 'center', padding: '50px', color: 'var(--color-dark)', fontSize: '16px' }}>
                        No activity yet. Start interacting with fics!
                    </div>
                ) : (
                    activities.map(item => {
                        const relTime = getRelativeTimeStrict(item.timestamp);
                        const { verbsText, suffix } = formatActions(item.actions);

                        let dateStr = '';
                        const userDate = item.startedDate || item.finishedDate;
                        if (userDate) {
                            const d = new Date(userDate);
                            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
                            const month = d.toLocaleString('en-US', { month: 'short' });
                            const day = d.getDate();
                            const year = d.getFullYear();
                            dateStr = ` on ${d.toLocaleString('en-US', { weekday: 'long' })} ${month} ${day}, ${year}`;
                        }

                        return (
                            <ActivityFeedItem 
                                key={item.id}
                                item={item} 
                                userActivity={userActivity} 
                                onBookSelect={onBookSelect} 
                                verbsText={verbsText} 
                                suffix={suffix} 
                                dateStr={dateStr} 
                                relTime={relTime} 
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
