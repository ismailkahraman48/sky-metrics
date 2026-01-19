import { I3SDataProvider, Resource, SceneMode, Viewer, WebMercatorProjection, Cartesian3, Math as CesiumMath } from "cesium"
import { useEffect, useRef, useCallback } from "react"
import { CoordinatesDisplay, BaseLayerSwitcher, GraphicsSettings } from "./widgets"
import { useCesium } from "@/context/Cesium";


const View: React.FC<{ gatewayData: any }> = ({ gatewayData }) => {
    console.log("🚀 ~ View ~ gatewayData:", gatewayData)
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer | null>(null)
    const { setViewer } = useCesium();



    const loadI3SLayer = useCallback(async (cesiumView: Viewer) => {
        const meshLayer = new Resource({
            url: "https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Buildings_Frankfurt_2021/SceneServer",

        })
        const i3sProvider = await I3SDataProvider.fromUrl(meshLayer, {
            geoidTiledTerrainProvider: undefined,
        });

        cesiumView.scene.primitives.add(i3sProvider);

        cesiumView.camera.flyTo({
            destination: Cartesian3.fromDegrees(8.682127, 50.110924, 1000),
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-90),
                roll: 0.0,
            },
        });

    }, [gatewayData])


    useEffect(() => {

        if (cesiumContainerRef.current && !viewerRef.current && gatewayData) {


            try {
                const cesiumView = new Viewer(cesiumContainerRef.current, {
                    sceneMode: SceneMode.SCENE3D,
                    // terrain: Terrain.fromWorldTerrain(),
                    baseLayerPicker: false,
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
                    // Performans Optimizasyonları
                    requestRenderMode: true, // Sadece gerektiğinde render al
                    maximumRenderTimeChange: Infinity,
                    shadows: false, // Gölgeleri kapat
                    orderIndependentTranslucency: false, // Saydamlık hesaplamasını kapat
                    contextOptions: {
                        webgl: {
                            powerPreference: "high-performance",
                            antialias: false, // Kenar yumuşatmayı kapat (performans artar)
                        }
                    },
                    msaaSamples: 1, // Multi-sample antialiasing kapat
                });

                // Ekstra Performans Ayarları
                cesiumView.scene.debugShowFramesPerSecond = true; // FPS göstergesi
                cesiumView.resolutionScale = 0.9; // Çözünürlüğü hafif düşür (görüntüyü çok bozmadan hızlandırır)
                cesiumView.scene.postProcessStages.fxaa.enabled = false; // FXAA kapat
                cesiumView.scene.globe.enableLighting = false; // Işıklandırma hesaplamalarını kapat
                cesiumView.scene.globe.maximumScreenSpaceError = 2; // Arazi hızı artırmak için hata payını yükselt (default ~2)
                cesiumView.scene.fog.enabled = true;

                // Gereksiz Görselleri Kapat
                if (cesiumView.scene.skyAtmosphere) cesiumView.scene.skyAtmosphere.show = false;
                if (cesiumView.scene.skyBox) cesiumView.scene.skyBox.show = false;
                if (cesiumView.scene.sun) cesiumView.scene.sun.show = false;
                if (cesiumView.scene.moon) cesiumView.scene.moon.show = false;

                // Hareket Halinde İstekleri Kısıtla
                (cesiumView.scene as any).cullRequestsWhileMoving = true;
                (cesiumView.scene as any).cullRequestsWhileMovingMultiplier = 60.0;

                loadI3SLayer(cesiumView)





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

    }, [gatewayData])

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
                    <GraphicsSettings />
                </>
            )}
        </div>
    )
}

export default View
