import React from "react";
import "./Providers.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Providers = () => {
	const [data, setData] = React.useState([]);
	const [products, setProducts] = React.useState([]);
	const [newProvider, setNewProvider] = React.useState({
		companyName: "",
		contactPeople: "",
		conditions: "",
		products: [
			{
				"providerId": 1,
      	"productId": 0
			}
		]
	});
	const [successMessage, setSuccessMessage] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		fetchData();
		fetchProducts();
	}, []);

	React.useEffect(() => {
		console.log(newProvider);
	}, [newProvider]);
	
	const fetchData = async () => {
		try {
			const res = await axios.get("https://24stavselhozsnab.ru/api/providers");
			setData(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке данных:", err);
		}
	};

	const fetchProducts = async () => {
		try {
			const res = await axios.get("https://24stavselhozsnab.ru/api/product");
			setProducts(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке продуктов:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProvider(prev => ({
			...prev,
			[name]: value
		}));
		
		if (errors[name]) {
			setErrors(prev => {
				const newErrors = {...prev};
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleProductChange = (e) => {
		const productId = parseInt(e.target.value);
		if (productId) {
			setNewProvider(prev => ({
				...prev,
				products: [...prev.products, { productId }]
			}));
		}
	};

	const removeProduct = (productId) => {
		setNewProvider(prev => ({
			...prev,
			products: prev.products.filter(p => p.productId !== productId)
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!newProvider.companyName.trim()) {
			newErrors.companyName = "Введите название компании";
		}
		
		if (!newProvider.contactPeople.trim()) {
			newErrors.contactPeople = "Введите контактное лицо";
		}

		if (!newProvider.сonditions.trim()) {
			newErrors.сonditions = "Введите условия поставки";
		}

		if (newProvider.products.length === 0) {
			newErrors.products = "Выберите хотя бы один продукт";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;
		
		setIsSubmitting(true);
		
		try {
			await axios.post("https://24stavselhozsnab.ru/api/providers", newProvider);
			setSuccessMessage("Поставщик успешно добавлен!");
			setNewProvider({
				companyName: "",
				contactPeople: "",
				сonditions: "",
				products: []
			});
			await fetchData();
			
			setTimeout(() => {
				setSuccessMessage("");
			}, 3000);
		} catch (err) {
			console.error("Ошибка при добавлении поставщика:", err);
			setErrors({
				submit: "Ошибка при добавлении поставщика. Попробуйте снова."
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="wrapper">
			<span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
			<div className="home">
				<h1 className="home__title">Поставщики</h1>
				<h2 className="home__subtitle">Сервис для управления поставщиками</h2>
				<ul className="home__nav-list">
					<li className="home__nav-list__item">
						<Link to="/">Клиенты</Link>
					</li>
					<li className="home__nav-list__item">
						<Link to="/products">Продукция</Link>
					</li>
					<li className="home__nav-list__item">
						<Link to="/orders">Заказы</Link>
					</li>
					<li className="home__nav-list__item">
						<Link to="/finances">Финансы</Link>
					</li>
					<li className="home__nav-list__item">
						<Link to="/providers">Поставщики</Link>
					</li>
					<li className="home__nav-list__item">
						<Link to="/reports">Отчёты</Link>
					</li>
				</ul>

				<form className="add-client-form" onSubmit={handleSubmit}>
					<h3>Добавить нового поставщика</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Название компании*</label>
							<input 
								type="text" 
								name="companyName" 
								placeholder="Название компании"
								value={newProvider.companyName}
								onChange={handleInputChange}
								className={errors.companyName ? "error-input" : ""}
							/>
							{errors.companyName && <span className="error-message">{errors.companyName}</span>}
						</div>
						
						<div className="form-group">
							<label>Контактное лицо*</label>
							<input 
								type="text" 
								name="contactPeople" 
								placeholder="Контактное лицо"
								value={newProvider.contactPeople}
								onChange={handleInputChange}
								className={errors.contactPeople ? "error-input" : ""}
							/>
							{errors.contactPeople && <span className="error-message">{errors.contactPeople}</span>}
						</div>
						
						<div className="form-group">
							<label>Условия поставки*</label>
							<input 
								type="text" 
								name="сonditions" 
								value={newProvider.сonditions}
								onChange={handleInputChange}
								className={errors.сonditions ? "error-input" : ""}
								placeholder="Условия поставки"
							/>
							{errors.сonditions && <span className="error-message">{errors.сonditions}</span>}
						</div>
						
						<div className="form-group">
							<label>Выберите продукты*</label>
							<select 
								onChange={handleProductChange}
								className={errors.products ? "error-input" : ""}
							>
								<option value="">Выберите продукт</option>
								{products.map(product => (
									<option key={product.id} value={product.id}>
										{product.name}
									</option>
								))}
							</select>
							{errors.products && <span className="error-message">{errors.products}</span>}
						</div>

						<div className="form-group full-width">
							<label>Выбранные продукты:</label>
							<div className="selected-products">
								{newProvider.products.map((product, index) => {
									const selectedProduct = products.find(p => p.id === product.productId);
									return selectedProduct ? (
										<div key={index} className="selected-product">
											<span>{selectedProduct.name}</span>
											<button 
												type="button" 
												onClick={() => removeProduct(product.productId)}
												className="remove-product"
											>
												×
											</button>
										</div>
									) : null;
								})}
							</div>
						</div>
						
						<button 
							type="submit" 
							className="submit-btn"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<span className="spinner"></span>
									Добавление...
								</>
							) : "Добавить поставщика"}
						</button>
						
						{successMessage && (
							<div className="success-message">
								{successMessage}
							</div>
						)}
						
						{errors.submit && (
							<div className="error-message" style={{gridColumn: "1/-1"}}>
								{errors.submit}
							</div>
						)}
					</div>
				</form>

				<div className="table-container">
					<table className="styled-table">
						<thead>
							<tr>
								<th>Название компании</th>
								<th>Контактное лицо</th>
								<th>Условия поставки</th>
								<th>Продукты</th>
							</tr>
						</thead>
						<tbody>
							{data?.map((item, i) => (
								<tr key={i}>
									<td>{item.companyName || "Нет"}</td>
									<td>{item.contactPeople || "Нет"}</td>
									<td>{item.conditions || "Нет"}</td>
									<td>
										<ul>
											{item.products?.map((product, index) => 
												<li key={index}>{product.name}</li>
											)}
										</ul>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Providers;
