import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Router, { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
// import components
import CheckoutForm from "../../components/CheckoutForm";
import { Elements as StripeElementsProvider } from "@stripe/react-stripe-js";
// import store / actions
import useStore from "../../store/useStore";
import {
	paymentIntent_create,
	paymentIntent_retrieve,
	paymentIntent_update,
} from "../../store/actions/order";
import { setRequestHeaders } from "../../store/actions/auth";

// ******************
// component
// ******************

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// TODO: think this will just have to come from env var on server
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_P_KEY);

const checkout = (props) => {
	const router = useRouter();
	const { state, dispatch } = useStore();
	// retrieve paymentIntent as soon as checkout opened to track sales funnel
	const [paymentIntent, setPaymentIntent] = useState();

	const filterCart = async () => {
		// grab page slug for cart filtering
		// use window.location instead of router because router incorrect on page refresh
		// will work, because router.route confirmed below in useEffect
		const vendorCheckoutSlug = window.location.pathname.split("/")[2];

		// declare checkout items
		const restaurant = await state.cart?.filter(
			(restaurant) => restaurant.slug === vendorCheckoutSlug,
		);
		const items = await restaurant[0]?.items;
		return items;
	};

	const getPaymentIntent = async () => {
		const items = await filterCart();

		// check if payment intent already exists
		const paymentIntent_id = await Cookies.get("paymentIntent_id");
		let paymentIntent;

		// if intent exists, GET payment intent
		if (paymentIntent_id) {
			paymentIntent = await paymentIntent_retrieve(
				paymentIntent_id,
				items,
				dispatch,
			);
		}
		// it no intent, CREATE payment intent
		else {
			paymentIntent = await paymentIntent_create(items, dispatch);

			// set payment intent id to cookie for future retrieval
			Cookies.set("paymentIntent_id", paymentIntent.id);
		}

		setPaymentIntent(paymentIntent);
	};

	useEffect(() => {
		// redirect login if not logged in
		if (!state.isAuthenticated) {
			Router.push("/login");
		}
		// redirect to restaurants if no cart
		else if (state.cart.length === 0) {
			Router.back();
		}
	}, []);

	useEffect(() => {
		if (router.route === "/checkout/[vendor]") {
			getPaymentIntent();
		}
	}, [router.route, state.cart]);

	return (
		<StripeElementsProvider stripe={stripePromise}>
			<CheckoutForm paymentIntent={paymentIntent} />
		</StripeElementsProvider>
	);
};
checkout.propTypes = {};
export default checkout;
