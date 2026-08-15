

interface LoadingGridProps {
  count?: number;
}

export default function LoadingGrid({ count = 8 }: LoadingGridProps) {
  return (
    <div className="book-grid results-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="book-card" style={{ opacity: 0.6 }}>
          <img src="/tempCover.png" alt="Loading..." className="book-cover" />
        </div>
      ))}
    </div>
  );
}
