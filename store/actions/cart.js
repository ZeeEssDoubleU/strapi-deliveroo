export const actionTypes_cart = {
	ADD_ITEM: "ADD_ITEM",
	REMOVE_ITEM: "REMOVE_ITEM",
	REMOVE_RESTAURANT_FROM_CART: "REMOVE_RESTAURANT_FROM_CART",
};

export const getSavedCart = () =>
	JSON.parse(localStorage.getItem("cart")) || [];

export const addItem = (item, state, dispatch) => {
	dispatch({
		type: actionTypes_cart.ADD_ITEM,
		payload: item,
	});
};

export const removeItem = (item, state, dispatch) => {
	dispatch({
		type: actionTypes_cart.REMOVE_ITEM,
		payload: item,
	});
};

export const removeRestaurantFromCart = (id, state, dispatch) => {
	dispatch({
		type: actionTypes_cart.REMOVE_RESTAURANT_FROM_CART,
		payload: id,
	});
};
