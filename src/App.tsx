
import { View } from "@/features/Cesium"
import { useEffect, useState } from "react"

function App() {
  const [gatewayData, setGatewayData] = useState<any>(null)



  const getGatewayData = async () => {
    const res = await fetch("http://10.6.129.205:5001/auth/anonim")
    const data = await res.json()
    console.log("🚀 ~ getGatewayData ~ data:", data)

    setGatewayData(data)
    return data
  }

  useEffect(() => {
    getGatewayData()

  }, [])



  return (
    <>
      <View gatewayData={gatewayData} />
    </>
  )
}

export default App
