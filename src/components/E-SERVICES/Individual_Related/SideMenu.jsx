//=====================================
// Updated SideMenu.jsx (Component 27)
import React from 'react';
import MenuItem from './MenuItem';
import menu1 from './menu1.png';
import menu2 from './menu2.png';
import menu3 from './menu3.png';
import { useTranslation } from './TranslationContext';

const SideMenu = ({ activeMenuItem, onMenuClick }) => {
  const { t } = useTranslation();
  
  return (
    <div className="sidemenu" style={{ marginTop: '-10px' }}>
      <div className="hr1">
        <hr className="line" />
      </div>

      <MenuItem
        src={menu1}
        alt="DashBoard"
        text={t('dashboard')}
        isActive={activeMenuItem === 'dashboard'}
        onClick={() => onMenuClick('dashboard')}
      />
      <div className="hr1">
        <hr className="line" />
      </div>

      <MenuItem
        src={menu2}
        alt="Services"
        text={t('services')}
        isActive={activeMenuItem === 'services'}
        onClick={() => onMenuClick('services')}
      />
      <div className="hr1">
        <hr className="line" />
      </div>

      <MenuItem
        src={menu3}
        alt="My Requests"
        text={t('myRequests')}
        isActive={activeMenuItem === 'requests'}
        onClick={() => onMenuClick('requests')}
      />
    </div>
  );
};

export default SideMenu;