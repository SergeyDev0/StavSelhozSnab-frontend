import React from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { globalStore } from "../../store/globalStore";
import "./auth.scss";

const SignIn = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const postSubmit = (e) => {
		e.preventDefault();

		if(email === "" || password === "") {
			alert("Пожалуйста, заполните все поля");
			return;
		} else {
			axios.post("https://24stavselhozsnab.ru/api/user/login", 
				{
					"email": email,
					"password": password,
				},
			)
			.then((res) => {
				console.log(res);
				globalStore.saveToken(res.data.accessToken);
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
			})	
		}
	}
	return (
		<div className="auth">
			<form className="auth__form" onSubmit={postSubmit}>
				<h1 className="auth__title">СТАВСЕЛЬХОЗСНАБ</h1>
				<h2 className="auth__subtitle">Авторизация</h2>
				<ul className="auth__input-list">
					<li className="auth__input-list__item">
						<label htmlFor="email">Эл. почта</label>
						<input 
							className="input"
							id="email" 
							onChange={(e) => setEmail(e.target.value)}
							type="text" 
							placeholder="Введите почту" 
							required 
						/>
					</li>
					<li className="auth__input-list__item">
						<label htmlFor="password">Пароль</label>
						<input 
							className="input"
							autoComplete="current-password"
							id="password" 
							onChange={(e) => setPassword(e.target.value)}
							type="password" 
							placeholder="Введите пароль" 
							required 
						/>
					</li>
				</ul>
				<span className="auth__text">У вас нет аккаунта? <Link to="/signup">Зарегистрироваться</Link></span>
				<button className="button auth__button">Войти</button>
			</form>
		</div>
	)
};

export default SignIn;
