import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pagesConfig } from '@/pages.config';

// Lightweight navigation tracker - no Base44 dependency
export default function NavigationTracker() {
  const location = useLocation();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  useEffect(() => {
    const pathname = location.pathname;
    let pageName;

    if (pathname === '/' || pathname === '') {
      pageName = mainPageKey;
    } else {
      const pathSegment = pathname.replace(/^\//, '').split('/')[0];
      const pageKeys = Object.keys(Pages);
      pageName = pageKeys.find(key => key.toLowerCase() === pathSegment.toLowerCase()) || null;
    }

    if (pageName) {
      document.title = `${pageName.replace(/([A-Z])/g, ' $1').trim()} — TransitPredict`;
    }
  }, [location, Pages, mainPageKey]);

  return null;
}
