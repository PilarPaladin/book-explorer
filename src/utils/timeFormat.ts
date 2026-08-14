export function getRelativeTimeStrict(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `${Math.max(1, diffMins)}m`;
  }
  
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) {
    return `${diffHrs}h`;
  }
  
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) {
    return `${diffWeeks}w`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffDays < 365) {
    return `${diffMonths}mo`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y`;
}
