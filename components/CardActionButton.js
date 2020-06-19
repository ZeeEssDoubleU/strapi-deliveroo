import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import { Button } from "@material-ui/core";

// ******************
// component
// ******************

// forwardRef used to forward link components down to button hwen necessary
const CardActionButton = forwardRef((props, ref) => {
	return (
		<Button {...props} ref={ref} size={props.size || "large"}>
			{props.children}
		</Button>
	);
});

CardActionButton.propTypes = {};
export default CardActionButton;
