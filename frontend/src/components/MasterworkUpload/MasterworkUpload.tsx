import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface UploadProps {
  onUploadComplete: () => void;
}

export const MasterworkUpload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    // TODO: Add title/author inputs if needed

    try {
      const response = await fetch('http://localhost:3001/api/masterworks/upload', {
        method: 'POST',
        // Headers are automatically set by browser for FormData
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setSuccess(`Successfully uploaded ${file.name}`);
      onUploadComplete();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/epub+zip': ['.epub'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt', '.md']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-indigo-500 bg-indigo-50/10'
            : 'border-gray-700 hover:border-indigo-400 hover:bg-gray-800/50'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4">
          {uploading ? (
            <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
          ) : (
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-200">
              {isDragActive ? 'Drop masterwork here' : 'Upload Masterwork'}
            </h3>
            <p className="text-sm text-gray-400">
              Drag & drop or click to select
            </p>
            <p className="text-xs text-gray-500">
              PDF, EPUB, DOCX, TXT, MD (Max 50MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">{success}</span>
        </div>
      )}
    </div>
  );
};
