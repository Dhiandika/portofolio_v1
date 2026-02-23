import React, { useState } from 'react';

interface Asset {
    title: string;
    type: 'Document' | 'Archive' | 'Image' | 'Other';
    file: string;
    description?: string;
    fileSize?: string;
}

interface FileManagerProps {
    assets: Asset[];
}

const FileManager: React.FC<FileManagerProps> = ({ assets }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || asset.type.toUpperCase() === filterType;
        return matchesSearch && matchesType;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'Document': return 'ri-file-text-line';
            case 'Archive': return 'ri-file-zip-line';
            case 'Image': return 'ri-image-line';
            default: return 'ri-file-line';
        }
    };

    return (
        <div className="border-4 border-black bg-white shadow-hard font-mono">
            {/* Toolbar */}
            <div className="bg-neo-black text-white p-2 flex flex-col md:flex-row gap-4 items-center justify-between border-b-4 border-black">
                <div className="flex items-center gap-2">
                    <i className="ri-hard-drive-2-line text-neo-green animate-pulse"></i>
                    <span className="font-bold">ASSET_MANAGER_V1.0</span>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="SEARCH_FILES..."
                        className="bg-black border border-gray-600 text-white px-2 py-1 text-sm w-full md:w-48 focus:outline-none focus:border-neo-green"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="bg-black border border-gray-600 text-white px-2 py-1 text-sm focus:outline-none focus:border-neo-green uppercase"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">ALL TYPES</option>
                        <option value="DOCUMENT">DOCS</option>
                        <option value="ARCHIVE">ARCHIVES</option>
                        <option value="IMAGE">IMAGES</option>
                    </select>
                </div>
            </div>

            {/* File List */}
            <div className="p-4 min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 border-b-4 border-black text-xs uppercase">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Size</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.length > 0 ? (
                                filteredAssets.map((asset, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-neo-yellow/20 transition-colors group">
                                        <td className="p-3 font-bold flex items-center gap-3">
                                            <i className={`${getIcon(asset.type)} text-xl text-gray-500 group-hover:text-black`}></i>
                                            <div>
                                                <div className="group-hover:text-neo-blue transition-colors">{asset.title}</div>
                                                {asset.description && <div className="text-xs text-gray-400 font-normal">{asset.description}</div>}
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-500 uppercase">{asset.type}</td>
                                        <td className="p-3 text-gray-500">{asset.fileSize || 'N/A'}</td>
                                        <td className="p-3 text-right">
                                            <a
                                                href={asset.file}
                                                download
                                                className="inline-block bg-black text-white hover:bg-neo-green hover:text-black px-3 py-1 font-bold text-xs uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none translate-x-0 hover:translate-x-[2px] hover:translate-y-[2px]"
                                            >
                                                DOWNLOAD
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                        NO_FILES_FOUND
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-gray-100 border-t-4 border-black p-2 text-xs flex justify-between items-center text-gray-500">
                <span>TOTAL_FILES: {assets.length}</span>
                <span>STATUS: READY</span>
            </div>
        </div>
    );
};

export default FileManager;
