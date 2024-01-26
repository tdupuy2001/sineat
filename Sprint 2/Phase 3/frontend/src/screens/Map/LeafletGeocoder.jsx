import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LeafletGeocoder = () => {
  const Map = useMap();
  useEffect(() => {
    L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest(),
        ]).addTo(Map);
        Map.fitBounds(poly.getBounds());
      })
      .addTo(Map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default LeafletGeocoder;
