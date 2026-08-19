import { useEffect, useState } from "react";

const TabNav = ({ tabs = [], initialTab, onChange }) => {
  const [active, setActive] = useState(initialTab || tabs[0]?.id);

  useEffect(() => {
    if (initialTab && initialTab !== active) {
      setActive(initialTab);
    }
  }, [initialTab, active]);

  return (
    <div className="flex flex-row justify-evenly items-stretch h-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            w-full border-amber-900 rounded-t-2xl
            font-bold uppercase
            ` + (tab.id === active ?
              "border-x-4 border-t-4" :
              "border-b-4 shadow-[inset_0_-18px_15px_-15px_rgb(0_0_0_/_0.18)]")}
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
