import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// import components
import {
	Container,
	CardHeader,
	CardContent,
	FormControl,
	FilledInput,
	InputLabel,
	InputAdornment,
	TextField,
	IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Card_withElevate from "../Card/Card_withElevate";
import CardActionButton from "../Card/CardActionButton";
// import store / utils
import useStore from "../../store/useStore";
import { loginUser } from "../../store/actions/auth";

// ******************
// component
// ******************
const LoginPage = (props) => {
	const { state, dispatch } = useStore();
	const [formData, setFormData] = useState({
		identifier: "",
		password: "",
		password_show: false,
	});

	const handleChange = (target) => (event) => {
		const updateData = {
			...formData,
			[target]: event.target.value,
		};
		setFormData(updateData);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		loginUser(formData, state, dispatch);
	};

	const showPasswordIcon = (
		<InputAdornment position="end">
			<IconButton
				aria-label="toggle password visibility"
				edge="end"
				onClick={() =>
					setFormData({
						...formData,
						password_show: !formData.password_show,
					})
				}
			>
				{formData.password_show ? <Visibility /> : <VisibilityOff />}
			</IconButton>
		</InputAdornment>
	);

	// TODO: consider adding other provider logins (ie facebook, google, etc)
	return (
		<Container maxWidth="sm">
			<Card_withElevate>
				<CardHeader title="Login" />
				<CardContent>
					{/* // TODO: need to add form validation (possibly show feedback below fields) */}
					<form id="form-login" onSubmit={handleSubmit}>
						<Grid>
							<TextField
								required
								label="Email"
								variant="filled"
								type="email"
								value={formData.identifier}
								onChange={handleChange("identifier")}
								autoComplete="email"
							/>
							{/* custom password input */}
							<FormControl required fullWidth variant="filled">
								<InputLabel htmlFor="password">Password</InputLabel>
								<FilledInput
									id="password"
									type={formData.password_show ? "text" : "password"}
									endAdornment={showPasswordIcon}
									value={formData.password}
									onChange={handleChange("password")}
									autoComplete="existing-password"
								/>
							</FormControl>
						</Grid>
					</form>
				</CardContent>
				<StyledCardActions>
					<CardActionButton
						variant="contained"
						color="primary"
						form="form-login"
						type="submit"
					>
						Login
					</CardActionButton>
					<Link href="/signup" passHref>
						<CardActionButton color="primary">Sign Up</CardActionButton>
					</Link>
				</StyledCardActions>
			</Card_withElevate>
		</Container>
	);
};

export default LoginPage;

// ******************
// styles
// ******************

import { StyledCardActions } from "../../styles/elements";

const Grid = styled.div`
	display: grid;
	grid-gap: ${(props) => props.theme.spacing(3) + "px"};
`;
