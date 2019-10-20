import React from 'react';
import './GSearch.css'
import MyCheckbox from './MyCheckbox';
import ResTable from './ResTable';
import downloadIcon from '../assets/images/downloadicon.png';
//import Spinner from 'react-bootstrap/Spinner';

export default class GSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: null,
      searchQuery: null,
      nextPageIndex : 1,
      isChecked: new Array(100).fill(false),
      isAllChecked : false,  //to check/uncheck all button
    };
    this.saveIndex = [];
   // this.setResultsToSave = this.setResultsToSave.bind(this);
  }
  

  // //First fetch on component load
  // //Method called only once at component creation
  // componentDidMount(props) {
  //   if( this.state.searchResults ){
  //     this.fetchData(this.props);
  //     console.log("componentDidMount");
  //   }
  // }

    //Used to re render the results component after a new fetch call to the google API
  componentDidUpdate(prevProps, prevState) {
    //re fetch data if a new search query is received
    if (this.props.googleSearchQuery !== prevProps.googleSearchQuery) {
      this.setState({nextPageIndex : 1});
      this.setState({searchResults : null});
      this.setState({isAllChecked : false});
      this.setState({isChecked :  Array(100).fill(false)});
      this.saveIndex = [];
      this.setState({searchQuery : this.props.googleSearchQuery}, () => this.fetchData() );
    }
    else if(this.props.uploadedData !== prevProps.uploadedData){
      this.parseUploadedData(this.props.fileName, this.props.uploadedData );
    }
    //re fetch data if the next page is requested
    else if(this.state.nextPageIndex !== prevState.nextPageIndex){
      if( this.state.searchResults )
        this.fetchData()   
    }
  }

  //make the API call
  //get results from Google
  fetchData(props){
    //let key = 'AIzaSyDh2IgwS9Z2ALhZycon6wv0iyFFn2ZlDio';
    //let cx = '008144321938561881807:hxbcfwfhnwv'
    // let linkTwo = "https://api.myjson.com/bins/1dxav6";
    // let linkOne = "https://api.myjson.com/bins/p7f7u";
    // let linkThree = "https://api.myjson.com/bins/lh7ky";
    let search = this.props.googleSearchQuery;
    let pageNum = this.state.nextPageIndex;
    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDh2IgwS9Z2ALhZycon6wv0iyFFn2ZlDio&cx=008144321938561881807:hxbcfwfhnwv&q=${search}&start=${pageNum}`)
    //let whattosearch;
    // if( this.state.nextPageIndex === 11 )
    //   whattosearch = linkTwo;
    //   else if( this.state.nextPageIndex === 21 )
    //   whattosearch = linkThree;
    //   else if( this.state.nextPageIndex === 1 )
    //   whattosearch = linkOne;
   
    // fetch(whattosearch )
    .then(res => res.json())
    .then( res => {
      let results;
      if( this.state.searchResults ){
        results = this.state.searchResults;
        for(let i = 0; i < 10; i++ ){
          results.push(res.items[i]);
        }
      }else {
        results = res.items;
      }
      this.setState({searchResults : results }
        , () => { 
          this.setResults()
        }
        )
    });
  }

  getFileName(fileName){
    let index = fileName.lastIndexOf('.');
    let parsedFileName = fileName.substring(index+1);
    return parsedFileName;
  }

  convertCSVtoJSON(uploadedData){
    let lines = uploadedData.split(/"\n"/);
    let json = [];
    for( let i = 0; i < lines.length; i++ ){
      let headers = lines[i].split(/","/);

      let jsonObj = {
        title : headers[0],
        link : headers[1],
        snippet : headers[2],
      }
      json.push(jsonObj);
    }
    let parsedJson = JSON.stringify(json);
    return parsedJson;
  }

  convertXMLtoJson(uploadedData){
    console.log("parsing XML");
    let json = [];
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(uploadedData, "text/xml");
    let length = xmlData.getElementsByTagName("result").length;
    for( let i = 0; i < length; i++ ){
      let obj = {
        title : xmlData.getElementsByTagName("title")[i].childNodes[0].nodeValue,
        link  : xmlData.getElementsByTagName("url")[i].childNodes[0].nodeValue,
        snippet : xmlData.getElementsByTagName("description")[i].childNodes[0].nodeValue,
      }
      json.push(obj); 
    }
    return JSON.stringify(json);
  }

  reformatJson(uploadedData){
    let reformattedJson = [];
    let uploadedJson = JSON.parse(uploadedData);
    for( let i = 0; i < uploadedJson.length; i++ ){
      let item = uploadedJson[i];
      let itemObj = {
        title : item.title,
        link : item.url,
        snippet : item.description,
      }
      reformattedJson.push(itemObj);
    }
    return JSON.stringify(reformattedJson);
  }

  parseUploadedData(fileName, uploadedData){
    let parsedFileName = this.getFileName(fileName);
    let data, json;
    if( parsedFileName === "csv" ){
      data = this.convertCSVtoJSON(uploadedData);
      json = JSON.parse(data);
    }
    else if( parsedFileName === "xml" ){
      data = this.convertXMLtoJson(uploadedData);
      json = JSON.parse(data);
    }
    else if (parsedFileName === "json" ){
      data = this.reformatJson(uploadedData);
      json = JSON.parse(data);
      
      console.log(json[0].title);
      
    }
    this.setState({
      searchResults : json,
      searchQuery : 'mock',
    });
  }

  setResultsToSave = (checkbox) => {
    if( checkbox ){
      let value = checkbox.target.value;
      if( value === '999999' ){
        this.checkUncheckAll(checkbox);
      }
      else{
        this.selectOneResult(checkbox);
      } 
    }
  }
  //to check or uncheck all results from the search
  checkUncheckAll = (checkbox) => {
    let checkAll = [];
    let items = [];

    if( checkbox ){
      if( checkbox.target.value === '999999'){
        this.setState({isAllChecked : checkbox.target.checked});
        if( checkbox.target.checked ){
          checkAll = Array(this.state.searchResults.length).fill(true);
          items = Array.from(Array(this.state.searchResults.length).keys()); //creates array like [1,2,3,...,n]
        }
        else {
          checkAll = Array(this.state.searchResults.length).fill(false);
          items = [];
        }
        this.saveIndex = items;
        this.setState({isChecked : checkAll });
        console.log(this.saveIndex);
        
      }
    }
  }

  selectOneResult = (checkbox) => {

    if( checkbox && checkbox.target.checked ){
      this.saveIndex.push(parseInt(checkbox.target.value));
      let newIsChecked = this.state.isChecked;
      newIsChecked[checkbox.target.value] = true;
      this.setState({isChecked : newIsChecked});
        if( this.state.searchResults.length === this.saveIndex.length ){
          this.setState({isAllChecked : true });
        }

        console.log(this.saveIndex);
    }
    else if( checkbox && !checkbox.target.checked ){
      this.removeItem(checkbox.target.value);
      let newIsChecked = this.state.isChecked;
      newIsChecked[checkbox.target.value] = false;
      this.setState({isAllChecked : false });
      this.setState({isChecked : newIsChecked});

      console.log(this.saveIndex);
    }
  }

  removeItem(item){
    let newSaveIndex = this.saveIndex;
    for( let i = 0; i < this.saveIndex.length; i++ ){
      if( this.saveIndex[i] === Number(item) ){
        newSaveIndex.splice(i, 1);
        this.saveIndex = newSaveIndex;
        
        return;
      }
    }
  }

  setNextPage = () => {
    let nextPageIndex = this.state.nextPageIndex;
    nextPageIndex += 10;
    this.setState( {nextPageIndex : nextPageIndex});
    
  }

  convertToXML(){
    if( !this.saveIndex || !this.state.searchResults ){
      return;
    }

    let xmlObj = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlObj += "<results>\n";
    for( let i = 0; i < this.saveIndex.length; i++ ){
      let item = this.state.searchResults[this.saveIndex[i]];
      xmlObj += '<result>\n'
        xmlObj += '<title>"'  + item.title.replace(/&/g, '&amp;') + '"</title>\n';
        xmlObj += '<url>"' + item.link.replace(/&/g, '&amp;') + '"</url>\n';
        xmlObj += '<description>"' + item.snippet.replace(/&/g, '&amp;') + '"</description>\n';
      xmlObj += '</result>\n';
    }
    xmlObj += '</results>\n';
    return xmlObj;
  }

  convertToJSON(){
    if( !this.saveIndex || !this.state.searchResults ){
      return;
    }
    let jsonObj = [];
    for(let i = 0; i < this.saveIndex.length; i++ ){
      let item = this.state.searchResults[this.saveIndex[i]];
      let itemObj = {
        title : item.title,
        url : item.link,
        description : item.snippet,
      }
      jsonObj.push(itemObj);
    }
    return JSON.stringify(jsonObj);
  }

  convertToCSV(){
    let csvContent = '';

    for( let i = 0; i < this.saveIndex.length; i++ ){
      let item = this.state.searchResults[this.saveIndex[i]];
      csvContent +=  `"${item.title}","${item.link}","${item.snippet}"\n`;
    }
    return csvContent;
  }

  downloadFile(id){
    if( this.saveIndex.length > 0 ){
      let links;
      if( id === "xml"){
        links = this.convertToXML();
      }
      else if( id === "json" ){
        links = this.convertToJSON();
      }
      else if( id === "csv" ){
        links = this.convertToCSV();
      }
      else{
        return;
  }

      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(links));
      element.setAttribute('download', `links.${id}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  
    
  }

  //Add a download button to the check box
  renderCheckBox(){
    return(
      <div className='checkbox-outerbox d-flex justify-contents-left'> 
        <MyCheckbox 
          saveResult = {this.setResultsToSave}
          value = "999999"
          title="All"
          checked = {this.state.isAllChecked}
          />
            <div className="download-icons">
              <img src={downloadIcon} className="download-icon" alt = {"icon"} width = "30" height = "30" />
              <button className="download-btn" onClick={()=>this.downloadFile("json")} type="button"><span>JSON</span></button>
              <button className="download-btn" onClick={()=>this.downloadFile("xml")} type="button"><span>XML</span></button>
              <button className="download-btn" onClick={()=>this.downloadFile("csv")} type="button"><span>CSV</span></button>
            </div>
      </div>
    );
  }
 

  //creates tables from the results received from Google json
  setResults(){
    
    //display loading
    if( !this.state.searchResults  && this.state.searchQuery ){
      return (<div className='col-12 text-center'>loading</div>);

    }

    if( !this.state.searchResults  || !this.state.searchQuery ){
      return null;
    }

    let table = [];

    //push check box with the button to be rendered
    table.push(
      <div className='col-12' key={this.state.searchResults.length + 999}>
        {this.renderCheckBox()}
      </div>
    );

    //push individual tables into the array to be rendered
    for( let i = 0; i < this.state.searchResults.length; i++ ){
      let res = this.state.searchResults[i];
      table.push(
        <div className="col-12 mt-4" key={i}>
          <div className="results">
            <div className='res-checkbox'>
              <MyCheckbox 
                title=""
                value = {i}
                saveResult = {this.setResultsToSave}
                checked = {this.state.isChecked[i]}
              />
            </div>
            <div className='res-table-box'>
              <ResTable 
                link = {res.link} 
                title = {res.title} 
                snippet = {res.snippet}
              />
            </div>
            </div>
        </div>
      );
    }
    return table;
  } 

  
  renderSensor(){
    if( this.state.searchResults ){
      return (
        <div className='col-12 d-flex justify-content-center m-2'>  
          <button onClick={this.setNextPage}>
            load more results
          </button>
        </div>
        );
      }
  }

  //render everything
  render() {
    return (
      <div className='row'>
        {this.setResults()}
        {this.renderSensor()}
      </div>
    );
  }

}
