'use strict';

import './main.css';

import React from 'react';
import ReactDOM form 'react-dom';
import App from './components/App.jsx';

main();

function main() {
    
    let app = document.createElement('div');

    document.body.appendChild(app);
    ReactDOM.render(<App />, app);
}
