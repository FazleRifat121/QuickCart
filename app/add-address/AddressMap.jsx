"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function AddressMap({ address, setAddress }) {
  const mapRef = useRef(null);

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = res.data;
      setAddress((prev) => ({
        ...prev,
        area: data.address.road || data.address.neighbourhood || "",
        city: data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        pincode: data.address.postcode || "",
        latitude: lat,
        longitude: lon,
      }));
    } catch (err) {
      toast.error("Unable to get address from location");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        reverseGeocode(lat, lng);
      },
    });
    return address.latitude && address.longitude ? (
      <Marker position={[address.latitude, address.longitude]} icon={markerIcon} />
    ) : null;
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        reverseGeocode(latitude, longitude);
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 15);
      },
      () => toast.error("Unable to retrieve your location")
    );
  };

  return (
    <div className="w-full h-[450px] md:h-[500px] relative">
      <button
        onClick={handleLocateMe}
        className="absolute top-3 right-3 z-[1000] bg-white shadow-md px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
      >
        📍 Locate Me
      </button>

      <MapContainer
        center={[23.8103, 90.4125]} // Default: Dhaka
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg shadow-md"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
