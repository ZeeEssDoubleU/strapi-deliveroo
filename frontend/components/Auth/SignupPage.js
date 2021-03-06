import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// import components
import {
	Container,
	CardHeader,
	CardContent,
	CardActions,
	Button,
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
import { saveCredsToCookies } from "../../store/actions/auth";
import useStore from "../../store/useStore";
import { registerUser } from "../../store/actions/auth";

// ******************
// component
// ******************
const SignupPage = (props) => {
	const router = useRouter();
	const { state, dispatch } = useStore();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: "",
		password_confirm: "",
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
		registerUser(formData, state, dispatch);
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

	return (
		<Container maxWidth="sm">
			<Card_withElevate>
				<CardHeader title="Sign Up" />
				<CardContent>
					<form id="form-signup" onSubmit={handleSubmit}>
						<Grid>
							<TextField
								label="First Name"
								variant="filled"
								value={formData.first_name}
								onChange={handleChange("first_name")}
								autoComplete="given-name"
							/>
							<TextField
								label="Last Name"
								variant="filled"
								value={formData.last_name}
								onChange={handleChange("last_name")}
								autoComplete="last-name"
							/>
							<TextField
								required
								label="Username"
								variant="filled"
								value={formData.username}
								onChange={handleChange("username")}
								autoComplete="username"
							/>
							<TextField
								required
								label="Email"
								variant="filled"
								type="email"
								value={formData.email}
								onChange={handleChange("email")}
								autoComplete="email"
							/>
							{/* custom password input */}
							<FormControl required variant="filled">
								<InputLabel htmlFor="password">Password</InputLabel>
								<FilledInput
									id="password"
									type={formData.password_show ? "text" : "password"}
									endAdornment={showPasswordIcon}
									value={formData.password}
									onChange={handleChange("password")}
									autoComplete="new-password"
								/>
							</FormControl>
							{/* custom confirm password input */}
							{/* // TODO: set up validation for confirm password */}
							<FormControl required variant="filled">
								<InputLabel htmlFor="password_confirm">
									Confirm Password
								</InputLabel>
								<FilledInput
									id="confirm-password"
									type={formData.password_show ? "text" : "password"}
									endAdornment={showPasswordIcon}
									value={formData.password_confirm}
									onChange={handleChange("password_confirm")}
									autoComplete="new-password"
								/>
							</FormControl>
						</Grid>
					</form>
				</CardContent>
				<StyledCardActions>
					<CardActionButton
						variant="contained"
						color="primary"
						form="form-signup"
						type="submit"
					>
						Register
					</CardActionButton>
					<CardActionButton color="primary" onClick={() => router.back()}>
						Go Back
					</CardActionButton>
				</StyledCardActions>
			</Card_withElevate>
		</Container>
	);
};

export default SignupPage;

// ******************
// styles
// ******************

import { StyledCardActions } from "../../styles/elements";

const Grid = styled.div`
	display: grid;
	grid-gap: ${(props) => props.theme.spacing(3) + "px"};
`;
