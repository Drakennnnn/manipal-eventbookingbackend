// app/layout.tsx
"use client";

import { Layout } from 'antd';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          {children}
        </Layout>
      </body>
    </html>
  );
}
