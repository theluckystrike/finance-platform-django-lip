import React from 'react';

interface MockAdData {
  title: string;
  description: string;
  url: string;
  icon?: string;
}

// Collection of realistic financial service ads
export const mockAds: MockAdData[] = [
  {
    title: "Bloomberg Terminal - Free Trial",
    description: "Access real-time market data and analytics. Professional traders' choice.",
    url: "www.bloomberg.com/professional",
    icon: "📊"
  },
  {
    title: "E*TRADE - $0 Commission Trading",
    description: "Trade stocks, ETFs, and options with powerful tools and no fees.",
    url: "www.etrade.com",
    icon: "💹"
  },
  {
    title: "Morningstar Direct - Portfolio Analytics",
    description: "Institutional-grade research and portfolio analysis tools.",
    url: "www.morningstar.com/direct",
    icon: "⭐"
  },
  {
    title: "Interactive Brokers - Pro Trading",
    description: "Lowest margin rates. Trade globally in 150+ markets.",
    url: "www.interactivebrokers.com",
    icon: "🌍"
  },
  {
    title: "FactSet - Financial Data Platform",
    description: "Comprehensive financial data and analytics for professionals.",
    url: "www.factset.com",
    icon: "📈"
  },
  {
    title: "Charles Schwab - Wealth Management",
    description: "Expert guidance and sophisticated investment solutions.",
    url: "www.schwab.com",
    icon: "💼"
  },
  {
    title: "Refinitiv Eikon - Market Intelligence",
    description: "Financial markets data, news, and insights platform.",
    url: "www.refinitiv.com/eikon",
    icon: "🔍"
  },
  {
    title: "TD Ameritrade - thinkorswim Platform",
    description: "Advanced trading platform with professional-grade tools.",
    url: "www.tdameritrade.com",
    icon: "🖥️"
  }
];

export const getRandomAd = (): MockAdData => {
  return mockAds[Math.floor(Math.random() * mockAds.length)];
};

export const SidebarAd: React.FC = () => {
  const ad = getRandomAd();
  
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        fontSize: '11px',
        color: '#6c757d',
        backgroundColor: '#fff',
        padding: '2px 6px',
        borderRadius: '2px',
        border: '1px solid #dee2e6'
      }}>
        Ad
      </div>
      
      <div style={{ marginTop: '8px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0066cc',
          marginBottom: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px', fontSize: '20px' }}>{ad.icon}</span>
          {ad.title}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#545454',
          marginBottom: '6px',
          lineHeight: '1.4'
        }}>
          {ad.description}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#006621'
        }}>
          {ad.url}
        </div>
      </div>
    </div>
  );
};

export const InFeedAd: React.FC = () => {
  const ad = getRandomAd();
  
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      position: 'relative',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        fontSize: '11px',
        color: '#6c757d',
        backgroundColor: '#f8f9fa',
        padding: '2px 6px',
        borderRadius: '2px',
        border: '1px solid #dee2e6'
      }}>
        Sponsored
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginTop: '12px'
      }}>
        <div style={{
          fontSize: '32px',
          marginRight: '16px'
        }}>
          {ad.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0066cc',
            marginBottom: '4px',
            cursor: 'pointer'
          }}>
            {ad.title}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#545454',
            marginBottom: '4px'
          }}>
            {ad.description}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#006621'
          }}>
            {ad.url}
          </div>
        </div>
      </div>
    </div>
  );
};
