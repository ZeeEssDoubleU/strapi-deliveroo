import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useReducer,
} from "react";
import isEmpty from "lodash/fp/isEmpty";
import Cookies from "js-cookie";
// import actions / reducers / utils
import { actionTypes_auth, getUser_current } from "./actions/auth";
import { actionTypes_cart, updateCheckout } from "./actions/cart";
import { reducer_root, initState } from "./reducers";

// ! this causing render error on logout button.  May need to move initial logic to useEffect in StoreProvider
const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer_root, initState);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};

// useStore hook.  Acts as Consumer through useContext
export default () => {
	const { state, dispatch } = useContext(StoreContext);
	return { state, dispatch };
};
