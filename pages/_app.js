import React, { useEffect } from "react";
import { StylesProvider, CssBaseline } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
// import styles
import theme from "../styles/theme";
import ResetStyle from "../styles/reset";
import GlobalStyle from "../styles/global";
// import components
import Layout from "../components/Layout";
// import store
import { StoreProvider } from "../store/useStore";

export default ({ Component, pageProps }) => {
	// remove server side styles
	// avoids style duplication when same styles loaded by client
	const removeServerStyles = async () => {
		const jssStyles = await document.querySelector("#jss-server-side");
		jssStyles?.parentNode.removeChild(jssStyles);
	};

	useEffect(() => {
		removeServerStyles();
	}, []);

	return (
		// injectFirst injects MUI styles at top of document head so they can be overwritten
		<StylesProvider injectFirst>
			{/* mui style baseline */}
			<CssBaseline />
			<MuiThemeProvider theme={theme}>
				<ThemeProvider theme={theme}>
					<StoreProvider>
						<Layout {...pageProps}>
							<Component {...pageProps} />
						</Layout>
					</StoreProvider>
				</ThemeProvider>
			</MuiThemeProvider>
		</StylesProvider>
	);
};
