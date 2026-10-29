import React from 'react';

export type AdminSection = 'requests' | 'month' | 'history' | 'printers' | 'shifts';

const ITEMS: { id: AdminSection; label: string }[] = [
  { id: 'requests', label: '依頼管理' },
  { id: 'month', label: '月次カレンダー' },
  { id: 'history', label: '印刷履歴' },
  { id: 'printers', label: 'プリンター' },
  { id: 'shifts', label: 'シフト（月次）' },
];

export function AdminSectionNav({
  section,
  onChange,
}: {
  section: AdminSection;
  onChange: (s: AdminSection) => void;
}) {
  return (
    <nav className="admin-section-nav" aria-label="管理メニュー">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={section === item.id ? 'on' : ''}
          onClick={() => onChange(item.id)}
          data-testid={`admin-nav-${item.id}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
