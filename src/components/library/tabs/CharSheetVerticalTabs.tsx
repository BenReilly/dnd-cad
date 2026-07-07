import { ReactNode } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

export interface CharSheetVerticalTabItem {
  label: string;
  content: ReactNode;
}

interface CharSheetVerticalTabsProps {
  tabs: CharSheetVerticalTabItem[];
  value: number;
  onChange: (nextTabIndex: number) => void;
  ariaLabel?: string;
  idPrefix?: string;
  navMinWidth?: number;
  inactiveLabelColor?: string;
  activeLabelColor?: string;
}

const CharSheetVerticalTabs = ({
  tabs,
  value,
  onChange,
  ariaLabel = 'Section navigation',
  idPrefix = 'charsheet-vertical-tabs',
  navMinWidth = 108,
  inactiveLabelColor = '#666',
  activeLabelColor = '#ccc',
}: CharSheetVerticalTabsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0,
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={(_, tabIndex: number) => onChange(tabIndex)}
        aria-label={ariaLabel}
        sx={{
          minWidth: navMinWidth,
          alignSelf: 'stretch',
          position: 'relative',
          '& .MuiTab-root': {
            color: inactiveLabelColor,
            textTransform: 'none',
            alignItems: 'flex-start',
            border: '1px solid transparent',
            borderRight: 'none',
            position: 'relative',
            zIndex: 1,
            '&.Mui-focusVisible, &:focus, &:focus-visible': {
              border: '1px solid #aaa',
              borderRightColor: '#242424',
              outline: 'none',
              boxShadow: 'none',
            },
            '&.Mui-focusVisible': {
              outline: '1px solid #aaa',
              outlineOffset: '-1px',
            },
          },
          '& .MuiTab-root.Mui-selected': {
            color: activeLabelColor,
            borderColor: '#aaa',
            borderRightColor: '#242424',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            zIndex: 3,
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={`${idPrefix}-tab-${index}`}
            label={tab.label}
            id={`${idPrefix}-tab-${index}`}
            aria-controls={`${idPrefix}-panel-${index}`}
          />
        ))}
      </Tabs>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          maxWidth: 'calc(100% - 2px)',
          ml: '-1px',
          position: 'relative',
          zIndex: 0,
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={`${idPrefix}-panel-${index}`}
            role="tabpanel"
            hidden={value !== index}
            id={`${idPrefix}-panel-${index}`}
            aria-labelledby={`${idPrefix}-tab-${index}`}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: value === index ? '1px solid #aaa' : 'none',
              padding: value === index ? '12px' : 0,
            }}
          >
            {tab.content}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default CharSheetVerticalTabs;