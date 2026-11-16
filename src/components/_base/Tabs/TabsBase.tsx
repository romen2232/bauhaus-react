"use client";
import type { ReactNode, Ref } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { cn } from "../../../lib/cn.js";

export type TabItem = { id: string; title: ReactNode; content: ReactNode; disabled?: boolean };

export type TabsBaseClasses = { root: string; list: string; tab: string; panel: string };

export type TabsBaseProps = {
  /** Accessible name of the tab list. */
  label: string;
  items: TabItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  className?: string;
  /** The root element. */
  ref?: Ref<HTMLDivElement>;
  /** Style selection with React Aria's `data-[selected]:` attribute in `tab`. */
  classes: TabsBaseClasses;
};

/** Internal: tabs on React Aria (arrow-key navigation, disabled tabs skipped). */
export function TabsBase({
  label,
  items,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  className,
  ref,
  classes,
}: TabsBaseProps) {
  return (
    <Tabs
      ref={ref}
      className={cn(classes.root, className)}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange ? (key) => onSelectionChange(String(key)) : undefined}
      disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
    >
      <TabList aria-label={label} className={classes.list}>
        {items.map((item) => (
          <Tab key={item.id} id={item.id} className={classes.tab}>
            {item.title}
          </Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanel key={item.id} id={item.id} className={classes.panel}>
          {item.content}
        </TabPanel>
      ))}
    </Tabs>
  );
}
