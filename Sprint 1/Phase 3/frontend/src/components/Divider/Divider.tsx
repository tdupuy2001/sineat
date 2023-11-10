/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  className: any;
  divClassName: any;
  text: string;
}

export const Divider = ({ className, divClassName, text = "OR" }: Props): JSX.Element => {
  return (
    <div className={`divider ${className}`}>
      <div className="div" />
      <div className={`OR ${divClassName}`}>{text}</div>
      <div className="div" />
    </div>
  );
};

Divider.propTypes = {
  text: PropTypes.string,
};
