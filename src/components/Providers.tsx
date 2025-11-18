'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TemplateProvider } from '@/contexts/TemplateContext';
import { ProjectProvider } from '@/contexts/ProjectContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TemplateProvider>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </TemplateProvider>
    </ThemeProvider>
  );
}
