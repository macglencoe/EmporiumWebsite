import { useEffect, useState } from "react";

const TabNav = ({ tabs = [], initialTab, onChange }) => {
  const [active, setActive] = useState(initialTab || tabs[0]?.id);

  useEffect(() => {
    if (initialTab && initialTab !== active) {
      setActive(initialTab);
    }
  }, [initialTab, active]);

  return (
    <div className="tabnav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === active ? "active" : ""}
          onClick={() => {
            setActive(tab.id);
            onChange?.(tab.id);
          }}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const useTabNav = (tabs = [], defaultId) => {
  const [activeTab, setActiveTab] = useState(defaultId || tabs[0]?.id);
  return { activeTab, setActiveTab };
};

export default TabNav;
