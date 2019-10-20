import React from 'react';
import glogo from '../assets/images/glogo.png';
// import csv from '../assets/images/csv.png';
// import xml from '../assets/images/xml.png';
// import json from '../assets/images/json.png';
import upload from '../assets/images/upload.png';
import './MainSearchBox.css'
import GSearch from './GSearch';




class MainSearchBox extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchPosTop : false,
      googleSearchQuery : '',
      uploadedData : '',
      fileName : '',
    }

    this.inputString = '';
    this.inputBoxRef = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(props){
    this.setState({searchPosTop : false});
    this.setState({googleSearchQuery : ''});
    this.inputBoxRef.current.value = '';
  }

  setSearchBarPos(){
    this.setState( {searchPosTop : true} );
  }


  getInputValue(evt){
      let inputBox = this.inputBoxRef.current.value;
      this.inputString = inputBox;
  
  }

  renderIcon(value){
    return(
      <img
        className = "icons rounded-circle"
        onClick={ () => {this.search(13)} }  //13 is the enter key code
        src = {value}
        alt = {"icon"}
        width = "30"
        height = "30"
      />
    );
  }

  renderIcons(value, id){
    return(
          <img
            className = "icons rounded-circle"
            onClick={ () => {this.search(id)} }
            src = {value}
            alt = {"icon"}
            width = "30"
            height = "30"
          />
                
    );
            
  }

  handleChange = (evt) => {
    if( !evt )
      return;
    
    let res;
    let reader = new FileReader();
    let fileName = evt.target.files[0].name;
    reader.readAsText(evt.target.files[0]);
    reader.onload = (e) => {
      res = reader.result;
      this.setState({
          googleSearchQuery : '',
          fileName : fileName,
          uploadedData : res
        });
    }
  }


  renderInputBox() {
    return (
      <div className= { this.state.searchPosTop ? "search-bar search-top" : "search-bar search-middle"}>

        <div className='icon-outer-box'>
          <div  className='icon-inner-box'>
            {this.renderIcons(glogo, 13)}
          </div>
        </div>
        <input
          ref={this.inputBoxRef}
          className="search-input"
          placeholder={"search"}
          onChange={ (evt) => { this.getInputValue(evt) } }
          onKeyDown={ (evt) => {this.search(evt.keyCode)} }
          type="text"
        />
        <div className="upload-btn-wrapper">
          <img className="upload-btn" src={upload} width = "30" height = "30" alt="icon"/>
          <input className="" onChange={(evt) => {this.handleChange(evt)}} type="file" id="input"/>
        </div>
      </div>
    );
  }
   

  search(keyCode){
    if( !keyCode )
      return;
    
    if( keyCode === 13 && this.inputString){
      this.setSearchBarPos();
      this.setState({googleSearchQuery : this.inputString});
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
        <GSearch 
          googleSearchQuery={this.state.googleSearchQuery} pageIndex={1}
          uploadedData = {this.state.uploadedData}
          fileName = {this.state.fileName}
          />
      </div>
  );



    }
}


export default MainSearchBox