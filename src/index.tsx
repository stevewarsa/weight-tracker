import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store/index";

const { NODE_ENV } = process.env;

ReactDOM.render(
    <BrowserRouter basename={NODE_ENV && NODE_ENV === "development" ? "" : "/weight-tracker"}>
        <Provider store={store}><App /></Provider>
    </BrowserRouter>,
    document.getElementById('root'));
