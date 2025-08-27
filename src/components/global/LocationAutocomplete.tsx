"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocateFixed, Map } from "lucide-react";

type Location = {
  lat: number;
  lng: number;
  address: string;
};

interface LocationAutocompleteProps {
  onLocationSelect: (location: Location) => void;
  currentLocation: { lat: number; lng: number } | null;
}

export function LocationAutocomplete({
  onLocationSelect,
  currentLocation,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  // 1. New state to hold the location before it's confirmed
  const [pinnedLocation, setPinnedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const defaultLocation = useMemo(() => ({ lat: -6.2088, lng: 106.8456 }), []);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsGoogleReady(true);
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  useEffect(() => {
    if (isGoogleReady && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "id" },
          fields: ["formatted_address", "geometry"],
        }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location && place.formatted_address) {
          onLocationSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          });
          setIsMapVisible(false);
        }
      });
    }
  }, [isGoogleReady, onLocationSelect]);

  useEffect(() => {
    if (
      isGoogleReady &&
      isMapVisible &&
      mapRef.current &&
      !mapInstance.current
    ) {
      const center = currentLocation || defaultLocation;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
      });

      if (currentLocation) {
        setPinnedLocation(currentLocation); // Set initial pin
        markerInstance.current = new window.google.maps.Marker({
          position: currentLocation,
          map: mapInstance.current,
        });
      }

      mapInstance.current.addListener(
        "click",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapsMouseEvent: { latLng: any }) => {
          const clickedLatLng = mapsMouseEvent.latLng!;
          const newPin = { lat: clickedLatLng.lat(), lng: clickedLatLng.lng() };

          // 2. Update the temporary pin location instead of closing
          setPinnedLocation(newPin);

          if (markerInstance.current) {
            markerInstance.current.setPosition(clickedLatLng);
          } else {
            markerInstance.current = new window.google.maps.Marker({
              position: clickedLatLng,
              map: mapInstance.current,
            });
          }
        }
      );
    }
  }, [isGoogleReady, isMapVisible, currentLocation, defaultLocation]);

  useEffect(() => {
    if (!isMapVisible) {
      mapInstance.current = null;
      markerInstance.current = null;
      setPinnedLocation(null); // Reset pin when map is hidden
    }
  }, [isMapVisible]);

  // 3. New function to handle the confirmation
  const handleConfirmLocation = () => {
    if (!pinnedLocation) return;

    geocoderRef.current?.geocode(
      { location: pinnedLocation },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          if (inputRef.current) inputRef.current.value = address;
          onLocationSelect({
            ...pinnedLocation,
            address,
          });
          setIsMapVisible(false); // Close map on confirm
        }
      }
    );
  };

  const handleGetCurrentLocation = () => {
    /* ... (this function remains the same) ... */
  };
  const toggleMapVisibility = () => setIsMapVisible(!isMapVisible);

  return (
    <div className="relative w-full ">
      <div className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter a location..."
          disabled={!isGoogleReady}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleGetCurrentLocation}
          disabled={!isGoogleReady}
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMapVisibility}
          disabled={!isGoogleReady}
        >
          <Map className="h-4 w-4" />
        </Button>
      </div>

      {isMapVisible && (
        <div className="absolute top-full left-0 mt-2 w-full h-72 rounded-md shadow-lg z-50">
          <div ref={mapRef} className="w-full h-full rounded-md" />
          {/* 4. The Confirm button, positioned over the map */}
          <Button
            onClick={handleConfirmLocation}
            disabled={!pinnedLocation}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[51]"
          >
            Confirm Location
          </Button>
        </div>
      )}
    </div>
  );
}
