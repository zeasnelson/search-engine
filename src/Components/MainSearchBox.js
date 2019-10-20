import React from 'react';
import glogo from '../assets/images/glogo.png';
import upload from '../assets/images/upload.png';
import './MainSearchBox.css'
import GSearch from './GSearch';




class MainSearchBox extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchPosTop : false,
      googleSearchQuery : '',
    }

    this.inputString = '';
    this.inputBoxRef = React.createRef();
  }

  //this methos will be removed on the React v17, thus the reason for UNSAFE_
  UNSAFE_componentWillReceiveProps(props){
    this.setState({
      googleSearchQuery : '',
      uploadedData : '',
      fileName : '',
      searchPosTop : false,
    });
    this.inputBoxRef.current.value = '';
  }

  //set the position of the status bar
  setSearchBarPos(){
    this.setState( {searchPosTop : true} );
  }

  //read the value from the search box
  getInputValue(evt){
      let inputBox = this.inputBoxRef.current.value;
      this.inputString = inputBox;
  
  }

  //render an image
  renderIcon(value, id){
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

  //method store and pass uploaded data 
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
          fileName : fileName,
          uploadedData : res,
        });
        this.setSearchBarPos();
    }
  }

  //render the input box to search on google
  renderInputBox() {
    return (
      <div className= { this.state.searchPosTop ? "search-bar search-top" : "search-bar search-middle"}>

        <div className='icon-outer-box'>
          <div  className='icon-inner-box'>
            {this.renderIcon(glogo, 13)}
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
   

  //to save the search when the enter key is pressed on the google icon is clicked
  search(keyCode){
    if( !keyCode )
      return;
    
    if( keyCode === 13 && this.inputString){
      this.setSearchBarPos();
      this.setState({
        googleSearchQuery : this.inputString,
      });
    }

  }

  //render the searchbox
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