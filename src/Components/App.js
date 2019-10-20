import React from 'react';
import './App.css';
import NavBar from './NavBar';
import Router from './Router';


class App extends React.Component {
  
  render(){
    return (
      <div className="container-fluid p-0">
        <NavBar />
        <Router />
      </div>
    );
  }
  
}

export default App;
