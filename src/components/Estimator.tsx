import React, { useState, useEffect } from "react";


interface Service {
    id: string;
    name: string;
    price: number;
    category: string;
}

interface EstimatorProps {
    services?: Service[];
    currencySymbol?: string;
}

const Estimator: React.FC<EstimatorProps> = ({ services = [], currencySymbol = '$' }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = selected.reduce((acc, id) => {
            const service = services.find((s) => s.id === id);
            return acc + (service ? service.price : 0);
        }, 0);
        setTotal(newTotal);
    }, [selected, services]);

    const toggleService = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 font-mono">
            {/* Service Selection */}
            <div className="flex-1 bg-white border-4 border-black shadow-hard p-6">
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                    <span className="w-4 h-4 bg-neo-black"></span>
                    SELECT MODULES
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`flex justify-between items-center p-4 border-2 border-black transition-all ${selected.includes(service.id)
                                ? "bg-neo-black text-white translate-x-1 translate-y-1 shadow-none"
                                : "bg-white hover:bg-gray-100 hover:-translate-y-1 hover:shadow-md"
                                }`}
                        >
                            <div className="text-left">
                                <div className="font-bold">{service.name}</div>
                                <div className="text-xs opacity-70 uppercase">{service.category}</div>
                            </div>
                            <div className="font-bold">{currencySymbol}{service.price}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Receipt / Output */}
            <div className="w-full md:w-96 bg-neo-yellow border-4 border-black p-6 relative shadow-hard flex flex-col">
                {/* Tape Visual */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-black/10 rotate-1"></div>

                <h3 className="text-xl font-black uppercase mb-4 text-center border-b-2 border-black pb-4 border-dashed">
                    ESTIMATED QUOTE
                </h3>

                <div className="flex-1 space-y-2 mb-4 text-sm">
                    {selected.length === 0 ? (
                        <div className="text-center opacity-50 italic py-8">
                            [NO ITEMS SELECTED]
                        </div>
                    ) : (
                        selected.map((id) => {
                            const service = services.find((s) => s.id === id);
                            return (
                                <div key={id} className="flex justify-between border-b border-black/10 pb-1">
                                    <span>{service?.name}</span>
                                    <span>{currencySymbol}{service?.price}</span>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="border-t-4 border-black pt-4 mt-auto">
                    <div className="flex justify-between text-xl font-black">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{total}</span>
                    </div>
                    <div className="text-xs text-center mt-4 opacity-70">
                        *Est. timeline varies by scope.
                    </div>
                </div>

                <button className="w-full bg-black text-white mt-6 py-3 font-bold hover:bg-white hover:text-black border-2 border-black transition-colors">
                    PRINT QUOTE
                </button>
            </div>
        </div>
    );
};

export default Estimator;
