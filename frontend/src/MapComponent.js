import React, { useState, useEffect } from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';

const containerStyle = {
  width: '1000px',
  height: '1000px'
};

const MapComponent = ({ onMarkerDragEnd, latitud, longitud }) => {
    const initialLat = latitud ?? -34.397;
    const initialLng = longitud ?? 150.644;
  
    const [markerPosition, setMarkerPosition] = useState({ lat: initialLat, lng: initialLng });

    useEffect(() => {
        if(latitud && longitud){
            setMarkerPosition({ lat: parseFloat(latitud), lng: parseFloat(longitud) });
        }
    }, [latitud, longitud]);

    const onDragEnd = (e) => {
        const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPosition(newPosition);
        onMarkerDragEnd(newPosition);
    };

    // Conditional rendering to ensure markerPosition is defined
    if (!markerPosition.lat || !markerPosition.lng) {
        return <div>Loading map...</div>;
    }

    return (
        <APIProvider apiKey="AIzaSyArrTAZutsOGQ0qEXumdsKfqz6sryLq3bw">
            <div style={{ height: "100vh", width: "100%" }}>
                <Map
                    mapContainerStyle={containerStyle}
                    center={markerPosition}
                    zoom={15}
                    mapId={'817a42045fb506a5'}
                >
                    <Marker 
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={onDragEnd}
                    />
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapComponent;
