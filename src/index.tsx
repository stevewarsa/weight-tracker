import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store/index";

ReactDOM.render(<BrowserRouter basename="/weight-tracker"><Provider store={store}><App /></Provider></BrowserRouter>, document.getElementById('root'));
