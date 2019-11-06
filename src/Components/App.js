import React from 'react';
import './App.css';
import NavBar from './NavBar';
import {Route } from 'react-router-dom'
import BrowserSpecs from './BrowserSpecs'
import MainSearchBox from './MainSearchBox'
class App extends React.Component {
  
  render(){
    return (
      
        <div className="container-fluid p-0">
            <NavBar />
            <Route exact path='/' component={MainSearchBox}/>
            <Route path='/browserspecs' component={BrowserSpecs}/>
        </div>
    );
  }
  
}

export default App;
