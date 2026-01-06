import {
    OpenStreetMapImageryProvider,
    ArcGisMapServerImageryProvider,
    UrlTemplateImageryProvider
} from "cesium";
import { useState } from "react";
import { useCesium } from "@/context/Cesium";

type BaseLayerType = 'osm' | 'satellite' | 'dark' | 'light';


const BaseLayerSwitcher = () => {
    const { viewer } = useCesium();
    const [activeLayer, setActiveLayer] = useState<BaseLayerType>('osm');
    const [isOpen, setIsOpen] = useState(false);

    const changeBaseLayer = async (type: BaseLayerType) => {
        if (!viewer) return;
        setIsOpen(false);
        try {
            let newProvider;

            switch (type) {
                case 'osm':
                    newProvider = new OpenStreetMapImageryProvider({
                        url: "https://tile.openstreetmap.org/"
                    });
                    break;
                case 'satellite':
                    newProvider = await ArcGisMapServerImageryProvider.fromUrl(
                        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    );
                    break;
                case 'dark':
                    newProvider = new UrlTemplateImageryProvider({
                        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{retina}.png",
                        credit: "Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
                        subdomains: ['a', 'b', 'c', 'd'],
                        customTags: {
                            retina: () => window.devicePixelRatio > 1 ? '@2x' : ''
                        }
                    });
                    break;
                case 'light':
                    newProvider = new UrlTemplateImageryProvider({
                        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{retina}.png",
                        credit: "Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
                        subdomains: ['a', 'b', 'c', 'd'],
                        customTags: {
                            retina: () => window.devicePixelRatio > 1 ? '@2x' : ''
                        }
                    });
                    break;
            }

            if (newProvider) {
                viewer.imageryLayers.removeAll();
                viewer.imageryLayers.addImageryProvider(newProvider);
                setActiveLayer(type);
            }
        } catch (error) {
            console.error("Failed to load base layer:", error);
        }
    };

    const layers: { id: BaseLayerType; name: string; color: string }[] = [
        { id: 'osm', name: 'Standard', color: 'bg-blue-500' },
        { id: 'satellite', name: 'Satellite', color: 'bg-green-600' },
        { id: 'dark', name: 'Dark', color: 'bg-slate-800' },
        { id: 'light', name: 'Light', color: 'bg-slate-100' }
    ];

    return (
        <div
            className="absolute top-4 right-4 z-50 flex flex-col items-end"
        >
            <div onClick={() => setIsOpen(!isOpen)} className={`
                cursor-pointer flex items-center gap-2 p-3 rounded-xl backdrop-blur-md transition-all duration-300
                ${isOpen ? 'bg-black/60 shadow-2xl ring-1 ring-white/10' : 'bg-black/40 shadow-lg hover:bg-black/50'}
            `}>
                <div className="text-white font-medium flex items-center gap-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className={`${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'} transition-all duration-300 whitespace-nowrap`}>
                        Basemaps
                    </span>
                </div>
            </div>
            <div className={`
                mt-2 w-48 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-2
                transition-all duration-300 origin-top-right transform
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
            `}>
                {layers.map((layer) => (
                    <button
                        key={layer.id}
                        onClick={() => changeBaseLayer(layer.id)}
                        className={`
                            w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-all
                            ${activeLayer === layer.id ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
                        `}
                    >
                        <div className={`w-3 h-3 rounded-full shadow-sm ${layer.color} ${activeLayer === layer.id ? 'ring-2 ring-white/50' : ''}`} />
                        {layer.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BaseLayerSwitcher;
