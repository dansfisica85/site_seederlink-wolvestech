import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Aqui eu encontro a div #root do index.html e inicio toda a aplicação React.
// O StrictMode me ajuda a perceber efeitos colaterais durante o desenvolvimento.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
