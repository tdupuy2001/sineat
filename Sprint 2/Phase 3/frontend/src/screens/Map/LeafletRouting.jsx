import React, { useEffect } from 'react';
import L from "leaflet";
import { useMap } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const LeafletRouting = () => {
    const Map = useMap();
    useEffect(()=>{
        L.Routing.control({
            waypoints: [
              L.latLng(57.74, 11.94),
              L.latLng(57.6792, 11.949)
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
          }).addTo(Map);

    },[])
    
      return null
};

export default LeafletRouting ; 