import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App'
import { BrowserRouter } from 'react-router-dom'
import './index.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

class MainWindow extends React.Component{
  render() {
    return (
      <BrowserRouter>
            
            <App />
      </BrowserRouter>
    );
  }

}

ReactDOM.render( <MainWindow />, document.getElementById('root') );