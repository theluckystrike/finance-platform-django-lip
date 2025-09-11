import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface GoogleAdsConfigProps {
  publisherId: string; // Your Google AdSense publisher ID (e.g., 'ca-pub-XXXXXXXXXXXXXXXX')
}

const GoogleAdsConfig: React.FC<GoogleAdsConfigProps> = ({ publisherId }) => {
  useEffect(() => {
    // Initialize Google AdSense when component mounts
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const scripts = document.head.querySelectorAll(`script[src*="${publisherId}"]`);
      scripts.forEach(script => script.remove());
    };
  }, [publisherId]);

  return (
    <Helmet>
      <meta name="google-adsense-account" content={publisherId} />
    </Helmet>
  );
};

export default GoogleAdsConfig;

// Usage Instructions:
// 1. Sign up for Google AdSense at https://www.google.com/adsense/
// 2. Get your publisher ID (starts with 'ca-pub-')
// 3. Create ad units in your AdSense dashboard
// 4. Add this component to your App.tsx or index.tsx:
//    <GoogleAdsConfig publisherId="ca-pub-XXXXXXXXXXXXXXXX" />
// 5. Use GoogleAdsense component wherever you want to display ads:
//    <GoogleAdsense 
//      client="ca-pub-XXXXXXXXXXXXXXXX"
//      slot="1234567890"
//      format="auto"
//      responsive={true}
//    />
// 6. Make sure your domain is approved in AdSense
// 7. Ads will only show on approved domains with real traffic
