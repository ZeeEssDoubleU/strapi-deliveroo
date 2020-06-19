import React, { useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
// import components
import { AppBar, Drawer, Avatar, Button, Typography } from "@material-ui/core";
import Cart from "./Cart";
// import store / utils
import useStore from "../store/useStore";
import { removeCredsFromCookies } from "../store/actions/auth";

// ******************
// component
// ******************
const Layout = (props) => {
	const { state, dispatch } = useStore();
	const currentUser = state.user_current;

	const navMenuItems = state.isAuthenticated ? (
		<>
			<Link href="/" passHref>
				<StyledButton>
					{/* TODO: need to add link to avatar pic */}
					<StyledAvatar alt={`${currentUser}'s avatar`} src="/" />
					<div>{currentUser}</div>
				</StyledButton>
			</Link>
			<StyledButton onClick={() => removeCredsFromCookies(state, dispatch)}>
				Logout
			</StyledButton>
		</>
	) : (
		<>
			<Link href="/login" passHref>
				<StyledButton>Login</StyledButton>
			</Link>
			<Link href="/signup" passHref>
				<StyledButton>Sign Up</StyledButton>
			</Link>
		</>
	);

	return (
		<Flex>
			<StyledAppBar color="primary">
				<Nav>
					<NavBrand>
						<Link href="/restaurants" passHref>
							<StyledButton className="nav-brand">
								<Typography variant="h6">Home</Typography>
							</StyledButton>
						</Link>
					</NavBrand>
					<NavMenu>{navMenuItems}</NavMenu>
				</Nav>
			</StyledAppBar>
			<Main component="main" maxWidth="xl">
				{props.children}
			</Main>
			{/* 
				// TODO: set cart drawer to persistent 
				// TODO: add toggle to cart drawer 
				// TODO: consider moving drawer component to layout 
			*/}
			<StyledDrawer variant="permanent" anchor="right">
				<Cart />
			</StyledDrawer>
			<footer></footer>
		</Flex>
	);
};

Layout.propTypes = {};

export default Layout;

// ******************
// styles
// ******************

import { Main } from "../styles/elements";
const Flex = styled.div`
	display: flex;
	flex-direction: flex;
`;
const StyledAppBar = styled(AppBar)`
	z-index: ${(props) => props.theme.drawer.zIndex + 1};
`;
const Nav = styled.nav`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const NavBrand = styled.div`
	display: flex;
	align-items: center;
`;
const NavMenu = styled.div`
	display: flex;
	align-items: center;
`;
const StyledAvatar = styled(Avatar)`
	height: 2rem;
	width: 2rem;
	margin-right: 0.5rem;
`;
const StyledButton = styled(Button)`
	height: 4rem;
	padding: 1rem;
	color: white;
`;
const StyledDrawer = styled(Drawer)`
	width: calc(${(props) => props.theme.card.width} + 2rem);
	z-index: ${(props) => props.theme.drawer.zIndex};
	.MuiDrawer-paper {
		width: calc(${(props) => props.theme.card.width} + 2rem);
	}
`;
