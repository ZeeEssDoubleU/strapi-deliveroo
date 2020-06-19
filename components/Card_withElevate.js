import React, { useState, useRef } from "react";
import styled from "styled-components";
// import components
import { Card } from "@material-ui/core";

const Card_withElevate = (props) => {
	const [raised, setRaised] = useState(false);
	const focusRef = useRef(false);

	return (
		<StyledCard
			raised={raised}
			onMouseEnter={() => setRaised(true)}
			onMouseLeave={() =>
				setRaised(focusRef.current === true ? raised : false)
			}
			onFocus={() => {
				focusRef.current = true;
				setRaised(true);
			}}
			onBlur={() => {
				focusRef.current = false;
				setRaised(false);
			}}
		>
			{props.children}
		</StyledCard>
	);
};
export default Card_withElevate;

// ******************
// styles
// ******************

const StyledCard = styled(Card)`
	position: relative;
`;
