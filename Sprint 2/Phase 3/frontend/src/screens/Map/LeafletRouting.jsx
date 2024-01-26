import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LeafletRouting = () => {
  const Map = useMap();
  useEffect(() => {
    const marker1 = L.marker([43.92705634325587, 2.143642370562761]).addTo(Map);
    Map.on("click", function (e) {
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(Map);
      L.Routing.control({
        waypoints: [
          L.latLng(43.92705634325587, 2.143642370562761),
          L.latLng(e.latlng.lat, e.latlng.lng),
        ],
        lineOptions: {
          styles: [
            {
              color: "blue",
              weight: 4,
            },
          ],
        },
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(Map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LeafletRouting;
