import React from 'react';
import glogo from '../assets/images/glogo.png';
import csv from '../assets/images/csv.png';
import xml from '../assets/images/xml.png';
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

  renderUploadIcons(){
    let icons = [csv, json, xml];
    //let components = ['GSearch', 'CSV', 'JSON', 'XML'];
    let imgs = [];
  
    for (const [index, value] of icons.entries()) {
      imgs.push( <div className='icon-outer-box' key={index}> 
                    <div className='icon-inner-box' >
                        {this.renderIcon(value)}
                    </div>
                  </div>
                );
    }
    return imgs;
  }

  renderInputBox() {
    return (
      <>
        <div className= { this.state.searchPosTop ? "search-bar search-top" : "search-bar search-middle"}>
          <input
            ref={this.inputBoxRef}
            className="search-input"
            placeholder={"search"}
            onChange={ (evt) => { this.getInputValue(evt) } }
            onKeyDown={ (evt) => {this.search(evt.keyCode)} }
            type="text"
          />
            <div className='icon-outer-box'>
              <div  className='icon-inner-box'>
                {this.renderIcon(glogo)}
              </div>
            </div>
        </div>
        <div className= {this.state.searchPosTop ? "icons-box icons-box-top" : "icons-box icons-box-middle"}>
          <div className="icons-upload-lbl"><b>UPLOAD</b></div>
          {this.renderUploadIcons(glogo)}
        </div>
      </>
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
          <div className="col-sm-12 ">
            <div className=" d-flex justify-content-center">
                <div className = "search-box d-flex justify-content-center" >
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