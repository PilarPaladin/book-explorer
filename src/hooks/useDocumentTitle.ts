import { useEffect } from 'react';

/**
 * A custom hook to dynamically update the browser tab title.
 * Automatically appends " | myArkived" to the provided title.
 * Restores the previous title when the component unmounts.
 * 
 * @param title - The page-specific title string.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    
    // Append base title
    document.title = `${title} | myArkived`;

    // Cleanup: restore previous title on unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
