import React from "react";
import "./Finances.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Finances = () => {
	const [data, setData] = React.useState([]);
	const [newFinance, setNewFinance] = React.useState({
		type: "income",
		summary: "",
		responsiblePerson: ""
	});
	const [successMessage, setSuccessMessage] = React.useState("");
	const [errors, setErrors] = React.useState({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		fetchData();
	}, []);
	
	const fetchData = async () => {
		try {
			const res = await axios.get("http://localhost:5188/api/finance");
			setData(res.data);
		} catch (err) {
			console.error("Ошибка при загрузке данных:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewFinance(prev => ({
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
		
		if (!newFinance.type) {
			newErrors.type = "Выберите тип операции";
		}
		
		if (!newFinance.summary.trim()) {
			newErrors.summary = "Введите сумму";
		} else if (isNaN(newFinance.summary) || parseFloat(newFinance.summary) <= 0) {
			newErrors.summary = "Введите корректную сумму";
		}

		if (!newFinance.responsiblePerson.trim()) {
			newErrors.responsiblePerson = "Введите ответственное лицо";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;
		
		setIsSubmitting(true);
		
		try {
			const financeData = {
				...newFinance,
				createdAt: new Date().toISOString()
			};

			await axios.post("http://localhost:5188/api/finance", financeData);
			setSuccessMessage("Финансовая запись успешно добавлена!");
			setNewFinance({
				type: "income",
				summary: "",
				responsiblePerson: ""
			});
			await fetchData();
			
			setTimeout(() => {
				setSuccessMessage("");
			}, 3000);
		} catch (err) {
			console.error("Ошибка при добавлении финансовой записи:", err);
			setErrors({
				submit: "Ошибка при добавлении финансовой записи. Попробуйте снова."
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	
  return (
    <div className="wrapper">
      <span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
      <div className="home">
        <h1 className="home__title">Финансы</h1>
        <h2 className="home__subtitle">Сервис для управления финансами</h2>
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
					<h3>Добавить финансовую запись</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Тип операции*</label>
							<select 
								name="type" 
								value={newFinance.type}
								onChange={handleInputChange}
								className={errors.type ? "error-input" : ""}
							>
								<option value="income">Доход</option>
								<option value="expenses">Расход</option>
							</select>
							{errors.type && <span className="error-message">{errors.type}</span>}
						</div>
						
						<div className="form-group">
							<label>Сумма*</label>
							<input 
								type="number" 
								name="summary" 
								value={newFinance.summary}
								onChange={handleInputChange}
								className={errors.summary ? "error-input" : ""}
								placeholder="0.00"
								step="0.01"
							/>
							{errors.summary && <span className="error-message">{errors.summary}</span>}
						</div>
						
						<div className="form-group full-width">
							<label>Ответственное лицо*</label>
							<input 
								type="text" 
								name="responsiblePerson" 
								value={newFinance.responsiblePerson}
								onChange={handleInputChange}
								className={errors.responsiblePerson ? "error-input" : ""}
								placeholder="ФИО"
							/>
							{errors.responsiblePerson && <span className="error-message">{errors.responsiblePerson}</span>}
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
							) : "Добавить запись"}
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
                <th>Расходы/Доходы</th>
                <th>Сумма</th>
                <th>Дата операции</th>
                <th>Ответственное лицо</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i}>
                  <td>{item.type === "income" ? "Доход" : "Расход" || "Нет"}</td>
                  <td>{item.summary || "Нет"}</td>
                  <td>{item.createdAt || "Нет"}</td>
                  <td>{item.responsiblePerson || "Нет"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finances;
