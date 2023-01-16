import React from 'react';
import NavBar from './Navbar';

const ErrorPage = () => (
  <>
    <NavBar />
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Opps!</span>
          Страница не найдена
        </p>
        <p className="lead">
          Но вы всегда можете перейти на домашнюю страницу
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  </>
);

export default ErrorPage;
