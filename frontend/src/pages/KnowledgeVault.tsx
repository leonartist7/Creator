import React, { useEffect, useState } from 'react';
import { MasterworkUpload } from '../components/MasterworkUpload/MasterworkUpload';
import { MasterworkCard } from '../components/KnowledgeVault/MasterworkCard';
import { StyleDNAView } from '../components/KnowledgeVault/StyleDNAView';
import { Masterwork } from '../types/masterwork';
import { Search, Filter, Plus } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const KnowledgeVault: React.FC = () => {
  const [masterworks, setMasterworks] = useState<Masterwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Masterwork | null>(null);
  const [showUpload, setShowUpload] = useState(false);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Knowledge Vault
            </h1>
            <p className="text-gray-400 text-lg font-light">
              Your library of masterworks and their creative DNA.
            </p>
          </div>

          <button
            onClick={() => setShowUpload(!showUpload)}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all active:scale-95"
          >
            <Plus size={20} className={`transition-transform duration-300 ${showUpload ? 'rotate-45' : ''}`} />
            {showUpload ? 'Close Upload' : 'Add Masterwork'}
          </button>
        </div>

        {/* Upload Section (Collapsible) */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showUpload ? 'max-h-[500px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <MasterworkUpload onUploadComplete={() => {
              fetchMasterworks();
              setShowUpload(false);
            }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <Filter size={18} />
          </button>
        </div>

        {/* Library Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : masterworks.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Library is empty</h3>
            <p className="text-gray-500">Upload your first masterwork to begin analysis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterworks.map((work) => (
              <MasterworkCard
                key={work.id}
                work={work}
                onClick={setSelectedWork}
              />
            ))}
          </div>
        )}
      </div>

      {/* Style DNA Drawer */}
      <StyleDNAView
        work={selectedWork}
        isOpen={!!selectedWork}
        onClose={() => setSelectedWork(null)}
      />
    </div>
  );
};

export default KnowledgeVault;
