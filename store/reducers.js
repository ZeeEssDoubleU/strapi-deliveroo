import isEmpty from "lodash/fp/isEmpty";
import Cookies from "js-cookie";
// import actions / utils
import { actionTypes_auth, getUser_current } from "./actions/auth";
import { actionTypes_cart, getSavedCart } from "./actions/cart";
import { Restaurant } from "@material-ui/icons";

// ******************
// initial state
// ******************
export const initState =
	typeof window !== "undefined"
		? {
				isAuthenticated: !isEmpty(getUser_current()),
				user_current: getUser_current(),
				cart: getSavedCart(),
		  }
		: {};

// ******************
// root reducer
// ******************
export const reducer_root = (state, action) => {
	console.log("action:", action);

	switch (action.type) {
		// *** auth actions
		case actionTypes_auth.SET_CURRENT_USER:
			return {
				...state,
				user_current: action.payload,
				isAuthenticated: !isEmpty(action.payload), // if no user, set to false
			};
		// *** cart actions
		case actionTypes_cart.ADD_ITEM:
			return {
				...state,
				cart: reducer_addItem(state.cart, action.payload),
			};
		case actionTypes_cart.REMOVE_ITEM:
			return {
				...state,
				cart: reducer_removeItem(state.cart, action.payload),
			};
		case actionTypes_cart.REMOVE_RESTAURANT_FROM_CART:
			return {
				...state,
				cart: reducer_removedRestaurant(state.cart, action.payload),
			};
		default:
			return state;
	}
};

// ******************
// sub reducers
// ******************

// TODO: NEED TO MAKE SURE CART ACTIONS CANT BE PERFOMED WITHOUT BEING AUTHENTICATED.  ISAUTHENTICATED = TRUE
// *** add item
const reducer_addItem = (cart, payload) => {
	const { dish, restaurant } = payload;
	const newItem = {
		id: dish.id,
		name: dish.name,
		price: dish.price,
		quantity: 1,
	};
	const newRestaurant = {
		id: restaurant.id,
		name: restaurant.name,
		slug: restaurant.slug,
		items: [],
		items_total: 0,
	};

	// check if restaurant has been added to cart
	const restaurantExists = cart.find(
		(restaurant) => restaurant.id === newRestaurant.id,
	);

	// set restaurant to update
	const updateRestaurant = restaurantExists ? restaurantExists : newRestaurant;

	// check if item has been added to existing restaurant
	const itemExists = updateRestaurant.items.find(
		(item) => item.id === newItem.id,
	);

	// UPDATE restaurant cart items
	updateRestaurant.items = !itemExists
		? // if newItem NOT already added, add to restaurant cart
		  [...updateRestaurant.items, newItem]
		: // if newItem already added, find match and increment quantity +1
		  updateRestaurant.items.map((item) => {
				if (item.id === newItem.id) {
					item.quantity += 1;
					return item;
				} else {
					return item;
				}
		  });

	// UPDATE restaurant cart total cost
	updateRestaurant.items_total = updateRestaurant.items_total + newItem.price;

	// UPDATE global cart with updated restaurant cart
	const updateCart = restaurantExists
		? // if restaurant already added, find match and update restaurant
		  cart.map((restaurant) =>
				restaurant.id === updateRestaurant.id
					? updateRestaurant
					: restaurant,
		  )
		: // if restaurant NOT already added, add to cart
		  [...cart, updateRestaurant];

	localStorage.setItem("cart", JSON.stringify(updateCart));
	return updateCart;
};

// *** remove item
const reducer_removeItem = (cart, payload) => {
	const { dish, restaurant } = payload;
	const removeItem = { id: dish.id };
	const removeRestaurant = { id: restaurant.id };

	// check if restaurant has been added to cart
	const restaurantExists = cart.find(
		(restaurant) => restaurant.id === removeRestaurant.id,
	);

	// set restaurant to update
	const updateRestaurant = restaurantExists;

	// check if item has been added to existing restaurant
	const itemExists = updateRestaurant.items.find(
		(item) => item.id === removeItem.id,
	);

	// UPDATE restaurant cart items
	updateRestaurant.items =
		itemExists.quantity === 1
			? // if there is only 1 item, remove the item completely
			  updateRestaurant.items.filter((item) => item.id !== removeItem.id)
			: // if there is MORE than 1 of the item, decrement by 1
			  updateRestaurant.items.map((item) => {
					if (item.id === removeItem.id) {
						item.quantity -= 1;
						return item;
					} else {
						return item;
					}
			  });

	// UPDATE restaurant cart total cost
	updateRestaurant.items_total =
		updateRestaurant.items_total - itemExists.price;

	// UPDATE global cart with updated restaurant cart
	const updateCart = cart
		.map((restaurant) =>
			// UPDATE corresponding restaurant
			restaurant.id === updateRestaurant.id ? updateRestaurant : restaurant,
		)
		// REMOVE any restaurants from cart that don't have items
		.filter((restaurant) => restaurant.items.length > 0);

	localStorage.setItem("cart", JSON.stringify(updateCart));
	return updateCart;
};

// *** remove restaurant from cart
const reducer_removedRestaurant = (cart, payload) => {
	const id = payload;
	const updateCart = cart.filter((restaurant) => restaurant.id !== id);

	localStorage.setItem("cart", JSON.stringify(updateCart));
	return updateCart;
};
