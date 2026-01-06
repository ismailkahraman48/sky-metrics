import type { Viewer } from "cesium";
import { createContext, useState, useContext } from "react";


interface CesiumContextType {
    viewer: Viewer | null;
    setViewer: (viewer: Viewer | null) => void;
}

export const CesiumContext = createContext<CesiumContextType | null>(null);

export const CesiumProvider = ({ children }: { children: React.ReactNode }) => {
    const [viewer, setViewer] = useState<Viewer | null>(null);

    return (

        <CesiumContext.Provider value={{ viewer, setViewer }}>
            {children}
        </CesiumContext.Provider>
    )
}

export const useCesium = () => {
    const context = useContext(CesiumContext);
    if (!context) {
        throw new Error('useCesium must be used within a CesiumProvider');
    }
    return context;
}