import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import { ButtonGroup, Button, Typography } from "@material-ui/core";
// import store
import useStore from "../store/useStore";
import { addItem, removeItem } from "../store/actions/cart";

// ******************
// component
// ******************

const CardCardItems = ({ restaurant }) => {
	const { state, dispatch } = useStore();

	return (
		<Grid>
			<Typography variant="h6" gutterBottom>
				Items:
			</Typography>
			{restaurant.items.map((item) => (
				<div key={item.id}>
					<GridBetween>
						<Typography>{item.name}</Typography>
						<Typography>
							{item.quantity} x ${item.price}
						</Typography>
					</GridBetween>
					<GridLeft>
						<ButtonGroup>
							<ItemCountButton
								onClick={() => {
									const dish = item;
									const payload = { dish, restaurant };
									removeItem(payload, state, dispatch);
								}}
							>
								-
							</ItemCountButton>
							<ItemCount disabled>{item.quantity}</ItemCount>
							<ItemCountButton
								onClick={() => {
									const dish = item;
									const payload = { dish, restaurant };
									addItem(payload, state, dispatch);
								}}
							>
								+
							</ItemCountButton>
						</ButtonGroup>
					</GridLeft>
				</div>
			))}
			<GridBetween>
				<Typography variant="h6">Total:</Typography>
				<Typography variant="h6">${restaurant.items_total}</Typography>
			</GridBetween>
		</Grid>
	);
};

CardCardItems.propTypes = {};
export default CardCardItems;

// ******************
// styles
// ******************

const Grid = styled.div`
	display: grid;
	grid-gap: ${(props) => props.theme.spacing(2) + "px"};
`;
const GridBetween = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	grid-gap: ${(props) => props.theme.spacing(2) + "px"};
	justify-content: space-between;
`;
const GridLeft = styled.div`
	display: grid;
	justify-content: left;
`;
const ItemCountButton = styled(Button)`
	&.MuiButton-root {
		/* set min-width because server side rendering messing up styling */
		min-width: 0;
	}
	height: 1.5rem;
`;
const ItemCount = styled(ItemCountButton)`
	&.Mui-disabled {
		color: ${(props) => props.theme.button.disabled.color};
		border-color: ${(props) => props.theme.button.disabled.borderColor};
		border-right-color: ${(props) =>
			props.theme.button.disabled.borderRightColor};
	}
`;
