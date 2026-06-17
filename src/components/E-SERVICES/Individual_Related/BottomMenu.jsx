//=====================================
// Updated BottomMenu.jsx (Component 3)
import React from 'react';
import MenuItem from './MenuItem';
import menu6 from './menu6.png';
import menu7 from './menu7.png';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const BottomMenu = ({ activeMenuItem, onMenuClick }) => {
  const { t, language } = useTranslation();
  const { logout } = CasesComponent({ language });
  
  return (
    <div className="bottomsidemenu">
      <MenuItem
      src={menu6}
      alt="Account"
      text={t('account')}
      isActive={activeMenuItem === 'account'}
      onClick={() => onMenuClick('account')}
      isBottom={true}
      />

      <MenuItem
      src={menu7}
      alt="LogOut"
      text={t('logout')}
      isActive={activeMenuItem === 'logout'}
      onClick={() => {
        logout(); // Use the logout function from API component
        if (onMenuClick) onMenuClick('logout'); // Optional: still call the parent handler if needed
      }}
      isBottom={true}
      />
    </div>
  );
};

export default BottomMenu;