import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
// import components
import { CardHeader, CardContent } from "@material-ui/core";
import CardActionButton from "./CardActionButton";
import CartCardItems from "./CartCardItems";
import Card_withElevate from "./Card_withElevate";
// import icons
import { Close } from "@material-ui/icons";
// import store / actions
import useStore from "../store/useStore";
import { removeRestaurantFromCart } from "../store/actions/cart";

// ******************
// component
// ******************

const CartCard = (props) => {
	const { state, dispatch } = useStore();
	const router = useRouter();

	const displayCard = props.isEmpty ? (
		// if card has empty prop, display empty text
		<Card_withElevate>
			<CardHeader title="Cart is empty!" />
			<CardContent>Add some items to your shopping cart.</CardContent>
		</Card_withElevate>
	) : (
		// else, display full card
		<Card_withElevate key={props.restaurant.id}>
			<CardHeader
				title={
					<Flex>
						{props.restaurant.name}
						<CloseButton
							onClick={() =>
								removeRestaurantFromCart(
									props.restaurant.id,
									state,
									dispatch,
								)
							}
						>
							<Close />
						</CloseButton>
					</Flex>
				}
			/>
			<CardContent>
				<CartCardItems restaurant={props.restaurant} />
			</CardContent>
			{router.route === "/checkout/[vendor]" ? null : (
				<StyledCardActions>
					<Link
						// check if authenticated
						// redirect to login page if not
						href={state.isAuthenticated ? "/checkout/[vendor]" : "/login"}
						as={
							state.isAuthenticated
								? `/checkout/${props.restaurant.slug}`
								: null
						}
						passHref
					>
						<CardActionButton
							variant="contained"
							color="secondary"
							fullWidth
						>
							Go to Checkout
						</CardActionButton>
					</Link>
				</StyledCardActions>
			)}
		</Card_withElevate>
	);

	return <>{displayCard}</>;
};

CartCard.propTypes = {};
export default CartCard;

// ******************
// styles
// ******************

import { StyledCardActions } from "../styles/elements";

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
`;
const CloseButton = styled(CardActionButton)`
	margin-left: 2rem;

	&.MuiButton-root {
		height: min-content;
		width: min-content;
		min-width: 0;
		padding: 0.1rem;
	}
`;
