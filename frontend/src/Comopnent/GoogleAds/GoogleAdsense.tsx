import React, { useEffect, useMemo } from 'react';
import { mockAds } from './MockAds';

interface GoogleAdsenseProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  mockAd?: boolean; // Add mock ad flag for demo
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = '',
  mockAd = true // Default to showing mock ads for demo
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !mockAd) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading Google AdSense:', error);
    }
  }, [mockAd]);

  // Get a random ad for variety
  const randomAd = useMemo(() => {
    return mockAds[Math.floor(Math.random() * mockAds.length)];
  }, []);

  // Show mock ad for demonstration
  if (mockAd) {
    return (
      <div 
        className={`mock-google-ad ${className}`}
        style={{
          ...style,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          minHeight: style?.minHeight || '90px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}
      >
        {/* Ad label */}
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          fontSize: '11px',
          color: '#6c757d',
          backgroundColor: '#fff',
          padding: '2px 6px',
          borderRadius: '2px',
          border: '1px solid #dee2e6'
        }}>
          Ad
        </div>
        
        {/* Mock Ad Content */}
        <div style={{ width: '100%' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0066cc',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ marginRight: '8px', fontSize: '24px' }}>{randomAd.icon}</span>
            {randomAd.title}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#545454',
            marginBottom: '4px'
          }}>
            {randomAd.description}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#006621'
          }}>
            {randomAd.url}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default GoogleAdsense;
