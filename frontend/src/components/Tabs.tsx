import React, { useState, useEffect } from 'react';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  tabsContainerClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  tabsContainerClassName = '',
  contentClassName = '',
  orientation = 'horizontal'
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : '')
  );

  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const isVertical = orientation === 'vertical';

  // Default styles
  const defaultTabsContainerClass = isVertical
    ? 'flex-col border-r border-gray-200'
    : 'flex-row border-b border-gray-200';

  const defaultTabClass = isVertical
    ? 'border-r-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    : 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700';

  const defaultActiveTabClass = isVertical
    ? 'border-r-2 border-primary-500 bg-primary-50 text-primary-600 px-4 py-2 text-sm font-medium'
    : 'border-b-2 border-primary-500 text-primary-600 px-4 py-2 text-sm font-medium';

  return (
    <div className={`${isVertical ? 'flex' : 'block'} ${className}`}>
      <div className={`flex ${defaultTabsContainerClass} ${tabsContainerClassName}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={`
              ${tab.id === activeTab ? `${defaultActiveTabClass} ${activeTabClassName}` : `${defaultTabClass} ${tabClassName}`}
              ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
            disabled={tab.disabled}
            role="tab"
            aria-selected={tab.id === activeTab}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`mt-2 ${isVertical ? 'flex-1 pl-4' : ''} ${contentClassName}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            id={`tabpanel-${tab.id}`}
            className={tab.id === activeTab ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;