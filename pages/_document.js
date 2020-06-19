import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets as StyleSheets_mui } from "@material-ui/core/styles";
import { ServerStyleSheet as StyleSheet_sc } from "styled-components";
import theme from "../styles/theme";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const styleSheet_sc = new StyleSheet_sc();
		const styleSheets_mui = new StyleSheets_mui();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						styleSheet_sc.collectStyles(
							styleSheets_mui.collect(<App {...props} />),
						),
				});

			const initialProps = await Document.getInitialProps(ctx);

			return {
				...initialProps,
				styles: [
					initialProps.styles,
					styleSheets_mui.getStyleElement(),
					styleSheet_sc.getStyleElement(),
				],
			};
		} finally {
			styleSheet_sc.seal();
		}
	}
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// *** Resolution order

// * On the server:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render

// * On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render

// * On the client:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render
