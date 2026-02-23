import React, { useState } from 'react';

interface HardwareItem {
    name: string;
    detail: string;
    category: string;
}

interface SoftwareItem {
    name: string;
    detail: string;
    category: string;
}

interface SystemSpecsProps {
    hardware?: HardwareItem[];
    software?: SoftwareItem[];
    wallpaper?: string;
}

const SystemSpecs: React.FC<SystemSpecsProps> = ({ hardware = [], software = [], wallpaper }) => {
    const [activeTab, setActiveTab] = useState<'HARDWARE' | 'SOFTWARE' | 'SETUP'>('HARDWARE');

    return (
        <div className="border-4 border-black bg-white shadow-hard font-mono min-h-[600px] flex flex-col">
            {/* Header / Tab Bar */}
            <div className="bg-black text-white p-2 border-b-4 border-black flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                    <i className="ri-cpu-line text-neo-pink animate-pulse"></i>
                    <span className="font-bold">SYSTEM_SPECS_V2.0</span>
                </div>
                <div className="flex gap-2">
                    {['HARDWARE', 'SOFTWARE', 'SETUP'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1 text-sm font-bold uppercase transition-all ${activeTab === tab
                                    ? 'bg-neo-pink text-black'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-100 p-4 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {activeTab === 'HARDWARE' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {hardware.length > 0 ? (
                            hardware.map((item, index) => (
                                <div key={index} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-black text-white text-xs px-2 py-1 font-bold">{item.category}</span>
                                        <i className="ri-settings-3-line text-gray-400"></i>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight uppercase mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-600 font-mono">{item.detail}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-gray-400 italic py-10">NO_HARDWARE_DATA</div>
                        )}
                    </div>
                )}

                {activeTab === 'SOFTWARE' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                        {software.length > 0 ? (
                            software.map((item, index) => (
                                <div key={index} className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-yellow transition-colors group">
                                    <div className="text-xs text-gray-400 font-bold mb-1 uppercase group-hover:text-black">{item.category}</div>
                                    <h3 className="font-bold text-md mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono group-hover:text-black">{item.detail}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-gray-400 italic py-10">NO_SOFTWARE_DATA</div>
                        )}
                    </div>
                )}

                {activeTab === 'SETUP' && (
                    <div className="h-full flex flex-col items-center justify-center relative z-10">
                        {wallpaper ? (
                            <div className="relative w-full h-[400px] border-2 border-black p-2 bg-white rotate-1 shadow-hard">
                                <img src={wallpaper} alt="Desk Setup" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute bottom-4 right-4 bg-black text-white px-2 py-1 text-xs font-bold">
                                    BATTLE_STATION
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 italic py-10 border-2 border-dashed border-gray-300 w-full h-64 flex items-center justify-center">
                                NO_WALLPAPER_UPLOADED
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-white border-t-4 border-black p-2 text-xs font-mono flex justify-between items-center text-gray-500">
                <div>
                    MEM: <span className="text-neo-pink">64GB</span> | CPU: <span className="text-neo-pink">12%</span>
                </div>
                <div className="uppercase">
                    SYSTEM_STATUS: <span className="bg-neo-green text-black px-1 font-bold">ONLINE</span>
                </div>
            </div>
        </div>
    );
};

export default SystemSpecs;
