import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';
import api from '../../utils/api';
import {
  FileDown,
  FileText,
  BookOpen,
  File,
  Loader2,
  CheckCircle,
  Settings,
  Eye,
  Sparkles,
} from 'lucide-react';
import {
  EXPORT_TEMPLATES,
  DEFAULT_EXPORT_SETTINGS,
  applyTemplateSettings,
  FONT_SIZES,
  FONT_FAMILIES,
  LINE_SPACINGS,
  MARGINS,
  type ExportSettings,
} from '../../config/exportSettings';

interface EnhancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

type ExportFormat = 'pdf' | 'epub' | 'docx';

interface ExportOption {
  format: ExportFormat;
  name: string;
  description: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
}

export const EnhancedExportModal = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: EnhancedExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const { success, error: showError } = useToast();

  const exportOptions: ExportOption[] = [
    {
      format: 'pdf',
      name: 'PDF',
      description: 'Perfect for reading and printing',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'from-red-500/20 to-orange-500/20',
    },
    {
      format: 'epub',
      name: 'ePub',
      description: 'Ideal for e-readers',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'from-purple-500/20 to-pink-500/20',
    },
    {
      format: 'docx',
      name: 'DOCX',
      description: 'Editable Word document',
      icon: File,
      color: 'text-blue-600',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
    },
  ];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const newSettings = applyTemplateSettings(templateId);
    setExportSettings({ ...exportSettings, ...newSettings });
  };

  const handleExport = async () => {
    if (!projectId) {
      showError('No Project', 'Please save your project before exporting');
      return;
    }

    try {
      setIsExporting(true);

      const response = await api.post(
        `/export/${selectedFormat}`,
        {
          projectId,
          template: selectedTemplate,
          settings: exportSettings,
        },
        {
          responseType: 'blob',
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${selectedFormat}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      success('Export Complete!', `Your ${selectedFormat.toUpperCase()} file has been downloaded`);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 501) {
        showError('Coming Soon', `${selectedFormat.toUpperCase()} export is being implemented`);
      } else {
        showError('Export Failed', 'Failed to export your project');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const availableTemplates = EXPORT_TEMPLATES.filter((t) =>
    t.formats.includes(selectedFormat)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Project" size="lg">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
            <FileDown size={16} />
            Select Format
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormat === option.format;

              return (
                <button
                  key={option.format}
                  onClick={() => setSelectedFormat(option.format)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 glass-strong glow-sm scale-105'
                      : 'border-primary/20 glass hover:border-purple-500 hover:scale-102'
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${option.bgColor} opacity-40 -z-10`}
                  />
                  <div className="text-center">
                    <Icon className={`w-8 h-8 ${option.color} mx-auto mb-2`} />
                    <h4 className="font-semibold text-primary">{option.name}</h4>
                    <p className="text-xs text-muted mt-1">{option.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            Choose Template
          </h3>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {availableTemplates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 glass-strong'
                      : 'border-primary/20 glass hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-primary">{template.name}</h4>
                      <p className="text-xs text-muted mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="border-t border-primary/20 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-purple-500 transition-colors"
          >
            <Settings size={16} />
            {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {showAdvancedSettings && (
            <div className="mt-4 p-4 glass-strong rounded-lg space-y-4">
              {/* Document Options */}
              <div>
                <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  Document Options
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'includeCoverPage', label: 'Cover Page' },
                    { key: 'includeTableOfContents', label: 'Table of Contents' },
                    { key: 'includePageNumbers', label: 'Page Numbers' },
                    { key: 'includeAuthorInfo', label: 'Author Info' },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="flex items-center gap-2 p-2 rounded glass hover:glass-strong cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={exportSettings[option.key as keyof ExportSettings] as boolean}
                        onChange={(e) =>
                          setExportSettings({
                            ...exportSettings,
                            [option.key]: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-xs text-secondary">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Styling Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary mb-1">Font Size</label>
                  <select
                    value={exportSettings.fontSize}
                    onChange={(e) =>
                      setExportSettings({
                        ...exportSettings,
                        fontSize: e.target.value as any,
                      })
                    }
                    className="input text-xs py-1"
                  >
                    {Object.entries(FONT_SIZES).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">Line Spacing</label>
                  <select
                    value={exportSettings.lineSpacing}
                    onChange={(e) =>
                      setExportSettings({
                        ...exportSettings,
                        lineSpacing: e.target.value as any,
                      })
                    }
                    className="input text-xs py-1"
                  >
                    {Object.entries(LINE_SPACINGS).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format Specific */}
              {selectedFormat === 'pdf' && (
                <div>
                  <label className="block text-xs font-medium text-primary mb-1">PDF Quality</label>
                  <select
                    value={exportSettings.pdfQuality}
                    onChange={(e) =>
                      setExportSettings({
                        ...exportSettings,
                        pdfQuality: e.target.value as any,
                      })
                    }
                    className="input text-xs py-1"
                  >
                    <option value="standard">Standard (Smaller file)</option>
                    <option value="high">High Quality</option>
                    <option value="print">Print Quality (Largest file)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Summary */}
        <div className="glass rounded-lg p-4 border border-primary/20">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Eye size={14} />
            Export Summary
          </h4>
          <div className="space-y-1 text-xs text-secondary">
            <p>
              Project: <span className="font-medium text-primary">{projectTitle || 'Untitled'}</span>
            </p>
            <p>
              Format: <span className="font-medium text-primary">{selectedFormat.toUpperCase()}</span>
            </p>
            <p>
              Template:{' '}
              <span className="font-medium text-primary">
                {EXPORT_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} isLoading={isExporting} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown size={18} className="mr-2" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
