import React from 'react';

export type DndPickTileProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  badge?: string;
  accent?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

/** Card-style pick control (grab affordance; click to select). */
export function DndPickTile({
  selected,
  onSelect,
  title,
  description,
  badge,
  accent,
  disabled,
  'aria-label': ariaLabel,
}: DndPickTileProps) {
  return (
    <button
      type="button"
      className={'dnd-pick' + (selected ? ' on' : '') + (disabled ? ' disabled' : '')}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel ?? title}
      style={selected && accent ? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}` } : undefined}
    >
      <span className="dnd-pick-grip" aria-hidden="true">
        ⠿
      </span>
      <span className="dnd-pick-body">
        {badge ? (
          <span className="dnd-pick-badge" style={accent ? { background: accent + '22', color: accent } : undefined}>
            {badge}
          </span>
        ) : null}
        <b>{title}</b>
        {description ? <span>{description}</span> : null}
      </span>
      <span className="dnd-pick-check" aria-hidden="true">
        {selected ? '✓' : ''}
      </span>
    </button>
  );
}

export function DndPickGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: 1 | 2 | 3 }) {
  return <div className={'dnd-pick-grid cols-' + columns}>{children}</div>;
}
