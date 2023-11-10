/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface Props {
  color: string;
  opacity: string;
  className: any;
}

export const Property1Hide = ({ color = "#666666", opacity = "unset", className }: Props): JSX.Element => {
  return (
    <svg
      className={`property-1-hide ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M19.8824 4.88129L19.1465 4.14535C18.9385 3.93736 18.5545 3.96937 18.3145 4.25731L15.7543 6.80128C14.6023 6.30533 13.3384 6.06533 12.0103 6.06533C8.0582 6.08127 4.63442 8.38524 2.9863 11.6974C2.89028 11.9054 2.89028 12.1614 2.9863 12.3374C3.75424 13.9054 4.90631 15.2014 6.34631 16.1774L4.25032 18.3053C4.01032 18.5453 3.97831 18.9293 4.13835 19.1373L4.8743 19.8733C5.08229 20.0812 5.46628 20.0492 5.70628 19.7613L19.7542 5.7134C20.0582 5.47354 20.0902 5.08958 19.8822 4.88156L19.8824 4.88129ZM12.8583 9.71318C12.5863 9.64916 12.2984 9.5692 12.0263 9.5692C10.6663 9.5692 9.5784 10.6572 9.5784 12.0171C9.5784 12.2891 9.64242 12.5771 9.72237 12.8491L8.65025 13.9051C8.3303 13.3452 8.15431 12.7211 8.15431 12.0172C8.15431 9.88919 9.86634 8.17717 11.9943 8.17717C12.6984 8.17717 13.3223 8.35315 13.8823 8.67311L12.8583 9.71318Z"
        fill={color}
        fillOpacity={opacity}
      />
      <path
        className="path"
        d="M21.0344 11.6974C20.4745 10.5773 19.7384 9.56941 18.8265 8.75338L15.8505 11.6974V12.0173C15.8505 14.1453 14.1384 15.8573 12.0105 15.8573H11.6905L9.80251 17.7453C10.5066 17.8893 11.2425 17.9853 11.9625 17.9853C15.9146 17.9853 19.3384 15.6814 20.9865 12.3532C21.1305 12.1291 21.1305 11.9052 21.0345 11.6972L21.0344 11.6974Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
};

Property1Hide.propTypes = {
  color: PropTypes.string,
  opacity: PropTypes.string,
};
