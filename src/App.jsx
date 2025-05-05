import React from 'react'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import SignIn from './pages/signin/Signin';
import Home from './pages/home/Home';
import SignUp from './pages/signup/Signup';
import "./styles/reset.scss";
import "./styles/index.scss";
import "./styles/fonts.scss";
import Orders from './pages/orders/Orders';
import Products from './pages/products/Products';
import Finances from './pages/finances/Finances';
import Providers from './pages/providers/Providers';
import Reports from './pages/reports/Reports';
import { globalStore } from './store/globalStore';
import { observer } from 'mobx-react-lite';

const PrivateLayout = () => {
	if (!localStorage.getItem('accessToken')) {
		return <Navigate to="/signin" replace />;
	}
	return <Outlet />;
};

const App = observer(() => {
	React.useEffect(() => {
		globalStore.loadToken();
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/signin' element={ <SignIn /> } />
				<Route path='/signup' element={ <SignUp /> } />
				
				<Route element={<PrivateLayout />}>
					<Route path='/' element={ <Home /> } />
					<Route path='/orders' element={ <Orders /> } />
					<Route path='/products' element={ <Products /> } />
					<Route path='/finances' element={ <Finances /> } />
					<Route path='/providers' element={ <Providers /> } />
					<Route path='/reports' element={ <Reports /> } />
				</Route>
			</Routes>
		</BrowserRouter>
	)
});

export default App;
