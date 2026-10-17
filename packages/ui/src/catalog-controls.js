import { useState } from 'react';

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>;
}

function CaretIcon({ open }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className={open ? 'open' : ''}>
    <path d="m6 9 6 6 6-6" fill="currentColor" />
    <style jsx>{`svg { transition: transform .2s ease; } svg.open { transform: rotate(180deg); }`}</style>
  </svg>;
}

export function CatalogControls({
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  sortValue,
  sortOptions = [],
  onSortChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  activeFilters = [],
  onClearFilter,
  resultCount,
  idPrefix = 'catalog-controls',
}) {
  const [open, setOpen] = useState(false);
  const panelId = idPrefix;

  return <section className="controls" aria-label="Catalog search and filters">
    <form className="search" onSubmit={(event) => { event.preventDefault(); onSearchSubmit?.(); }}>
      <label className="sr-only" htmlFor={`${panelId}-search`}>Search catalog</label>
      <input
        id={`${panelId}-search`}
        type="search"
        value={searchValue}
        onChange={(event) => onSearchValueChange?.(event.target.value)}
        placeholder="Search..."
      />
      <button aria-label="Search catalog" type="submit"><SearchIcon /></button>
    </form>

    <div className="filter-shell">
      <button
        type="button"
        className="filter-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Filter &amp; Sort</span>
        <CaretIcon open={open} />
      </button>

      {open && <div className="filter-panel" id={panelId}>
        <div className="sort-row">
          <label htmlFor={`${panelId}-sort`}>Sort by</label>
          <select id={`${panelId}-sort`} value={sortValue} onChange={(event) => onSortChange?.(event.target.value)}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div className="filter-grid">
          {filters.map((filter) => <div className="filter" key={filter.name}>
            <label htmlFor={`${panelId}-${filter.name}`}>{filter.label}</label>
            <select
              id={`${panelId}-${filter.name}`}
              value={filterValues[filter.name] ?? ''}
              onChange={(event) => onFilterChange?.(filter.name, event.target.value)}
            >
              <option value="">{filter.defaultValue}</option>
              {filter.values.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>)}
        </div>
      </div>}

      {activeFilters.length > 0 && <div className="active-filters" aria-label="Active catalog filters">
        {activeFilters.map(({ name, value }) => <div className="chip" key={name}>
          <span><strong>{name}</strong>{value}</span>
          <button type="button" onClick={() => onClearFilter?.(name)} aria-label={`Clear ${name} filter`}>×</button>
        </div>)}
        {Number.isFinite(resultCount) && <span className="results">Returned <strong>{resultCount}</strong> results</span>}
      </div>}
    </div>

    <style jsx>{`
      .controls { width: 100%; max-width: 48rem; margin: 2.5rem auto 1.25rem; padding: 0 .75rem; font-family: Inter, sans-serif; }
      .search, .filter-shell { background: var(--dl-color-theme-primary2); border: 6px double color-mix(in srgb, var(--dl-color-theme-primary1) 55%, transparent); }
      .search { display: flex; align-items: stretch; margin-bottom: 1rem; }
      .search input { flex: 1; min-width: 0; padding: .8rem; color: var(--dl-color-theme-secondary1); background: transparent; border: 0; outline-offset: -3px; }
      .search button { display: grid; place-items: center; padding: 0 .8rem; color: var(--dl-color-theme-secondary1); cursor: pointer; }
      .filter-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: .8rem; color: var(--dl-color-theme-secondary1); cursor: pointer; }
      .filter-panel { padding: .75rem; border-top: 1px solid var(--dl-color-theme-secondary1); }
      .sort-row { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
      .sort-row label, .filter label { font-size: .7rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
      select { color: var(--dl-color-theme-secondary1); background: color-mix(in srgb, var(--dl-color-theme-primary1) 35%, transparent); border: 1px solid color-mix(in srgb, var(--dl-color-theme-secondary1) 25%, transparent); }
      .sort-row select { min-width: 10rem; padding: .45rem .6rem; }
      .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: .5rem; }
      .filter { position: relative; padding-top: .35rem; background: color-mix(in srgb, var(--dl-color-theme-primary1) 30%, transparent); }
      .filter label { position: absolute; top: .35rem; left: .55rem; pointer-events: none; }
      .filter select { width: 100%; height: 3.2rem; padding: 1rem .55rem .2rem; border: 0; background: transparent; }
      .active-filters { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; padding: .65rem; border-top: 1px solid color-mix(in srgb, var(--dl-color-theme-secondary1) 18%, transparent); }
      .chip { display: flex; align-items: stretch; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dl-color-theme-primary1) 55%, transparent); border-radius: 999px; background: color-mix(in srgb, var(--dl-color-theme-primary1) 22%, transparent); }
      .chip span { display: flex; flex-direction: column; padding: .3rem .65rem; }
      .chip strong { font-size: .6rem; line-height: 1; text-transform: uppercase; }
      .chip button { padding: 0 .65rem; color: var(--negative, #8b1e1e); font-size: 1.4rem; cursor: pointer; }
      .results { margin-left: auto; font-size: .85rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
      @media (max-width: 680px) {
        .controls { margin-top: 1.25rem; padding: 0 .35rem; }
        .filter-grid { grid-template-columns: 1fr; }
        .sort-row { align-items: stretch; flex-direction: column; gap: .3rem; }
        .results { width: 100%; margin-left: 0; }
      }
    `}</style>
  </section>;
}
