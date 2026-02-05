import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonical?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'LexFlow - AI-Powered Legal Practice Management';
const DEFAULT_DESCRIPTION = 'The most advanced AI-powered legal practice management platform. Manage cases, clients, documents with version control, AI assistant, calendar, and analytics.';

export function useSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  canonical,
  noIndex = false,
}: SEOProps = {}) {
  useEffect(() => {
    // Set document title
    const fullTitle = title ? `${title} | LexFlow` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to set meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Set description
    const finalDescription = description || DEFAULT_DESCRIPTION;
    setMeta('description', finalDescription);

    // Set keywords
    if (keywords) {
      setMeta('keywords', keywords);
    }

    // Set robots
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    // Open Graph
    setMeta('og:title', ogTitle || fullTitle, true);
    setMeta('og:description', ogDescription || finalDescription, true);
    setMeta('og:type', ogType, true);
    if (ogImage) {
      setMeta('og:image', ogImage, true);
    }

    // Twitter
    setMeta('twitter:title', twitterTitle || fullTitle);
    setMeta('twitter:description', twitterDescription || finalDescription);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // Cleanup function
    return () => {
      // Restore default title when component unmounts
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogType, twitterTitle, twitterDescription, canonical, noIndex]);
}

// Pre-defined SEO configurations for common pages
export const SEO_CONFIG = {
  dashboard: {
    title: 'Dashboard',
    description: 'Your legal practice dashboard with analytics, priority cases, and today\'s meetings.',
    keywords: 'legal dashboard, practice analytics, case overview',
  },
  clients: {
    title: 'Clients',
    description: 'Manage your legal clients - individuals and legal entities. Track contacts, cases, and history.',
    keywords: 'legal CRM, client management, attorney clients',
  },
  cases: {
    title: 'Cases',
    description: 'Comprehensive case management with timeline, tasks, comments, and document tracking.',
    keywords: 'case management, legal cases, court case tracking',
  },
  documents: {
    title: 'Documents',
    description: 'Legal document management with version control, comparison, and AI-powered analysis.',
    keywords: 'legal documents, document version control, document comparison',
  },
  calendar: {
    title: 'Calendar',
    description: 'Schedule and manage meetings, court dates, and appointments with your legal clients.',
    keywords: 'legal calendar, meeting scheduler, court dates',
  },
  analytics: {
    title: 'Analytics',
    description: 'Gain insights into your legal practice with comprehensive analytics and reports.',
    keywords: 'legal analytics, practice reports, law firm metrics',
  },
  aiAssistant: {
    title: 'AI Assistant',
    description: 'AI-powered legal assistant for document analysis, research, and insights.',
    keywords: 'AI legal assistant, document analysis, legal AI',
  },
  settings: {
    title: 'Settings',
    description: 'Configure your LexFlow account, billing, security, and team settings.',
    keywords: 'account settings, legal software settings',
  },
};
