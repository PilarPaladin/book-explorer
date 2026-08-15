import React, { useState } from 'react';

interface BookmarkModalProps {
  onClose: () => void;
  onSave: (chapter: string, page: string, notes: string) => void;
}

const inputStyles: React.CSSProperties = {
  backgroundColor: 'var(--color-gray)',
  border: 'none',
  borderRadius: '6px',
  padding: '12px 15px',
  fontSize: '18px',
  outline: 'none',
  color: '#374151'
};

export default function BookmarkModal({
  onClose,
  onSave
}: BookmarkModalProps) {
  const [chapter, setChapter] = useState('');
  const [page, setPage] = useState('');
  const [notes, setNotes] = useState('');

  const isSubmitDisabled = !chapter.trim() && !page.trim() && !notes.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSave(chapter, page, notes);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <div
        className="bookmark-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', textAlign: 'center' }}>
          Add Bookmark
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="inter-regular" style={{ color: 'var(--color-red)', fontSize: '18px' }}>
              Chapter
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value.replace(/\D/g, ''))}
              className="inter-regular"
              style={inputStyles}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="inter-regular" style={{ color: 'var(--color-red)', fontSize: '18px' }}>
              Page
            </label>
            <input
              type="text"
              value={page}
              onChange={(e) => setPage(e.target.value.replace(/\D/g, ''))}
              className="inter-regular"
              style={inputStyles}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="inter-regular" style={{ color: 'var(--color-red)', fontSize: '18px' }}>
              User Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="inter-regular"
              style={{ ...inputStyles, resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inter-bold"
            style={{
              backgroundColor: isSubmitDisabled ? '#e5e7eb' : 'var(--color-red)',
              color: isSubmitDisabled ? '#9ca3af' : 'var(--color-white)',
              border: 'none',
              borderRadius: '6px',
              padding: '15px',
              fontSize: '20px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Add Bookmark
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="inter-regular"
          style={{
            backgroundColor: 'var(--color-gray)',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '25px'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
