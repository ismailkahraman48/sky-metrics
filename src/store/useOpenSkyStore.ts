import { create } from 'zustand';

// OpenSky API State Vector structure
// Index 0: icao24 (string)
// Index 1: callsign (string)
// Index 2: origin_country (string)
// Index 3: time_position (int)
// Index 4: last_contact (int)
// Index 5: longitude (float)
// Index 6: latitude (float)
// Index 7: baro_altitude (float)
// Index 8: on_ground (boolean)
// Index 9: velocity (float)
// Index 10: true_track (float)
// Index 11: vertical_rate (float)
// Index 12: sensors (int[])
// Index 13: geo_altitude (float)
// Index 14: squawk (string)
// Index 15: spi (boolean)
// Index 16: position_source (int)

export interface FlightData {
    icao24: string;
    callsign: string;
    originCountry: string;
    longitude: number | null;
    latitude: number | null;
    altitude: number | null; // baro_altitude
    onGround: boolean;
    velocity: number | null;
    trueTrack: number | null;
    verticalRate: number | null;
    geoAltitude: number | null;
}

interface OpenSkyState {
    flights: FlightData[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
    fetchFlights: (bounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => Promise<void>;
}

export const useOpenSkyStore = create<OpenSkyState>((set) => ({
    flights: [],
    loading: false,
    error: null,
    lastUpdated: null,
    fetchFlights: async (bounds) => {
        set({ loading: true, error: null });
        try {
            let url = 'https://opensky-network.org/api/states/all';

            if (bounds) {
                // OpenSky API uses lamin, lomin, lamax, lomax
                url += `?lamin=${bounds.minLat}&lomin=${bounds.minLon}&lamax=${bounds.maxLat}&lomax=${bounds.maxLon}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch flight data');
            }

            const data = await response.json();

            // Map the raw array data to our FlightData interface
            const flights: FlightData[] = data.states?.map((state: any[]) => ({
                icao24: state[0],
                callsign: state[1].trim(),
                originCountry: state[2],
                longitude: state[5],
                latitude: state[6],
                altitude: state[7],
                onGround: state[8],
                velocity: state[9],
                trueTrack: state[10],
                verticalRate: state[11],
                geoAltitude: state[13]
            })) || [];

            set({ flights, loading: false, lastUpdated: Date.now() });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
