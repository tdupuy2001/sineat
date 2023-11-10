/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const Icons = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`icons ${className}`}
      fill="none"
      height="25"
      viewBox="0 0 24 25"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="g" clipPath="url(#clip0_36_108)">
        <path className="path" d="M7 10.5L12 15.5L17 10.5H7Z" fill="black" />
      </g>
      <defs className="defs">
        <clipPath className="clip-path" id="clip0_36_108">
          <rect className="rect" fill="white" height="24" transform="translate(0 0.5)" width="24" />
        </clipPath>
      </defs>
    </svg>
  );
};
