import { EyeIcon, EllipsisHorizontalIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid';
import { Book } from './BookCard';

interface BookRibbonProps {
  book: Book;
  isRead: boolean;
  inReadlist: boolean;
  onToggleRead: () => void;
  onToggleReadlist: () => void;
  onOptionsClick?: () => void;
}

export default function BookRibbon({
  isRead,
  inReadlist,
  onToggleRead,
  onToggleReadlist,
  onOptionsClick
}: BookRibbonProps) {
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
        title="Readlist"
        onClick={onToggleReadlist}
        style={{ color: inReadlist ? '#3f7dbe' : undefined }}
      >
        {inReadlist ? <ClockSolid style={{ width: '20px', height: '20px' }} /> : <ClockIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />}
      </span>
    </div>
  );
}
