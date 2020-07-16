import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './redux/store';
import { toastr } from 'react-redux-toastr';
import jwtDecode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logout } from './redux/actions/userActions';
import DefaultLayout from './components/layout/DefaultLayout';
import NotFound from './pages/NotFound';

if (localStorage.getItem('token')) {
	const token = localStorage.getItem('token');
	setAuthToken(token);
	const decoded = jwtDecode(token);
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		store.dispatch(logout());
		window.location.href = '/';
	}
	store.dispatch(setCurrentUser(decoded));
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
	(config) => {
		if (!config.url.endsWith('/login')) {
			const token = localStorage.getItem('token');
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			if (decoded.exp < currentTime) {
				store.dispatch(logout());
				window.location.href = '/';
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			toastr.error('Sessão expirada faça login novamente');
			store.dispatch(logout());
			window.location.href = '/';
		}

		return Promise.reject(error);
	}
);

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path="/home" component={DefaultLayout} />
						<Route path="/404" component={NotFound} />
						<Redirect to="404" />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
