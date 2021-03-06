import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
// import components
import {
	CardHeader,
	CardContent,
	Grid,
	TextField,
	FormHelperText,
} from "@material-ui/core";
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
} from "@stripe/react-stripe-js";
import StripeInput from "./StripeInput";
import Card_withElevate from "../Card/Card_withElevate";
import CardActionButton from "../Card/CardActionButton";
import CartList from "../Cart/CartList";
// import store / actions / etc
import useStore from "../../store/useStore";
import { paymentIntent_create } from "../../store/actions/payment_intent";
import { cart_filterByRestaurantCheckout } from "../../store/actions/cart";
import { createOrder } from "../../store/actions/order";
import { creds_areValid } from "../../store/actions/auth";
import cookies from "../../utils/cookies";

// ******************
// component
// ******************

const CheckoutForm = ({ paymentIntent }) => {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();
	const { state, dispatch } = useStore();
	const [paymentStatus, setPaymentStatus] = useState();
	const [paymentInfo, setPaymentInfo] = useState({
		email: state?.user_current?.email || "",
		name: "",
		address: "",
		city: "",
		state: "",
		postal_code: "",
	});

	useEffect(() => {
		if (!stripe || !elements) {
			setPaymentStatus("loading");
		} else {
			setPaymentStatus("");
		}
	}, [!stripe, !elements]);

	const handleChange = (target) => (event) => {
		const updateInfo = {
			...paymentInfo,
			[target]: event.target.value,
		};
		setPaymentInfo(updateInfo);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// if stripe or elments have NOT loaded, disable submission
		if (!stripe || !elements) return;

		// TODO: need to create refresh capability for JWT
		// if credentials invalid, push router to login
		if (creds_areValid() === false) router.push("/login");

		try {
			setPaymentStatus("processing");
			const response = await stripe.confirmCardPayment(
				paymentIntent.client_secret,
				{
					payment_method: {
						card: elements.getElement(CardNumberElement),
						billing_details: {
							email: paymentInfo.email,
							name: paymentInfo.name,
							address: {
								city: paymentInfo.city,
								line1: paymentInfo.address,
								postal_code: paymentInfo.postal_code,
								state: paymentInfo.state,
							},
						},
					},
				},
			);
			console.log("Payment is processing...");

			if (response.error) {
				// show error to your customer (e.g., insufficient funds)
				console.error(response.error.message);
				setPaymentStatus("error");
			} else {
				// The payment has been processed!
				if (response.paymentIntent.status === "succeeded") {
					// Show a success message to your customer
					setPaymentStatus("success");
					console.log("Payment success!");
					// console.log("payment response:", response); // ? debug

					// add completed order to database
					const cart = await cart_filterByRestaurantCheckout(state.cart);
					// console.log("cart_filtered:", cart); // ? debug

					const transaction_id = await response.paymentIntent.id;
					// console.log("transaction_id:", transaction_id); // ? debug

					const order = await createOrder({
						user: state.user_current,
						paymentInfo,
						transaction_id,
						cart,
					});

					// destroy paymentIntent cookie to prevent future use (already succeeded)
					cookies.remove("paymentIntent_id");

					// TODO: create order confirmation page
					// push user to order confirmation page
					router.replace({
						pathname: "/checkout/success",
						query: { order: JSON.stringify(order) },
					});
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const orderButtonText = (paymentStatus) => {
		switch (paymentStatus) {
			case "loading":
				return "Wait...";
			case "processing":
				return "Processing...";
			case "success":
				return "Payment Success!";
			case "error":
				return "Try Again";
			default:
				return "Order Now";
		}
	};

	return (
		<Card_withElevate>
			<CardHeader title="Billing Information:" />
			<CardContent>
				<form id="form-billing" onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								required
								type="email"
								label="Email"
								variant="filled"
								fullWidth
								value={paymentInfo.email}
								onChange={handleChange("email")}
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								label="Full Name"
								variant="filled"
								fullWidth
								value={paymentInfo.name}
								onChange={handleChange("name")}
								autoComplete="name"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								label="Address"
								variant="filled"
								fullWidth
								value={paymentInfo.address}
								onChange={handleChange("address")}
								autoComplete="street-address"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								required
								label="City"
								variant="filled"
								fullWidth
								value={paymentInfo.city}
								onChange={handleChange("city")}
								autoComplete="address-level2"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								required
								label="State"
								variant="filled"
								fullWidth
								value={paymentInfo.state}
								onChange={handleChange("state")}
								autoComplete="address-level1"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								required
								label="Zip Code"
								variant="filled"
								fullWidth
								value={paymentInfo.postal_code}
								onChange={handleChange("postal_code")}
								autoComplete="postal-code"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								required
								InputProps={{
									inputComponent: StripeInput,
									inputProps: { component: CardNumberElement },
								}}
								InputLabelProps={{ shrink: true }}
								label="Card Number"
								variant="filled"
								fullWidth
								placeholder="4242 4242 4242 4242"
							/>
							<FormHelperText>
								Do NOT enter your real credit card info. Enter "4242
								4242 4242 4242" for testing.
							</FormHelperText>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								required
								InputProps={{
									inputComponent: StripeInput,
									inputProps: { component: CardCvcElement },
								}}
								InputLabelProps={{ shrink: true }}
								label=" "
								variant="filled"
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								required
								InputProps={{
									inputComponent: StripeInput,
									inputProps: { component: CardExpiryElement },
								}}
								InputLabelProps={{ shrink: true }}
								label="Expiry"
								variant="filled"
								fullWidth
							/>
						</Grid>
					</Grid>
				</form>
			</CardContent>
			<CardHeader title="Checkout Cart:" />
			<CardContent>
				<CartList cart="checkout" />
			</CardContent>
			<StyledCardActions>
				<CardActionButton
					color="secondary"
					variant="contained"
					type="submit"
					form="form-billing"
					disabled={
						paymentStatus === "loading" || paymentStatus === "processing"
							? true
							: false
					}
				>
					{orderButtonText(paymentStatus)}
				</CardActionButton>
				<CardActionButton onClick={() => router.back()}>
					Cancel
				</CardActionButton>
			</StyledCardActions>
		</Card_withElevate>
	);
};
export default CheckoutForm;

// ******************
// styles
// ******************

import { StyledCardActions } from "../../styles/elements";
