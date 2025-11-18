import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/Toast';
import api from '../../utils/api';
import { FileDown, FileText, BookOpen, File, Loader2, CheckCircle } from 'lucide-react';

interface ExportModalProps {
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

export const ExportModal = ({ isOpen, onClose, projectId, projectTitle }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { success, error: showError } = useToast();

  const exportOptions: ExportOption[] = [
    {
      format: 'pdf',
      name: 'PDF',
      description: 'Perfect for reading and printing',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      format: 'epub',
      name: 'ePub',
      description: 'Ideal for e-readers',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      format: 'docx',
      name: 'DOCX',
      description: 'Editable Word document',
      icon: File,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  const handleExport = async () => {
    if (!projectId) {
      showError('No Project', 'Please save your project before exporting');
      return;
    }

    try {
      setIsExporting(true);

      const response = await api.post(`/export/${selectedFormat}`, {
        projectId,
      }, {
        responseType: 'blob', // Important for file downloads
      });

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Project"
      size="md"
    >
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Select Format</h3>
          <div className="grid gap-3">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormat === option.format;

              return (
                <Card
                  key={option.format}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'ring-2 ring-primary-500 border-primary-500'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFormat(option.format)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Export Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Export Details</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Project: <span className="font-medium text-gray-900">{projectTitle || 'Untitled'}</span></p>
            <p>Format: <span className="font-medium text-gray-900">{selectedFormat.toUpperCase()}</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting}
          >
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
