//=====================================
// Updated UserAvatar.jsx (Component 32)
import React from 'react';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const UserAvatar = () => {
  const { t, isRTL, language } = useTranslation(); // Get language from translation context
  const { userInfo, loading, error } = CasesComponent({ language });
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '8px 0',
        marginLeft: isRTL ? '0' : '-30px',
        marginRight: isRTL ? '-30px' : '0',
      }}
    >
      <div className="avatar">
        {loading ? '...' : (userInfo.initials || 'SK')}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'flex-start',
        }}
      >
        <p
          style={{
            color: '#161616',
            fontFamily: 'var(--Font-Family-font-family-text, "IBM Plex Sans Arabic")',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '24px',
            margin: '0',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? t('loading') || 'Loading...' : (userInfo.firstName || t('user') || 'User')}
        </p>
        <div
          style={{
            display: 'flex',
            height: '20px',
            padding: 'var(--Global-spacing-none, 0) var(--Global-spacing-md, 8px)',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--Global-spacing-xs, 4px)',
            flexShrink: '0',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--Border-border-neutral-secondary, #e5e7eb)',
            background: 'var(--Tag-tag-background-neutral-light, #f9fafb)',
          }}
        >
          <p
            style={{
              color: '#161616',
              fontFamily: 'var(--Font-Family-font-family-text, "IBM Plex Sans Arabic")',
              fontSize: '10px',
              fontWeight: '600',
              lineHeight: '14px',
              margin: '0',
            }}
          >
            {t('individual')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;