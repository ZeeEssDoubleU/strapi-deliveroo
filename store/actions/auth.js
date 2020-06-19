import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Router from "next/router";
import axios from "axios";

export const actionTypes_auth = {
	SET_CURRENT_USER: "SET_CURRENT_USER",
};

// if token exists, apply to ALL request auth headers
// need to add this manually to all api requests
export const setRequestHeaders = () => {
	const token = Cookies.get("jwt");

	return {
		headers: token ? { Authorization: `Bearer ${token}` } : null,
	};
};

export const saveCredsToCookies = (credentials, state, dispatch) => {
	if (!process.browser) return;

	Cookies.set("user_current", credentials.user.username);
	Cookies.set("jwt", credentials.jwt);

	dispatch({
		type: actionTypes_auth.SET_CURRENT_USER,
		payload: credentials.user.username,
	});
};

export const removeCredsFromCookies = (state, dispatch) => {
	if (!process.browser) return;

	Cookies.remove("user_current");
	Cookies.remove("jwt");

	dispatch({
		type: actionTypes_auth.SET_CURRENT_USER,
		payload: null,
	});
	// to log out from all windows
	window.localStorage.setItem("logout", Date.now());

	Router.push("/login");
};

export const getUser_current = () => Cookies.get("user_current") || null;

export const loginUser = async (formData, state, dispatch) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
			formData,
			setRequestHeaders(),
		);
		const credentials = response.data;
		// console.log("response_login:", credentials);

		await saveCredsToCookies(credentials, state, dispatch);

		// navigate to restaurants page
		Router.push("/restaurants");
	} catch (error) {
		console.error(error);
	}
};
export const registerUser = async (formData, state, dispatch) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
			formData,
			setRequestHeaders(),
		);
		const credentials = response.data;
		// console.log("response_signup", credentials);

		saveCredsToCookies(credentials, state, dispatch);

		// navigate to restaurants page
		Router.push("/restaurants");
	} catch (error) {
		console.error(error.response);
	}
};
