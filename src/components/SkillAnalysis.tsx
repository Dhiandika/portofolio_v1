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
        <div className="w-full h-[400px] md:h-[500px] font-mono font-bold bg-white border-4 border-black shadow-hard flex flex-col relative">
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
                                tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }}
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
                    <div className="w-full h-full flex flex-col">
                        <div className="text-xs text-gray-500 mb-2 text-right">SOURCE: GITHUB PUBLIC REPOS</div>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={githubData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="language"
                                    type="category"
                                    width={80}
                                    tick={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ border: '2px solid black', boxShadow: '4px 4px 0px 0px #000' }}
                                    itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="percentage" fill="#000" radius={[0, 4, 4, 0]} barSize={20}>
                                    {githubData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {activeTab === 'DETAILS' && (
                    <div className="w-full h-full overflow-y-auto font-mono text-sm leading-relaxed p-2 custom-scrollbar">
                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:font-bold prose-headings:uppercase">
                            {/* Auto-generated Radar Stats */}
                            <div className="mb-4 border-b-2 border-gray-200 pb-2">
                                <h4 className="font-bold mb-2 text-gray-500">/// RADAR_METRICS</h4>
                                <ul className="grid grid-cols-2 gap-2">
                                    {radarData.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center bg-gray-50 p-1 px-2 border border-gray-200">
                                            <span>{item.label}</span>
                                            <span className="font-bold text-neo-green bg-black px-1 text-xs">{item.value}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Manual Details */}
                            {details && (
                                <div>
                                    <h4 className="font-bold mb-2 text-gray-500">/// NOTES</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {details.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                                            <li key={index} className="break-words">{line}</li>
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
