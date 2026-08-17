import { EyeIcon, EllipsisHorizontalIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid';
import { Book } from './BookCard';

interface BookRibbonProps {
  book: Book;
  isRead: boolean;
  isStarted?: boolean;
  inReadlist: boolean;
  onToggleRead: () => void;
  onToggleReadlist: () => void;
  onOptionsClick?: () => void;
}

export default function BookRibbon({
  isRead,
  isStarted = false,
  inReadlist,
  onToggleRead,
  onToggleReadlist,
  onOptionsClick
}: BookRibbonProps) {
  const isReadlistDisabled = isRead || isStarted;

  return (
    <div className="book-ribbon" onClick={(e) => e.stopPropagation()}>
      <span className="action-icon dark-icon" title="More options" onClick={onOptionsClick} style={{ marginBottom: '-7px' }} >
        <EllipsisHorizontalIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />
      </span>
      <span
        className="action-icon dark-icon eye"
        title="Toggle read"
        onClick={onToggleRead}
        style={{ color: isRead ? '#3a9d46' : undefined }}
      >
        {isRead ? <EyeSolid style={{ width: '20px', height: '20px' }} /> : <EyeIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />}
      </span>
      <span
        className="action-icon dark-icon readlist"
        title={isReadlistDisabled ? "Cannot add to readlist (already started or finished)" : "Toggle readlist"}
        onClick={(e) => {
          if (isReadlistDisabled) {
            e.stopPropagation();
            return;
          }
          onToggleReadlist();
        }}
        style={{ 
          color: inReadlist ? '#3f7dbe' : (isReadlistDisabled ? '#9ca3af' : undefined),
          cursor: isReadlistDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        {inReadlist ? <ClockSolid style={{ width: '20px', height: '20px' }} /> : <ClockIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />}
      </span>
    </div>
  );
}
