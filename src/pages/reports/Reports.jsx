import React from "react";
import "./Reports.scss";
import axios from "axios";
import { data, Link } from "react-router-dom";

const Reports = () => {
	const [dataSales, setDataSales] = React.useState([]);
	const [dataOrders, setDataOrders] = React.useState({
		"completed": 0,
		"inProccess": 0,
		"new": 0
	});
	const [dataFinances, setDataFinances] = React.useState([]);
	const [dataProducts, setDataProducts] = React.useState([]);

	React.useEffect(() => {
		fetchDataSales();
		fetchDataOrders();
		fetchDataFinances();
		fetchDataProducts();
	}, []);
	
	const fetchDataSales = async () => {
		axios.get("https://24stavselhozsnab.ru/api/report/sales")
		.then((res) => {
			setDataSales(res.data);
			console.log(res.data);
		})
		.catch((err) => {
			console.log(err);
		})
	};

	const fetchDataOrders = async () => {
		axios.get("https://24stavselhozsnab.ru/api/report/status")
		.then((res) => {
			setDataOrders(res.data);
			console.log(res.data);
		})
		.catch((err) => {
			console.log(err);
		})
	};

	const fetchDataFinances = async () => {
		axios.get("https://24stavselhozsnab.ru/api/report/finance")
		.then((res) => {
			setDataFinances(res.data);
			console.log(res.data);
		})
		.catch((err) => {
			console.log(err);
		})
	};

	const fetchDataProducts = async () => {
		axios.get("https://24stavselhozsnab.ru/api/report/product/storage")
		.then((res) => {
			setDataProducts(res.data);
			console.log(res.data);
		})
		.catch((err) => {
			console.log(err);
		})
	};
	
  return (
    <div className="wrapper">
      <span className="home__logo">СТАВСЕЛЬХОЗСНАБ</span>
      <div className="home">
        <h1 className="home__title">Отчёты по продажам </h1>
        <h2 className="home__subtitle">Сервис для управления отчётами по продажам</h2>
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
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Дата</th>
                <th>Статус заказа </th>
                <th>Список товаров</th>
                <th>Сумма заказа</th>
              </tr>
            </thead>
            <tbody>
              {dataSales?.map((item, i) => (
                <tr key={i}>
                  <td>{item.id || "Нет"}</td>
                  <td>{item.date || "Нет"}</td>
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
                  <td>{item.summaryPrice || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
				<h1 className="home__title">Отчёты по выполнению заказов </h1>
        <h2 className="home__subtitle">Сервис для управления отчётами по выполнению заказов</h2>
				<div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Созданные заказы</th>
                <th>В процессе</th>
                <th>Выполненные заказы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dataOrders.new || 0}</td>
                <td>{dataOrders.inProccess || 0}</td>
                <td>{dataOrders.completed || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
				<h1 className="home__title">Отчёты по финансам </h1>
        <h2 className="home__subtitle">Сервис для управления отчётами по финансам</h2>
				<div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Доход</th>
                <th>Расход</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{dataFinances?.income}</td>
                  <td>{dataFinances?.expenses}</td>
                </tr>
            </tbody>
          </table>
        </div>
				<h1 className="home__title">Отчёты о запасах товаров  </h1>
        <h2 className="home__subtitle">Сервис для управления отчётами о запасах товаров</h2>
				<div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Название продукта</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
							{dataProducts?.map((item, i) => (
                <tr key={i}>
                  <td>{item.name || "Нет"}</td>
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

export default Reports;
