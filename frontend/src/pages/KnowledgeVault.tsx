import React, { useEffect, useState } from 'react';
import { MasterworkUpload } from '../components/MasterworkUpload/MasterworkUpload';
import { Book, FileText, Clock, Search, Filter, MoreVertical, Trash2, Edit } from 'lucide-react';

interface Masterwork {
  id: string;
  title: string;
  author: string | null;
  format: string;
  upload_date: string;
  extraction_status: string;
  analysis_status: string;
}

const KnowledgeVault: React.FC = () => {
  const [masterworks, setMasterworks] = useState<Masterwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterworks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/masterworks');
      if (response.ok) {
        const data = await response.json();
        setMasterworks(data);
      }
    } catch (error) {
      console.error('Failed to fetch masterworks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterworks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Knowledge Vault
            </h1>
            <p className="text-gray-400 mt-2">
              Upload and analyze masterworks to extract their creative DNA.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UploadIcon className="w-5 h-5 text-indigo-400" />
            Add New Masterwork
          </h2>
          <MasterworkUpload onUploadComplete={fetchMasterworks} />
        </div>

        {/* Library Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-400" />
              Library ({masterworks.length})
            </h2>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search library..."
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading library...</div>
          ) : masterworks.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50 border-dashed">
              <Book className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No masterworks yet</p>
              <p className="text-sm text-gray-500">Upload your first book or document to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterworks.map((work) => (
                <div key={work.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white line-clamp-1" title={work.title}>
                          {work.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {work.author || 'Unknown Author'} • {work.format}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${work.extraction_status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        work.extraction_status === 'processing' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-gray-700 text-gray-400'
                      }`}>
                      {work.extraction_status === 'completed' ? 'Ready' : work.extraction_status}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {new Date(work.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default KnowledgeVault;
