import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
	const { authenticated, credentials } = useSelector((state) => state.auth.user);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (!authenticated) {
					return <Redirect to="/" />;
				}

				if (role && role.indexOf(credentials.role) === -1) {
					return <Redirect to="/home" />;
				}

				return <Component {...props} />;
			}}
		/>
	);
};

PrivateRoute.propTypes = {
	authenticated: PropTypes.bool,
};

export default PrivateRoute;
