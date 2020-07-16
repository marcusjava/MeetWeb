import React, { useState } from 'react';
import { Layout } from 'antd';
import { Switch, Redirect, Route } from 'react-router-dom';
import NotFound from '../../../pages/NotFound';
import SideBar from './SideBar';
import routes from '../../../routes';
import PrivateRoute from '../../PrivateRoute';
import Breadcrumbs from '../Breadcrumbs';

const { Content, Footer } = Layout;

const DefaultLayout = () => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<SideBar />
			<Layout className="site-layout">
				<Content style={{ margin: '0 16px' }}>
					<Breadcrumbs />
					<div className="site-layout-background" style={{ padding: 24 }}>
						<Switch>
							{routes.map((route, idx) => {
								return route.Component ? (
									<PrivateRoute
										exact={route.exact}
										key={idx}
										component={route.Component}
										path={route.path}
										name={route.name}
										role={route.role}
									/>
								) : null;
							})}
						</Switch>
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>VideoConf ©2020 Created by Marcus Vinicius</Footer>
			</Layout>
		</Layout>
	);
};

export default DefaultLayout;
