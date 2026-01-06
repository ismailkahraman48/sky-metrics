import { useCesium } from '@/context/Cesium';
import { ScreenSpaceEventHandler, ScreenSpaceEventType, Math as CesiumMath, Ellipsoid } from 'cesium';
import { useEffect, useState } from 'react';


const CoordinatesDisplay: React.FC = () => {
    const [coords, setCoords] = useState<{ lat: number; lon: number; height: number } | null>(null);

    const { viewer } = useCesium();
    useEffect(() => {
        if (!viewer) return;

        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction((movement: any) => {
            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);

            if (cartesian) {
                const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian);
                setCoords({
                    lon: CesiumMath.toDegrees(cartographic.longitude),
                    lat: CesiumMath.toDegrees(cartographic.latitude),
                    height: Math.round(viewer.camera.positionCartographic.height) // Camera height or cursor height? Usually cursor lat/lon + camera height or terrain height. Let's just show lat/lon.
                });
            } else {
                setCoords(null);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        return () => {
            handler.destroy();
        };
    }, [viewer]);

    if (!coords) return null;

    return (
        <div className="absolute bottom-1 left-20 bg-black/60 text-white px-3 py-1 rounded text-sm backdrop-blur-sm pointer-events-none font-mono z-50">
            Lat: {coords.lat.toFixed(6)} | Lon: {coords.lon.toFixed(6)}
        </div>
    );
};

export default CoordinatesDisplay;
