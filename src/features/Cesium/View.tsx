import { Cartesian3, createOsmBuildingsAsync, ImageryLayer, OpenStreetMapImageryProvider, SceneMode, Terrain, Viewer, WebMercatorProjection } from "cesium"
import { useEffect, useRef } from "react"
import { CoordinatesDisplay, BaseLayerSwitcher } from "./widgets"
import { useCesium } from "@/context/Cesium";


const View: React.FC = () => {
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer | null>(null)
    const { setViewer } = useCesium();



    useEffect(() => {

        if (cesiumContainerRef.current && !viewerRef.current) {
            try {
                const cesiumView = new Viewer(cesiumContainerRef.current, {
                    sceneMode: SceneMode.SCENE3D,
                    terrain: Terrain.fromWorldTerrain(),
                    baseLayerPicker: false,
                    baseLayer: new ImageryLayer(new OpenStreetMapImageryProvider({
                        url: "https://tile.openstreetmap.org/"
                    })),
                    mapProjection: new WebMercatorProjection(),
                    timeline: true,
                    animation: true,
                    fullscreenButton: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,
                });


                cesiumView.camera.flyTo({
                    destination: Cartesian3.fromDegrees(27.98, 41.18, 100000),
                });

                createOsmBuildingsAsync().then((buildingTileset) => {
                    cesiumView.scene.primitives.add(buildingTileset);
                });

                viewerRef.current = cesiumView;
                setViewer(cesiumView);

            } catch (error) {
                console.error("Error initializing Cesium:", error);
            }
        }

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
                setViewer(null);
            }
        }

    }, [])

    return (
        <div className="w-full h-full group">
            <div
                ref={cesiumContainerRef}
                className="w-full h-full"
            />

            {viewerRef.current && (
                <>
                    <CoordinatesDisplay />
                    <BaseLayerSwitcher />
                </>
            )}
        </div>
    )
}

export default View
