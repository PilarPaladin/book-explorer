import React from 'react';

export default function Sidebar({ isLoading }) {
  return (
    <div className="right-column">
      <div className="profile-section">
        <div className="avatar inter-bold">👤</div>
        <h3 className="profile-name inter-bold">PilarPaladin <span className="pro-badge inter-bold">PRO</span></h3>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value inter-bold">0</span>
          <span className="stat-label inter-regular uppercase">BOOKS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">0</span>
          <span className="stat-label inter-regular uppercase">BOOKMARKS</span>
        </div>
        <div className="stat-item">
          <span className="stat-value inter-bold">0</span>
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
          <>
            <img src="https://covers.openlibrary.org/b/id/8406786-M.jpg" alt="Fav 1" className="fav-book-cover" />
            <img src="https://covers.openlibrary.org/b/id/9251896-M.jpg" alt="Fav 2" className="fav-book-cover" />
            <img src="https://covers.openlibrary.org/b/id/9251897-M.jpg" alt="Fav 3" className="fav-book-cover" />
          </>
        )}
      </div>

      <h4 className="section-title inter-bold uppercase">RECENT ACTIVITY</h4>
      <div className="activity-list">
        <div className="activity-item inter-regular">
          You added <span className="activity-title inter-bold">"Dune"</span> to your readlist 2d
        </div>
        <div className="activity-item inter-regular">
          You loved <span className="activity-title inter-bold">"Tempest"</span> 2d
        </div>
        <div className="activity-item inter-regular">
          You bookmarked <span className="activity-title inter-bold">"Ultraviolence"</span> at <span className="inter-italic">page 15</span> 2d
        </div>
        <div className="activity-item inter-regular">
          You watched, loved, and rated <span className="activity-title inter-bold">"Talk to me Dirty; Talk to me Sweet"</span>on Sunday Aug 9, 2026 3d
        </div>
        <div className="activity-item inter-regular">
          You added <span className="activity-title inter-bold">"I Don't Have to Sell My Soul"</span> to your readlist 2d
        </div>
        <div className="activity-item inter-regular">
          You rated <span className="activity-title inter-bold">"Self Control"</span> on Thursday Aug 6, 2026 5d
        </div>
      </div>
    </div>
  );
}
