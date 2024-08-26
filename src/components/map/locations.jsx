import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MapComponent = ({ locations }) => {
    const [zoom, setZoom] = useState(6);
    const mapRef = useRef(null);

    const containerStyle = {
        width: '100%',
        height: '800px'
    };

    const parsedLocations = useMemo(() => {
        console.log("Parsing locations:", locations);
        if (Array.isArray(locations)) {
            return locations;
        } else if (typeof locations === 'string') {
            try {
                return JSON.parse(locations);
            } catch (error) {
                console.error("Error parsing locations:", error);
                return [];
            }
        } else {
            console.error("Unexpected locations type:", typeof locations);
            return [];
        }
    }, [locations]);

    const validLocations = useMemo(() => {
        return parsedLocations.filter(location => {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        });
    }, [parsedLocations]);

    const initialCenter = useMemo(() => {
        if (validLocations.length > 0) {
            const lat = validLocations.reduce((sum, loc) => sum + parseFloat(loc.latitude), 0) / validLocations.length;
            const lng = validLocations.reduce((sum, loc) => sum + parseFloat(loc.longitude), 0) / validLocations.length;
            return { lat, lng };
        }
        return { lat: 31.7917, lng: -7.0926 }; // Default center of Morocco
    }, [validLocations]);

    const handleZoomIn = () => {
        if (mapRef.current) {
            setZoom(prevZoom => Math.min(prevZoom + 1, 20));
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            setZoom(prevZoom => Math.max(prevZoom - 1, 1));
        }
    };

    const PoiMarkers = ({ pois }) => {
        const map = useMap();
        const [markers, setMarkers] = useState({});
        const clusterer = useRef(null);
    
        useEffect(() => {
            if (!map) return;
            if (!clusterer.current) {
                clusterer.current = new MarkerClusterer({map});
            }
        }, [map]);
    
        useEffect(() => {
            clusterer.current?.clearMarkers();
            clusterer.current?.addMarkers(Object.values(markers));
        }, [markers]);
    
        const setMarkerRef = (marker, key) => {
            if (marker && markers[key]) return;
            if (!marker && !markers[key]) return;
    
            setMarkers(prev => {
                if (marker) {
                    return {...prev, [key]: marker};
                } else {
                    const newMarkers = {...prev};
                    delete newMarkers[key];
                    return newMarkers;
                }
            });
        };
    
        return (
            <>
                {pois.map((poi, index) => (
                    <AdvancedMarker
                        key={`${poi.numeroTitre}-${index}`}
                        position={{lat: parseFloat(poi.latitude), lng: parseFloat(poi.longitude)}}
                        ref={marker => setMarkerRef(marker, `${poi.numeroTitre}-${index}`)}
                    >
                        <img
                        src="/icon/marker.svg" // Replace with the URL to your SVG file
                        alt="Marker"
                        style={{
                            width: '24px',  // Adjust size as needed
                            height: '24px',
                            objectFit: 'contain' // Ensure the SVG fits well
                        }}
                    />

                    </AdvancedMarker>
                ))}
            </>
        );
    };

    return (
        <APIProvider apiKey={'AIzaSyC2huUc-NceTa3k-EXKn8GOgWA2jjwrZ44'} region="MA">
            <div style={containerStyle}>
                <Map
                    mapId='one_and_only_map'
                    
                    
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        gestureHandling: 'greedy'
                    }}
                >
                    <PoiMarkers pois={validLocations} />
                </Map>
                <div style={{position: 'absolute', top: '10px', left: '10px', zIndex: 1000}}>
                    <button onClick={handleZoomIn}>+</button>
                    <button onClick={handleZoomOut}>-</button>
                </div>
            </div>
        </APIProvider>
    );
};

export default MapComponent;