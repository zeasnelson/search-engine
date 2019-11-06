import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App'
import './index.css';
import { HashRouter} from 'react-router-dom'
let CreateHashHistory = require("history").createBrowserHistory;

const hashHistory = CreateHashHistory({basename: process.env.PUBLIC_URL})

class MainWindow extends React.Component{
  render() {
    return (
      <HashRouter basename='/'>
        <App />
      </HashRouter>
    );
  }

}

ReactDOM.render( <MainWindow />, document.getElementById('root') );