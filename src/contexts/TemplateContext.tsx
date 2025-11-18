'use client';

import React, { createContext, useContext, useState } from 'react';
import { TemplateType, TemplateConfig } from '@/types';
import { templateConfigs } from '@/config/templates';

interface TemplateContextType {
  selectedTemplate: TemplateType | null;
  setSelectedTemplate: (template: TemplateType | null) => void;
  getTemplateConfig: (template: TemplateType) => TemplateConfig;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);

  const getTemplateConfig = (template: TemplateType): TemplateConfig => {
    return templateConfigs[template];
  };

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        getTemplateConfig,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within TemplateProvider');
  }
  return context;
}
