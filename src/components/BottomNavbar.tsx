import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
  lowStockCount?: number;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenMobileMenu,
  lowStockCount = 0,
}) => {
  const primaryTabs: { id: NavigationTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'produk', label: 'Produk', icon: 'inventory_2' },
    {
      id: 'stok',
      label: 'Stok',
      icon: 'inventory',
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    { id: 'transaksi', label: 'Transaksi', icon: 'swap_horiz' },
  ];

  return (
    <nav
      id="bottom-mobile-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#c4c5d5]/50 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-2px_12px_rgba(0,40,142,0.06)] touch-manipulation"
      aria-label="Navigasi Utama Ponsel"
    >
      {primaryTabs.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
              isActive
                ? 'text-[#00288e]'
                : 'text-[#757684] hover:text-[#1a1b22] active:scale-95'
            }`}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'fill scale-110' : ''
                }`}
              >
                {item.icon}
              </span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#ba1a1a] text-white min-w-[16px] text-center shadow-xs">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 leading-tight ${
                isActive ? 'font-bold text-[#00288e]' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
            {isActive && (
              <span className="w-4 h-0.5 rounded-full bg-[#00288e] mt-0.5" />
            )}
          </button>
        );
      })}

      {/* Menu Drawer Button for secondary items: Supplier, Laporan, Pengaturan */}
      <button
        id="bottom-nav-more-menu"
        onClick={onOpenMobileMenu}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
          activeTab === 'supplier' || activeTab === 'laporan' || activeTab === 'setting' || activeTab === 'pengaturan'
            ? 'text-[#00288e]'
            : 'text-[#757684] hover:text-[#1a1b22] active:scale-95'
        }`}
        title="Buka Menu Lainnya"
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            activeTab === 'supplier' || activeTab === 'laporan' || activeTab === 'setting' || activeTab === 'pengaturan'
              ? 'fill scale-110'
              : ''
          }`}
        >
          menu
        </span>
        <span
          className={`text-[10px] tracking-tight mt-0.5 leading-tight ${
            activeTab === 'supplier' || activeTab === 'laporan' || activeTab === 'setting' || activeTab === 'pengaturan'
              ? 'font-bold text-[#00288e]'
              : 'font-medium'
          }`}
        >
          Menu
        </span>
        {(activeTab === 'supplier' || activeTab === 'laporan' || activeTab === 'setting' || activeTab === 'pengaturan') && (
          <span className="w-4 h-0.5 rounded-full bg-[#00288e] mt-0.5" />
        )}
      </button>
    </nav>
  );
};
