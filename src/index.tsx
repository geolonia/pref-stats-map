import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Hello from './Hello';
import reportWebVitals from './reportWebVitals';

import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <div style={{backgroundColor: '#ff0000'}}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/hello" element={<Hello />} />
        </Routes>
      </HashRouter>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();