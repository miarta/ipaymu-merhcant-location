'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

export interface CoordinateData {
    member_id: number;
    fname: string;
    email: string;
    phone: string;
    lat: string;
    long: string;
    last_login_at: string;
}

interface ManualCoordinate {
    lat: number;
    lng: number;
}

interface MapProps {
    data: CoordinateData[];
    manualCoordinates?: ManualCoordinate | null;
    displayLimit: number;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    // ... (RecenterMap body remains valid, but we need to match context for replace)
    useEffect(() => {
        map.flyTo([lat, lng], 13, {
            duration: 1.5
        });
    }, [lat, lng, map]);
    return null;
}

// Ensure map resizes when container size changes (e.g. sidebar toggle)
function MapResizer() {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(map.getContainer());
        return () => resizeObserver.disconnect();
    }, [map]);
    return null;
}

// Custom Red Marker Icon
const createCustomIcon = (count?: number) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `
            <div class="relative flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
                <div class="absolute w-full h-full rounded-full bg-red-400/30 animate-pulse"></div>
                <div class="absolute w-8 h-8 rounded-full bg-red-500 shadow-lg border-2 border-white flex items-center justify-center">
                    ${count ? `<span class="text-white text-xs font-bold">${count}</span>` : `
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>`}
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

// ... imports

// ... props

export default function Map({ data, manualCoordinates, displayLimit }: MapProps) {
    // Clean and filter invalid coordinates
    const validMarkers = data.filter(d => {
        const lat = parseFloat(d.lat.trim());
        const long = parseFloat(d.long.trim());
        return !isNaN(lat) && !isNaN(long);
    }).map(d => ({
        ...d,
        cleanedLat: parseFloat(d.lat.trim()),
        cleanedLong: parseFloat(d.long.trim()),
    }));

    // Data is already paginated by parent, so we don't slice it here anymore.
    const limitedMarkers = validMarkers;

    // ... rest of the component

    const center: [number, number] = [-2.5, 118]; // Centered on Indonesia
    const zoom = 5;

    const singleMarkerIcon = createCustomIcon();

    // Toggle state for pins
    const [showAllPins, setShowAllPins] = useState(true);

    // If manualCoordinates is present, hide other markers. Otherwise respect the toggle.
    const displayedMarkers = manualCoordinates ? [] : (showAllPins ? limitedMarkers : []);

    return (
        <div className="w-full h-full bg-slate-50 relative outline-none">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
                className="z-0 outline-none"
                zoomControl={false}
                attributionControl={false}
            >
                <div className="absolute top-4 right-4 z-[400] bg-white rounded-xl shadow-lg border border-slate-100 p-4 min-w-[160px]">
                    <div className="text-sm font-bold text-slate-600 mb-3">Inspected Pins</div>
                    <button
                        onClick={() => setShowAllPins(!showAllPins)}
                        className="flex items-center gap-3 group cursor-pointer w-full text-left"
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${showAllPins ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                            {showAllPins && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className="text-base font-medium text-slate-700 select-none">Show All</span>
                    </button>
                </div>

                {manualCoordinates && <RecenterMap lat={manualCoordinates.lat} lng={manualCoordinates.lng} />}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {manualCoordinates && (
                    <Marker
                        position={[manualCoordinates.lat, manualCoordinates.lng]}
                        icon={singleMarkerIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <h3 className="font-bold text-sm text-red-600">Manual Location</h3>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {displayedMarkers.map((marker) => (
                    <Marker
                        key={marker.member_id}
                        position={[marker.cleanedLat, marker.cleanedLong]}
                        icon={singleMarkerIcon}
                    >
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="p-3 min-w-[200px] border-l-4 border-red-500">
                                <h3 className="font-bold text-base text-slate-900 mb-2">{marker.fname}</h3>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="truncate max-w-[150px]">{marker.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span>{marker.phone}</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-400 uppercase">Status</span>
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
