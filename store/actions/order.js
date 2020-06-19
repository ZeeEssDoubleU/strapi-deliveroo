import axios from "axios";
import { setRequestHeaders } from "./auth";

export const actionTypes_cart = {
	CREATE_PAYMENT_INTENT: "CREATE_PAYMENT_INTENT",
	GET_PAYMENT_INTENT: "GET_PAYMENT_INTENT",
	UPDATE_PAYMENT_INTENT: "UPDATE_PAYMENT_INTENT",
};

export const paymentIntent_create = async (items, dispatch) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/orders/payment-intent/create`,
			items,
			setRequestHeaders(),
		);
		const paymentIntent = response.data;
		const { client_secret } = paymentIntent;

		dispatch({
			type: actionTypes_cart.CREATE_PAYMENT_INTENT,
			payload: null,
		});

		// TODO: consider only returning client secret and id
		// return payment intent client_secret
		return paymentIntent;
	} catch (error) {
		console.error(error);
	}
};
export const paymentIntent_retrieve = async (
	paymentIntent_id,
	items,
	dispatch,
) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/orders/payment-intent/retrieve`,
			{ paymentIntent_id, items },
			setRequestHeaders(),
		);
		const paymentIntent = response.data;
		const { client_secret } = paymentIntent;

		dispatch({
			type: actionTypes_cart.GET_PAYMENT_INTENT,
			payload: null,
		});

		// TODO: consider only returning client secret
		// return payment intent client_secret
		return paymentIntent;
	} catch (error) {
		console.error(error);
	}
};
export const paymentIntent_update = async (
	paymentIntent_id,
	items,
	dispatch,
) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/orders/payment-intent/update`,
			{ paymentIntent_id, items },
			setRequestHeaders(),
		);
		const paymentIntent = response.data;
		const { client_secret } = paymentIntent;

		dispatch({
			type: actionTypes_cart.UPDATE_PAYMENT_INTENT,
			payload: null,
		});

		// TODO: consider only returning client secret
		// return payment intent client_secret
		return paymentIntent;
	} catch (error) {
		console.error(error);
	}
};
