
import { View } from "@/features/Cesium"
import { useOpenSkyStore } from "@/store/useOpenSkyStore";
import { useEffect } from "react";


function App() {

  const { fetchFlights, flights } = useOpenSkyStore()


  useEffect(() => {
    const bounds = {
      minLat: 37.0,
      maxLat: 38.0,
      minLon: 22.0,
      maxLon: 23.0
    }
    fetchFlights(bounds)
    console.log("🚀 ~ App ~ flights:", flights)
  }, [flights])
  return (
    <>
      <View />
    </>
  )
}

export default App
