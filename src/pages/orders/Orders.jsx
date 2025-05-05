import React from "react";
import "./Orders.scss";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { globalStore } from "../../store/globalStore";

const Orders = () => {
	const [data, setData] = React.useState([]);
	const [products, setProducts] = React.useState([]);
	const [clients, setClients] = React.useState([]);
	const [selectedClientId, setSelectedClientId] = React.useState("");
	const [newOrder, setNewOrder] = React.useState([]);
	const [successMessage, setSuccessMessage] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		fetchData();
		fetchProducts();
		fetchClients();
	}, []);
	
	const fetchData = async () => {
		try {
			const res = await axios.get("/order");
			setData(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке заказов:", err);
		}
	};

	const fetchProducts = async () => {
		try {
			const res = await axios.get("/product");
			setProducts(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке продуктов:", err);
		}
	};

	const fetchClients = async () => {
		try {
			const res = await axios.get("/client");
			setClients(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке клиентов:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "clientId") {
			setSelectedClientId(value);
		}
		
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
		const product = products.find(p => p.id === productId);
		
		if (product) {
			setNewOrder(prev => [
				...prev,
				{
					orderId: 0,
					productId: product.id,
					count: 1
				}
			]);
		}
	};

	const removeProduct = (index) => {
		setNewOrder(prev => prev.filter((_, i) => i !== index));
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!selectedClientId) {
			newErrors.clientId = "Выберите клиента";
		}
		
		if (newOrder.length === 0) {
			newErrors.products = "Добавьте хотя бы один товар";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;
		
		setIsSubmitting(true);
		
		try {
			await axios.post(`/order/${Number(selectedClientId)}`, newOrder);
			setSuccessMessage("Заказ успешно создан!");
			setNewOrder([]);
			setSelectedClientId("");
			await fetchData();
			
			setTimeout(() => {
				setSuccessMessage("");
			}, 3000);
		} catch (err) {
			console.error("Ошибка при создании заказа:", err);
			setErrors({
				submit: "Ошибка при создании заказа. Попробуйте снова."
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	
  return (
    <div className="wrapper">
      <span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
      <div className="home">
        <h1 className="home__title">Заказы</h1>
        <h2 className="home__subtitle">Сервис для управления заказами</h2>
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
					<h3>Создать новый заказ</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Выберите клиента*</label>
							<select 
								name="clientId"
								value={selectedClientId}
								onChange={handleInputChange}
								className={errors.clientId ? "error-input" : ""}
							>
								<option value="">Выберите клиента</option>
								{clients.map((client, i) => (
									<option key={i} value={client.id}>
										{client.companyName}
									</option>
								))}
							</select>
							{errors.clientId && <span className="error-message">{errors.clientId}</span>}
						</div>
						
						<div className="form-group">
							<label>Добавить товар</label>
							<select 
								onChange={handleProductChange}
								className={errors.products ? "error-input" : ""}
							>
								<option value="">Выберите товар</option>
								{products.map(product => (
									<option key={product.id} value={product.id}>
										{product.name} - {product.price} руб.
									</option>
								))}
							</select>
							{errors.products && <span className="error-message">{errors.products}</span>}
						</div>

						{newOrder.length > 0 && (
							<div className="form-group full-width">
								<label>Выбранные товары:</label>
								<ul className="selected-products">
									{newOrder?.map((product, index) => (
										<li key={index}>
											{products.find(p => p.id === product.productId)?.name} - {product.count} шт.
											<button 
												type="button" 
												onClick={() => removeProduct(index)}
												className="remove-product"
											>
												✕
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
						
						<button 
							type="submit" 
							className="submit-btn"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<span className="spinner"></span>
									Создание...
								</>
							) : "Создать заказ"}
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
                <th>Номер заказа</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Статус заказа</th>
                <th>Список товаров</th>
                <th>Сумма заказа</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i}>
                  <td>{item.id || "Нет"}</td>
                  <td>{new Date(item.date).toLocaleDateString() || "Нет"}</td>
                  <td>{clients.find(c => c.id === item.userId)?.companyName || "Нет"}</td>
                  <td>{item.orderStatus || "Нет"}</td>
                  <td>
                    <ul>
											{item.products?.map((product, index) => (
												<li key={index}>
													- {product.name}
												</li>
											))}
										</ul>
                  </td>
                  <td>{item.summaryPrice || "Нет"} руб.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
