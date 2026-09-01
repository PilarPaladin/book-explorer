import React, { useEffect } from 'react';

export interface SEOProps {
  /** The specific title for the page. " | myArkived" will be appended automatically. */
  title: string;
  /** A brief description of the page for search engine snippets. */
  description: string;
  /** The canonical URL to prevent duplicate content issues in search engines. */
  canonicalUrl?: string;
  /** A JSON object representing structured data (JSON-LD). */
  structuredData?: Record<string, unknown>;
}

/**
 * A reusable React component that dynamically injects metadata into the document <head>.
 * This uses vanilla DOM manipulation and handles cleanup automatically on unmount.
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  structuredData,
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | myArkived`;
    const previousTitle = document.title;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    let previousDescription: string | null = null;
    let createdDescription = false;
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
      createdDescription = true;
    } else {
      previousDescription = metaDescription.getAttribute('content');
    }
    metaDescription.setAttribute('content', description);

    // 3. Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    let previousCanonical: string | null = null;
    let createdCanonical = false;
    
    if (canonicalUrl) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
        createdCanonical = true;
      } else {
        previousCanonical = linkCanonical.getAttribute('href');
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    // 4. Inject JSON-LD Structured Data
    let scriptJsonLd: HTMLScriptElement | null = null;
    if (structuredData) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.setAttribute('type', 'application/ld+json');
      scriptJsonLd.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptJsonLd);
    }

    // Cleanup Function
    return () => {
      document.title = previousTitle;
      
      // Restore or remove description
      if (createdDescription) {
        metaDescription?.remove();
      } else if (previousDescription !== null) {
        metaDescription?.setAttribute('content', previousDescription);
      }

      // Restore or remove canonical link
      if (createdCanonical) {
        linkCanonical?.remove();
      } else if (previousCanonical !== null) {
        linkCanonical?.setAttribute('href', previousCanonical);
      }

      // Remove structured data script
      if (scriptJsonLd) {
        scriptJsonLd.remove();
      }
    };
  }, [title, description, canonicalUrl, structuredData]);

  // This component doesn't render any visible DOM elements
  return null;
};

export default SEO;
