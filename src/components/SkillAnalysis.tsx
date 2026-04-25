import React, { useState } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from 'recharts';

interface TechRadarProps {
    radarData: {
        label: string;
        value: number;
        fullMark: number;
    }[];
    githubData: {
        language: string;
        percentage: number;
        color: string;
    }[];
    details?: string;
}

const COLORS = ['#00C853', '#FBFF48', '#2979FF', '#FF4081', '#AA00FF', '#FF9100'];

const SkillAnalysis: React.FC<TechRadarProps> = ({ radarData, githubData, details }) => {
    const [activeTab, setActiveTab] = useState<'RADAR' | 'GITHUB' | 'DETAILS'>('RADAR');

    return (
        <div className="w-full h-[400px] md:h-[450px] font-mono font-bold bg-white border-4 border-black shadow-hard flex flex-col relative">
            {/* Window Bar */}
            <div className="bg-neo-black text-white px-2 py-1 text-xs flex justify-between items-center z-10 shrink-0">
                <span>SKILL_ANALYSIS.EXE</span>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b-4 border-black bg-gray-100 shrink-0">
                <button
                    onClick={() => setActiveTab('RADAR')}
                    className={`flex-1 py-2 text-sm border-r-4 border-black transition-colors ${activeTab === 'RADAR' ? 'bg-neo-green text-black' : 'hover:bg-gray-200 text-gray-500'
                        }`}
                >
                    RADAR_SCAN
                </button>
                <button
                    onClick={() => setActiveTab('GITHUB')}
                    className={`flex-1 py-2 text-sm border-r-4 border-black transition-colors ${activeTab === 'GITHUB' ? 'bg-neo-green text-black' : 'hover:bg-gray-200 text-gray-500'
                        }`}
                >
                    GITHUB_STATS
                </button>
                <button
                    onClick={() => setActiveTab('DETAILS')}
                    className={`flex-1 py-2 text-sm transition-colors ${activeTab === 'DETAILS' ? 'bg-neo-green text-black' : 'hover:bg-gray-200 text-gray-500'
                        }`}
                >
                    DETAILS
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden p-4 bg-white">
                {activeTab === 'RADAR' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#000" strokeWidth={2} />
                            <PolarAngleAxis
                                dataKey="label"
                                tick={{ fill: '#000', fontSize: 14, fontWeight: '900' }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#000" strokeWidth={2} tick={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px #000' }}
                                itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                            />
                            <Radar
                                name="Skills"
                                dataKey="value"
                                stroke="#000"
                                strokeWidth={3}
                                fill="#FBFF48" // Neo-Yellow
                                fillOpacity={0.8}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'GITHUB' && (
                    <div className="w-full h-full flex flex-col bg-gray-50 p-2">
                        <div className="flex justify-end mb-2 shrink-0">
                            <div className="text-xs bg-neo-black text-neo-green px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] inline-block font-mono font-bold uppercase tracking-wider">
                                SOURCE: GITHUB_PUBLIC_REPOS
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={githubData} layout="vertical" margin={{ top: 5, right: 40, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="language"
                                    type="category"
                                    width={90}
                                    tick={{ fill: '#000', fontSize: 12, fontWeight: '900', fontFamily: 'monospace' }}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ border: '3px solid black', boxShadow: '4px 4px 0px 0px #000', borderRadius: '0px', backgroundColor: '#fff' }}
                                    itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#000' }}
                                />
                                <Bar 
                                    dataKey="percentage" 
                                    fill="#000" 
                                    barSize={24}
                                    label={{ position: 'right', fill: '#000', fontSize: 12, fontWeight: '900', formatter: (val: number) => `${val}%` }}
                                >
                                    {githubData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} stroke="#000" strokeWidth={3} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'DETAILS' && (
                    <div className="w-full h-full overflow-y-auto font-mono text-sm leading-relaxed p-4 custom-scrollbar bg-neo-white">
                        <div className="max-w-none">
                            {/* Auto-generated Radar Stats */}
                            <div className="mb-8">
                                <h4 className="inline-block bg-neo-pink text-black px-3 py-1 font-bold border-2 border-black shadow-[2px_2px_0_0_#000] mb-4">
                                    /// RADAR_METRICS
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {radarData.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-white p-2 px-3 border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] transition-all">
                                            <span className="font-bold text-xs uppercase text-gray-800">{item.label}</span>
                                            <span className="font-black text-black bg-neo-yellow px-1.5 py-0.5 text-xs border border-black shadow-[1px_1px_0_0_#000]">
                                                {item.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Manual Details */}
                            {details && (
                                <div className="border-t-4 border-black pt-6 border-dashed">
                                    <h4 className="inline-block bg-neo-blue text-white px-3 py-1 font-bold border-2 border-black shadow-[2px_2px_0_0_#000] mb-4">
                                        /// SYSTEM_NOTES
                                    </h4>
                                    <ul className="space-y-3 font-bold text-gray-700 text-sm">
                                        {details.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                                            <li key={index} className="break-words flex items-start gap-2">
                                                <span className="text-neo-orange font-black mt-0.5">&gt;_</span>
                                                <span className="leading-snug">{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {!details && radarData.length === 0 && (
                                <div className="text-gray-400 italic text-center mt-10">
                                    NO_ADDITIONAL_DATA_FOUND<br />
                                    CHECK_KEYSTATIC_CONFIG
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillAnalysis;
