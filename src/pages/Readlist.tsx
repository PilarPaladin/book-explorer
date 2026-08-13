import React from 'react';

interface ReadlistProps {}

export default function Readlist(props: ReadlistProps) {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2 className="inter-bold" style={{ fontSize: '32px', color: 'var(--color-dark)' }}>Readlists</h2>
      <p className="inter-regular" style={{ fontSize: '18px', color: 'var(--color-dark)', marginTop: '20px' }}>
        This page is currently under construction. Check back later!
      </p>
    </div>
  );
}
