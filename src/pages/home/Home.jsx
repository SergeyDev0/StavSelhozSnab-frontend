import React from "react";
import "./Home.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = React.useState([]);
  const [newClient, setNewClient] = React.useState({
    companyName: "",
    concactPeople: "",
    phoneNumber: "",
    email: "",
    address: ""
  });
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const res = await axios.get("https://24stavselhozsnab.ru/api/client");
      setData(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
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
    
    if (!newClient.companyName.trim()) {
      newErrors.companyName = "Введите название компании";
    }
    
    if (!newClient.concactPeople.trim()) {
      newErrors.concactPeople = "Введите контактное лицо";
    }

		if (!newClient.email.trim()) {
      newErrors.email = "Введите эл. почту";
    }

		if (!newClient.address.trim()) {
      newErrors.address = "Введите адрес";
    }
    
    if (!newClient.phoneNumber.trim()) {
      newErrors.phoneNumber = "Введите номер телефона";
    } else if (!/^[\d\s+\-()]{7,}$/.test(newClient.phoneNumber)) {
      newErrors.phoneNumber = "Некорректный номер телефона";
    }
    
    if (newClient.email && !/^\S+@\S+\.\S+$/.test(newClient.email)) {
      newErrors.email = "Некорректный email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.post("https://24stavselhozsnab.ru/api/client", newClient);
      setSuccessMessage("Клиент успешно добавлен!");
      setNewClient({
        companyName: "",
        concactPeople: "",
        phoneNumber: "",
        email: "",
        address: ""
      });
      await fetchData();
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Ошибка при добавлении клиента:", err);
      setErrors({
        submit: "Ошибка при добавлении клиента. Попробуйте снова."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="wrapper">
      <span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
      <div className="home">
        <h1 className="home__title">Клиенты</h1>
        <h2 className="home__subtitle">Сервис для управления клиентами</h2>

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
          <h3>Добавить нового клиента</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Название компании*</label>
              <input 
                type="text" 
                name="companyName" 
								placeholder="Название компании"
                value={newClient.companyName}
                onChange={handleInputChange}
                className={errors.companyName ? "error-input" : ""}
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
            </div>
            
            <div className="form-group">
              <label>Контактное лицо*</label>
              <input 
                type="text" 
                name="concactPeople" 
								placeholder="Контактное лицо"
                value={newClient.concactPeople}
                onChange={handleInputChange}
                className={errors.concactPeople ? "error-input" : ""}
              />
              {errors.concactPeople && <span className="error-message">{errors.concactPeople}</span>}
            </div>
            
            <div className="form-group">
              <label>Телефон*</label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={newClient.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? "error-input" : ""}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
            
            <div className="form-group">
              <label>E-mail*</label>
              <input 
                type="email" 
                name="email" 
                value={newClient.email}
                onChange={handleInputChange}
                className={errors.email ? "error-input" : ""}
                placeholder="example@mail.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Адрес*</label>
              <input 
                type="text" 
                name="address" 
                value={newClient.address}
                onChange={handleInputChange}
                className={errors.address ? "error-input" : ""}
								placeholder="г. Москва"
              />
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
              ) : "Добавить клиента"}
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
                <th>Телефон</th>
                <th>E-mail</th>
                <th>Адрес</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => (
                <tr key={i}>
                  <td>{item.companyName || "Нет"}</td>
                  <td>{item.concactPeople || "Нет"}</td>
                  <td>{item.phoneNumber || "Нет"}</td>
                  <td>{item.email || "Нет"}</td>
                  <td>{item.address || "Нет"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;