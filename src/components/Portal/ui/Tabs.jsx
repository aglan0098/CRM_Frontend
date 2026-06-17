import React, { useState } from "react";

const Tabs = ({
  tabs,
  activeTab: externalActiveTab,
  onTabChange,
  className = "",
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    externalActiveTab || tabs[0]?.id || ""
  );

  const activeTabId = externalActiveTab || internalActiveTab;

  const handleTabClick = (tabId) => {
    if (!externalActiveTab) {
      setInternalActiveTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium ${
              activeTabId === tab.id
                ? "text-green-primary border-b-2 border-green-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Tabs };
