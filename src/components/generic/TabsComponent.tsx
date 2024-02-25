import React, { ReactElement, createContext, useState } from "react";
import { Box, Tab, Tabs, TabsProps } from "@mui/material";

export const TabContext = createContext<number>(0);

interface TabsComponentProps extends Omit<TabsProps, "children"> {
  children: JSX.Element[];
  childClassName: string;
  labels: string[];
  disabledTabs?: number[];
  secondaryEffect?: (tab: string) => void;
}

export const TabsComponent = ({
  children,
  childClassName,
  labels,
  disabledTabs,
  secondaryEffect,
  ...tabsProps
}: TabsComponentProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    setTabIndex(newValue);
    secondaryEffect && secondaryEffect(labels[newValue]);
  };

  const addClass = (children: JSX.Element[]) => {
    const StyledChildren = React.Children.map(children!, child => {
      return (
        <div className={childClassName}>
          {React.cloneElement(child, {
            className: ` ${childClassName}`,
          })}
        </div>
      );
    }).filter((child, idx) => !disabledTabs?.includes(idx));
    return <>{StyledChildren}</>;
  };

  return (
    <TabContext.Provider value={tabIndex}>
      <Box
        sx={theme => ({
          width: "100%",
          flexGrow: 1,
          overflowX: "hidden",
        })}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            {...tabsProps}
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="tabbed-view"
            variant="fullWidth"
          >
            {labels?.map((label, idx) => {
              return typeof label === "string" ? (
                <Tab
                  key={`Tab-${childClassName}-tab-${idx}`}
                  label={label}
                  disabled={disabledTabs && disabledTabs.includes(idx)}
                  sx={theme => ({})}
                />
              ) : (
                label
              );
            })}
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          <Box
            display="flex"
            sx={theme => ({
              minWidth: "100%",
              maxHeight: "calc(100vh - 60px)",

              ["& > ." + childClassName]: {
                minWidth: "100%",
                maxWidth: "100%",
              },
            })}
          >
            {addClass(children)}
          </Box>
        </TabPanel>
      </Box>
    </TabContext.Provider>
  );
};

interface TabPanelProps {
  children?: ReactElement;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`model-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
      style={{
        position: "relative",
        left: -1 * value * 100 + "%",
        transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }}
    >
      {children}
    </div>
  );
}
