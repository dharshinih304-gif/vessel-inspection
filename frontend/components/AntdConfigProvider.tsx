'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { useAccessibility } from './AccessibilityProvider';

export function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAccessibility();

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 12,
            fontFamily: 'var(--font-inter), var(--font-sans)',
            colorBgBase: darkMode ? '#020617' : '#ffffff',
            colorBgContainer: darkMode ? '#0f172a' : '#ffffff',
            colorBorder: darkMode ? '#1e293b' : '#e2e8f0',
          },
          components: {
            Card: {
              borderRadiusLG: 24,
            },
            Table: {
              borderRadius: 16,
              headerBg: darkMode ? '#1e293b' : '#f8fafc',
            }
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
