import axios from "axios";
import styled from "styled-components";
// import components
import RestaurantPage from "../../components/Restaurants/RestaurantPage";

// ******************
// component
// ******************

export default ({ restaurant, dishes }) => {
	return <RestaurantPage restaurant={restaurant} dishes={dishes} />;
};

// ******************
// initial props & paths
// ******************

// This function gets called at build time
export const getStaticPaths = async () => {
	// call an external API endpoint to get posts
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
		);
		const restaurants = response.data;
		console.log("get restaurants...");

		// get the paths we want to pre-render based on posts
		const paths = restaurants.map((restaurant) => ({
			params: { restaurant: restaurant.slug },
		}));

		// pre-render only these paths at build time.
		// { fallback: false } means other routes should 404.
		return { paths, fallback: false };
	} catch (error) {
		console.error(error);
	}
};

export const getStaticProps = async ({ params }) => {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${params.restaurant}`,
		);
		const restaurant = response.data;
		console.log("build restaurant...");

		const dishes = response.data.dishes;
		console.log("build dishes...");

		return {
			props: {
				restaurant,
				dishes,
			},
		};
	} catch (error) {
		console.error(error);
	}
};
