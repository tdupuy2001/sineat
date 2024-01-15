import React, { useEffect } from 'react';
import L from "leaflet";
import { useMap } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const LeafletRouting = () => {
    const Map = useMap();
    useEffect(()=>{
        const marker1 = L.marker([43.92705634325587, 2.143642370562761]).addTo(Map);
        Map.on("click", function(e){
            L.marker([e.latlng.lat,e.latlng.lng]).addTo(Map);
            L.Routing.control({
                waypoints: [
                  L.latLng(43.92705634325587, 2.143642370562761),
                  L.latLng(e.latlng.lat,e.latlng.lng)
                ],
                lineOptions : {
                    styles : [
                        {
                            color: "blue",
                            weight: 4,
                        },
                    ],
                },
                geocoder : L.Control.Geocoder.nominatim(),
                addWaypoints: false,
                fitSelectedRoutes: true,
              }).addTo(Map);
        })

    },[])
    
      return null
};

export default LeafletRouting ; 