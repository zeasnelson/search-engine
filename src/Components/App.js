import React from 'react';
import './App.css';
import NavBar from './NavBar';
import Router from './Router';


class App extends React.Component {
  
  render(){
    return (
      <div className="container-fluid">
        <NavBar />
        <Router />
      </div>
    );
  }
  
}

export default App;
