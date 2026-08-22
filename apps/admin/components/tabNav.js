import { useEffect, useState } from "react";

const TabNav = ({ tabs = [], initialTab, onChange }) => {
  const [active, setActive] = useState(initialTab || tabs[0]?.id);

  useEffect(() => {
    if (initialTab && initialTab !== active) {
      setActive(initialTab);
    }
  }, [initialTab, active]);

  return (
    <div className="editor-tabs" role="tablist" aria-label="Product editor sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`editor-tab ${tab.id === active ? "active" : ""}`}
          onClick={() => {
            setActive(tab.id);
            onChange?.(tab.id);
          }}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
        >
          {tab.label}
        </button>
      ))}
      <style jsx>{`
        .editor-tabs {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          border-bottom: 1px solid #d8d2ca;
          scrollbar-width: thin;
        }
        .editor-tab {
          min-height: 44px;
          flex: 0 0 auto;
          border-bottom: 2px solid transparent;
          color: #6b6259;
          font-family: Inter, sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .editor-tab:hover { color: #211a1b; }
        .editor-tab.active {
          border-bottom-color: var(--dl-color-theme-primary1);
          color: #211a1b;
        }
        .editor-tab:focus-visible {
          outline: 2px solid var(--dl-color-theme-primary1);
          outline-offset: -2px;
        }
      `}</style>
    </div>
  );
};

export const useTabNav = (tabs = [], defaultId) => {
  const [activeTab, setActiveTab] = useState(defaultId || tabs[0]?.id);
  return { activeTab, setActiveTab };
};

export default TabNav;
