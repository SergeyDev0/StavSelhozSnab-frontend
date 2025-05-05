import React from "react";
import "./Products.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
	const [data, setData] = React.useState([]);
	const [newProduct, setNewProduct] = React.useState({
		name: "",
		code: "",
		measure: "",
		price: "",
		inStorage: ""
	});
	const [successMessage, setSuccessMessage] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		fetchData();
	}, []);
	
	const fetchData = async () => {
		try {
			const res = await axios.get("http://localhost:5188/api/product");
			setData(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке данных:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct(prev => ({
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

	const validateForm = () => {
		const newErrors = {};
		
		if (!newProduct.name.trim()) {
			newErrors.name = "Введите название продукта";
		}
		
		if (!newProduct.code.trim()) {
			newErrors.code = "Введите код продукта";
		}

		if (!newProduct.measure.trim()) {
			newErrors.measure = "Введите единицу измерения";
		}

		if (!newProduct.price.trim()) {
			newErrors.price = "Введите цену";
		} else if (isNaN(newProduct.price) || parseFloat(newProduct.price) <= 0) {
			newErrors.price = "Введите корректную цену";
		}

		if (!newProduct.inStorage.trim()) {
			newErrors.inStorage = "Введите количество";
		} else if (isNaN(newProduct.inStorage) || parseInt(newProduct.inStorage) < 0) {
			newErrors.inStorage = "Введите корректное количество";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;
		
		setIsSubmitting(true);
		
		try {
			await axios.post("http://localhost:5188/api/product", newProduct);
			setSuccessMessage("Продукт успешно добавлен!");
			setNewProduct({
				name: "",
				code: "",
				measure: "",
				price: "",
				inStorage: ""
			});
			await fetchData();
			
			setTimeout(() => {
				setSuccessMessage("");
			}, 3000);
		} catch (err) {
			console.error("Ошибка при добавлении продукта:", err);
			setErrors({
				submit: "Ошибка при добавлении продукта. Попробуйте снова."
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	
  return (
    <div className="wrapper">
      <span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
      <div className="home">
        <h1 className="home__title">Продукция</h1>
        <h2 className="home__subtitle">Сервис для управления продукцией</h2>
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
					<h3>Добавить новый продукт</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Название продукта*</label>
							<input 
								type="text" 
								name="name" 
								placeholder="Название продукта"
								value={newProduct.name}
								onChange={handleInputChange}
								className={errors.name ? "error-input" : ""}
							/>
							{errors.name && <span className="error-message">{errors.name}</span>}
						</div>
						
						<div className="form-group">
							<label>Код продукта*</label>
							<input 
								type="text" 
								name="code" 
								placeholder="Код продукта"
								value={newProduct.code}
								onChange={handleInputChange}
								className={errors.code ? "error-input" : ""}
							/>
							{errors.code && <span className="error-message">{errors.code}</span>}
						</div>
						
						<div className="form-group">
							<label>Единица измерения*</label>
							<input 
								type="text" 
								name="measure" 
								value={newProduct.measure}
								onChange={handleInputChange}
								className={errors.measure ? "error-input" : ""}
								placeholder="шт., кг, л"
							/>
							{errors.measure && <span className="error-message">{errors.measure}</span>}
						</div>
						
						<div className="form-group">
							<label>Цена*</label>
							<input 
								type="number" 
								name="price" 
								value={newProduct.price}
								onChange={handleInputChange}
								className={errors.price ? "error-input" : ""}
								placeholder="0"
								step="1"
							/>
							{errors.price && <span className="error-message">{errors.price}</span>}
						</div>
						
						<div className="form-group full-width">
							<label>Количество*</label>
							<input 
								type="number" 
								name="inStorage" 
								value={newProduct.inStorage}
								onChange={handleInputChange}
								className={errors.inStorage ? "error-input" : ""}
								placeholder="0"
							/>
							{errors.inStorage && <span className="error-message">{errors.inStorage}</span>}
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
							) : "Добавить продукт"}
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
                <th>Название продукта</th>
                <th>Код</th>
                <th>Ед. изм.</th>
                <th>Цена</th>
                <th>Кол-во</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i}>
                  <td>{item.name || "Нет"}</td>
                  <td>{item.code || "Нет"}</td>
                  <td>{item.measure || "Нет"}</td>
                  <td>{item.price || "Нет"} руб.</td>
                  <td>{item.inStorage || "Нет"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
