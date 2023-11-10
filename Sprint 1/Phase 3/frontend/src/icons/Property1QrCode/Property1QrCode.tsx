/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const Property1QrCode = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`property-1-qr-code ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="g" clipPath="url(#clip0_36_55)">
        <path className="path" d="M3 11H11V3H3V11ZM5 5H9V9H5V5Z" fill="black" />
        <path className="path" d="M3 21H11V13H3V21ZM5 15H9V19H5V15Z" fill="black" />
        <path className="path" d="M13 3V11H21V3H13ZM19 9H15V5H19V9Z" fill="black" />
        <path className="path" d="M21 19H19V21H21V19Z" fill="black" />
        <path className="path" d="M15 13H13V15H15V13Z" fill="black" />
        <path className="path" d="M17 15H15V17H17V15Z" fill="black" />
        <path className="path" d="M15 17H13V19H15V17Z" fill="black" />
        <path className="path" d="M17 19H15V21H17V19Z" fill="black" />
        <path className="path" d="M19 17H17V19H19V17Z" fill="black" />
        <path className="path" d="M19 13H17V15H19V13Z" fill="black" />
        <path className="path" d="M21 15H19V17H21V15Z" fill="black" />
      </g>
      <defs className="defs">
        <clipPath className="clip-path" id="clip0_36_55">
          <rect className="rect" fill="white" height="24" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
};
