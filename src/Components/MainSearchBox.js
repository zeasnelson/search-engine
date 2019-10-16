import React from 'react';
import glogo from '../assets/images/glogo.png';
import csv from '../assets/images/csv.png';
import xml from '../assets/images/csv.png';
import json from '../assets/images/json.png';
import './MainSearchBox.css'
import GSearch from './GSearch';


class MainSearchBox extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchPosTop : false,
      searchQuery : '',
    }

    this.inputString = '';
    this.inputBoxRef = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(props){
    this.setState({searchPosTop : false});
    this.setState({searchQuery : ''});
    this.inputBoxRef.current.value = '';
  }

  setSearchBarPos(){
    this.setState( {searchPosTop : true} );
  }


  getInputValue(evt){
      let inputBox = this.inputBoxRef.current.value;
      this.inputString = inputBox;
  
  }

  renderIcons(){
    let icons = [glogo, csv, json, xml];
    //let components = ['GSearch', 'CSV', 'JSON', 'XML'];
    let imgs = [];
  
    for (const [index, value] of icons.entries()) {
      imgs.push(  <div className='icon-outer-box' key={index}>
                    <div  className='icon-inner-box'>
                      <img
                        className = "icons rounded-circle"
                        onClick={ () => {this.search(13)} }
                        src = {value}
                        alt = {"icon"}
                        width = "30"
                        height = "30"
                      />
                    </div>
                  </div>
                );
    }
    return imgs;
  }

  renderInputBox() {
    return (
      <div className= { this.state.searchPosTop ? "search-bar search-top" : "search-bar search-middle"}>
        <input
          ref={this.inputBoxRef}
          className="search-input"
          placeholder={"search"}
          onChange={ (evt) => { this.getInputValue(evt) } }
          onKeyDown={ (evt) => {this.search(evt.keyCode)} }
          type="text"
        />
        {this.renderIcons()}
      </div>
    );
  }
   
  search(keyCode){
    
    if( keyCode && keyCode === 13 ){
      this.setSearchBarPos();
      this.setState({searchQuery : this.inputString});
    }
  }

  render() {
    return (
      <div className='container'>
        <div className="row h-100">
          <div className="col-sm-12">
            <div className="d-flex justify-content-center">
              <div className = "search-box" >
                {this.renderInputBox()}
                <div className='checkbox-outerbox'>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GSearch value={this.state.searchQuery} pageIndex={1}/>
      </div>
  );



    }
}


export default MainSearchBox