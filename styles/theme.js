import { createMuiTheme } from "@material-ui/core";
import { blueGrey, deepOrange, green } from "@material-ui/core/colors";

export default createMuiTheme({
	palette: {
		primary: {
			main: blueGrey[900],
		},
		secondary: deepOrange,
		success: {
			main: blueGrey[900],
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
	drawer: {
		zIndex: 10,
	},
	button: {
		disabled: {
			color: "rgba(0, 0, 0, 0.87)",
			backgroundColor: "none",
			borderColor: "rgba(0, 0, 0, 0.23)",
			borderRightColor: "transparent",
		},
	},
	card: {
		width: "24rem",
	},
});
