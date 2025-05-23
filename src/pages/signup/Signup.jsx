import React from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { globalStore } from "../../store/globalStore";
import "../signin/auth.scss";

const SignUp = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [patronymic, setPatronymic] = React.useState("");
	const [role, setRole] = React.useState("");
	const [departament, setDepartament] = React.useState("");
	const [roleData, setRoleData] = React.useState([]);
	const [departamentData, setDepartamentData] = React.useState([]);


	const postSubmit = (e) => {
		e.preventDefault();

		if(name === "" || surname === "" || patronymic === "" || email === "" || password === "" ) {
			alert("Пожалуйста, заполните все поля");
			return;
		} else {
			axios.post("https://24stavselhozsnab.ru/user/create", 
				{
					"name": name,
					"surname": surname,
					"patronymic": patronymic,
					"email": email,
					"password": password,
					"roleId": role,
					"deportamentId": departament
				},
			).then((res) => {
				console.log(res);
				navigate("/signin");
			}).catch((err) => {
				console.log(err);
			})
		}
	}

	React.useEffect(() => {
		axios.get("https://24stavselhozsnab.ru/api/role")
			.then((res) => {
				setRoleData(res.data);
				setRole(res.data[0].id);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			})

		axios.get("https://24stavselhozsnab.ru/api/deportaments")
			.then((res) => {
				setDepartamentData(res.data);
				setDepartament(res.data[0].id);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
	}, []);

	React.useEffect(() => {
		console.log({
			"name": name,
			"surname": surname,
			"patronymic": patronymic,
			"email": email,
			"password": password,
			"roleId": role,
			"deportamentId": departament
		});
	}, [name, surname, patronymic, email, password, role, departament]);
	return (
		<div className="auth">
			<form className="auth__form" onSubmit={postSubmit}>
				<h1 className="auth__title">СТАВСЕЛЬХОЗСНАБ</h1>
				<h2 className="auth__subtitle">Регистрация</h2>
				<ul className="auth__input-list">
					<li className="auth__input-list__item">
						<label htmlFor="name">Имя</label>
						<input 
							className="input"
							id="name" 
							onChange={(e) => setName(e.target.value)}
							type="text" 
							placeholder="Введите имя" 
							required 
						/>
					</li>
					<li className="auth__input-list__item">
						<label htmlFor="surname">Фамилия</label>
						<input 
							className="input"
							id="surname" 
							onChange={(e) => setSurname(e.target.value)}
							type="text" 
							placeholder="Введите фамилию" 
							required 
						/>
					</li>
					<li className="auth__input-list__item">
						<label htmlFor="patronymic">Отчество</label>
						<input 
							className="input"
							id="patronymic" 
							onChange={(e) => setPatronymic(e.target.value)}
							type="text" 
							placeholder="Введите отчество" 
							required 
						/>
					</li>
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
					<li className="auth__input-list__item">
						<label htmlFor="role">Роль</label>
						<select 
							className="input"
							id="role" 
							onChange={(e) => setRole(Number(e.target.value))}
							type="text" 
							required 
						>
							{roleData.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
							))}
						</select>
					</li>
					<li className="auth__input-list__item">
						<label htmlFor="departament">Отдел</label>
						<select 
							className="input"
							id="departament" 
							onChange={(e) => setDepartament(Number(e.target.value))}
							type="text" 
							required 
						>
							{departamentData.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
							))}
						</select>
					</li>
				</ul>
				<span className="auth__text">У вас есть аккаунт? <Link to="/signin">Войти</Link></span>
				<button className="button auth__button">Зарегистрироваться</button>
			</form>
		</div>
	)
};

export default SignUp;
