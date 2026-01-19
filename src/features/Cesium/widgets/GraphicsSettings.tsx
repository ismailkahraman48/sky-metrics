import { useState, useEffect } from "react";
import { useCesium } from "@/context/Cesium";

type GraphicsMode = "low" | "medium" | "high";

export const GraphicsSettings = () => {
    const { viewer } = useCesium();
    const [mode, setMode] = useState<GraphicsMode>("medium");
    const [isOpen, setIsOpen] = useState(false);

    const applySettings = (selectedMode: GraphicsMode) => {
        if (!viewer) return;
        const scene = viewer.scene;

        switch (selectedMode) {
            case "low":
                // Render
                viewer.resolutionScale = 0.7;
                scene.requestRenderMode = true;
                scene.maximumRenderTimeChange = Infinity;

                // Visuals
                viewer.shadows = false;
                scene.postProcessStages.fxaa.enabled = false;
                scene.globe.enableLighting = false;
                if (scene.skyAtmosphere) scene.skyAtmosphere.show = false;
                if (scene.skyBox) scene.skyBox.show = false;
                if (scene.sun) scene.sun.show = false;
                if (scene.moon) scene.moon.show = false;

                // Detail
                scene.globe.maximumScreenSpaceError = 4; // Lower terrain detail
                (scene as any).msaaSamples = 1;

                break;

            case "medium":
                // Render
                viewer.resolutionScale = 0.9;
                scene.requestRenderMode = true;

                // Visuals
                viewer.shadows = false;
                scene.postProcessStages.fxaa.enabled = false;
                scene.globe.enableLighting = true; // Basic lighting
                if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
                if (scene.skyBox) scene.skyBox.show = true;
                if (scene.sun) scene.sun.show = true;

                // Detail
                scene.globe.maximumScreenSpaceError = 2; // Normal detail
                (scene as any).msaaSamples = 1;
                break;

            case "high":
                // Render
                viewer.resolutionScale = 1.0;
                scene.requestRenderMode = false; // Always render for smooth animations (optional)

                // Visuals
                viewer.shadows = true;
                scene.postProcessStages.fxaa.enabled = true;
                scene.globe.enableLighting = true;
                if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
                if (scene.skyBox) scene.skyBox.show = true;
                if (scene.sun) scene.sun.show = true;
                if (scene.moon) scene.moon.show = true;

                // Detail
                scene.globe.maximumScreenSpaceError = 1.5; // High terrain detail
                (scene as any).msaaSamples = 4;
                break;
        }

        // Explicitly request a render to show changes
        scene.requestRender();
        setMode(selectedMode);
    };

    // Apply default on load if viewer exists
    useEffect(() => {
        if (viewer) {
            // You might want to load this from localStorage in a real app
            applySettings(mode);
        }
    }, [viewer]);

    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-800 text-white p-2 rounded-md shadow-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                <span>Grafik</span>
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 bg-slate-900/90 backdrop-blur text-white p-3 rounded-md shadow-xl w-48 flex flex-col gap-2 border border-slate-700">
                    <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Kalite Ayarları</div>

                    {(['low', 'medium', 'high'] as GraphicsMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => applySettings(m)}
                            className={`
                                text-left px-3 py-2 rounded text-sm transition-all
                                ${mode === m
                                    ? 'bg-blue-600 text-white font-medium shadow-md'
                                    : 'hover:bg-slate-700 text-slate-300'}
                            `}
                        >
                            {m === 'low' && 'Düşük (Hızlı)'}
                            {m === 'medium' && 'Orta (Dengeli)'}
                            {m === 'high' && 'Yüksek (Kaliteli)'}
                        </button>
                    ))}

                    <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-500 text-center">
                        Performans için "Düşük" seçin
                    </div>
                </div>
            )}
        </div>
    );
};
