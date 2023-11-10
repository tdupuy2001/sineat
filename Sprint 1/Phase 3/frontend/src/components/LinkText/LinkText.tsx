/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

interface Props {
  className: any;
  text: string;
}

export const LinkText = ({ className, text = "By creating an account, you agree to the " }: Props): JSX.Element => {
  return (
    <div className={`link-text ${className}`}>
      <p className="by-creating-an">
        <span className="text-wrapper">{text}</span>
        <span className="span">Terms of use</span>
        <span className="text-wrapper-2">&nbsp;</span>
        <span className="text-wrapper">and</span>
        <span className="text-wrapper-2">&nbsp;</span>
        <span className="span">Privacy Policy.</span>
        <span className="text-wrapper-3">&nbsp;</span>
      </p>
    </div>
  );
};

LinkText.propTypes = {
  text: PropTypes.string,
};
