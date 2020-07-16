import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GameApp from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <GameApp />,
    document.getElementById('root'),
);
serviceWorker.register();