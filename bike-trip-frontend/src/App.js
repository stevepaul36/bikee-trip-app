import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const socket = io("https://your-backend-url.onrender.com"); // Replace with Render backend URL

const App = () => {
    const [markers, setMarkers] = useState([]);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    useEffect(() => {
        // Listen for new markers from the server
        socket.on("new-marker", (data) => {
            setMarkers((prev) => [...prev, data]);
        });
    }, []);

    const handleMapClick = (event) => {
        const newMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setMarkers((prev) => [...prev, newMarker]);
        socket.emit("mark-location", newMarker); // Share marker with others
    };

    if (!isLoaded) return <div>Loading Google Maps...</div>;

    return (
        <GoogleMap
            onClick={handleMapClick}
            mapContainerStyle={{ width: "100vw", height: "100vh" }}
            zoom={10}
            center={{ lat: 37.7749, lng: -122.4194 }} // Default location
        >
            {markers.map((marker, index) => (
                <Marker key={index} position={marker} />
            ))}
        </GoogleMap>
    );
};

export default App;
