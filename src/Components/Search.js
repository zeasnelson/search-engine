import React from 'react';
import './Search.css'
import MyCheckbox from './MyCheckbox';
import ResTable from './ResTable';
import downloadIcon from '../assets/images/downloadicon.png';
import TechnologyStack from './TechnologyStack';


export default class GSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: null,
      searchQuery: null,
      nextPageIndex : 1,
      nextPageBtn : null,   //button to request next page from google
      isChecked: new Array(100).fill(false), //Googel search API does not allow more than 100 results
      isAllChecked : false,  //to check/uncheck all button
    };
    this.saveIndex = [];
    this.downloadBadgeHref = React.createRef();
  }

  resetState(fetch){
    this.saveIndex = [];
      this.setState({
          searchQuery : this.props.googleSearchQuery,
          nextPageBtn : fetch ? true : false,
          nextPageIndex : 1,
          searchResults  : null,
          isAllChecked : false,
          isChecked : Array(100).fill(false),
        }
        ,() => { 
          if( fetch ) {
            this.fetchData()
          }
        });
  }

    //Used to re render the results component after a new fetch call to the google API
    componentDidUpdate(prevProps, prevState) {
    //re fetch data if a new search query is received
    if (this.props.googleSearchQuery !== prevProps.googleSearchQuery) {
      this.resetState(true);
    }
    else if(this.props.uploadedData !== prevProps.uploadedData){
      this.resetState(false);
      if( !this.props.uploadedData ){
        return;
      }
      this.parseUploadedData(this.props.fileName, this.props.uploadedData );
    }
    //re fetch data if the next page is requested
    else if(this.state.nextPageIndex !== prevState.nextPageIndex){
      if( this.state.searchResults )
        this.fetchData()   
    }
  }

  /*
  * Simply passed the uploaded data based on file extension     */
  parseUploadedData(fileName, uploadedData){
    if( !fileName && !uploadedData ){
      return;
    }
    // let parsedFileName = this.getFileName(fileName);
    let data, json;
    if( fileName === "csv" ){
      data = this.convertCSVtoJSON(uploadedData);
      json = JSON.parse(data);
    }
    else if( fileName === "xml" ){
      data = this.convertXMLtoJson(uploadedData);
      json = JSON.parse(data);
    }
    else if ( fileName === "json" ){
      data = this.reformatJson(uploadedData);
      json = JSON.parse(data);
    }

    if( !json ){
      let error = `{"Result":[{
          "title":"Looks like this ${fileName} file is not a valid !",
          "url":"https://www.google.com/search?q=${fileName} format",
          "description":"Make  sure it is valid ${fileName}"}
      ]}`
      data = this.reformatJson(error);
      json = JSON.parse(data);
    }
   
    this.setState({
      searchResults : json,
      searchQuery : 'mock',
    });
    
  }

  //To request the next page from Google
  setNextPage = () => {
    let nextPageIndex = this.state.nextPageIndex;
    if( nextPageIndex !== 91 ){ //google does not allow to search for mare than 100 results
      nextPageIndex += 10;
      this.setState( {
        isAllChecked : false,
        nextPageIndex : nextPageIndex
      });
    }
    
  }

  //make the API call
  //get results from Google
  fetchData(props){
    let search = this.props.googleSearchQuery;
    let pageNum = this.state.nextPageIndex;
    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDh2IgwS9Z2ALhZycon6wv0iyFFn2ZlDio&cx=008144321938561881807:hxbcfwfhnwv&q=${search}&start=${pageNum}`)
    .then(res => res.json())
    .then( res => {
      let results;
      if( this.state.searchResults ){
        results = this.state.searchResults;
        for(let i = 0; i < 10; i++ ){ // a search request always returns 10 results, hopefully google does not change this
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


  //To select/deselect one or all results to be downloaded
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
      }
    }
  }


  //Select or unselect only one result
  selectOneResult = (checkbox) => {

    if( checkbox && checkbox.target.checked ){
      this.saveIndex.push(parseInt(checkbox.target.value));
      let newIsChecked = this.state.isChecked;
      newIsChecked[checkbox.target.value] = true;
      this.setState({isChecked : newIsChecked});
        if( this.state.searchResults.length === this.saveIndex.length ){
          this.setState({isAllChecked : true });
        }
    }
    else if( checkbox && !checkbox.target.checked ){
      this.removeItem(checkbox.target.value);
      let newIsChecked = this.state.isChecked;
      newIsChecked[checkbox.target.value] = false;
      this.setState({isAllChecked : false });
      this.setState({isChecked : newIsChecked});
    }
  }
  

  //To remove an item from an array
  removeItem(item){
    if( !this.saveIndex ){
      return;
    }

    let newSaveIndex = this.saveIndex;
    for( let i = 0; i < this.saveIndex.length; i++ ){
      if( this.saveIndex[i] === Number(item) ){
        newSaveIndex.splice(i, 1);
        this.saveIndex = newSaveIndex;
        
        return;
      }
    }
  }

  
  //to convert uploaded CSV file into JSON
  convertCSVtoJSON(uploadedData){
    if( !uploadedData ){
      return;
    }
    let lines = uploadedData.split(/"\n"/);
    let json = [];
    for( let i = 0; i < lines.length; i++ ){
      let headers = lines[i].split(/","/);
      if( headers.length === 3 ){
        let jsonObj = {
          title : headers[0].replace(/"/, ""),
          link : headers[1].replace(/"/, ""),
          snippet : headers[2].replace(/"/, ""),
        }
        json.push(jsonObj);
      }
    }
    let parsedJson = JSON.stringify(json);
    return parsedJson;
  }

  // To convert uploaded XML file into JSON
  convertXMLtoJson(uploadedData){
    if( !uploadedData ){
      return;
    }
    let json = [];
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(uploadedData, "text/xml");
    let length = xmlData.getElementsByTagName("result").length;
    for( let i = 0; i < length; i++ ){
      try{
        let obj = {
          title : xmlData.getElementsByTagName("title")[i].childNodes[0].nodeValue,
          link  : xmlData.getElementsByTagName("url")[i].childNodes[0].nodeValue,
          snippet : xmlData.getElementsByTagName("description")[i].childNodes[0].nodeValue,
        }
        json.push(obj); 
      }catch(error){
        return null;
      }
    }
    return JSON.stringify(json);
  }

  /*
  *The JSON received from Google has different field names such as:
  *   - snippet instead of description
  *   - link instead of URL
  * To avoid changing the method that populates the tables with title, link and descripton
  * this method reformats the uploaded JSON to Google format  */
  reformatJson(uploadedData){
    if( !uploadedData ){
      return;
    }
    let reformattedJson = [];
    let uploadedJson;
    try{
      uploadedJson = JSON.parse(uploadedData);
    }catch(error){
      return null;
    }
    for( let i = 0; i < uploadedJson.Result.length; i++ ){
      let item = uploadedJson.Result[i];
      //ensure it contains required data
      if( !item.title && !item.url && !item.description ){
        return null;
      }
      let itemObj = {
        title : item.title,
        link : item.url,
        snippet : item.description,
      }
      reformattedJson.push(itemObj);
    }
    return JSON.stringify(reformattedJson);
  }


  //The method converts selected results to be saved as XML
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

  //This method converts selected results into JSON to be downloaded
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
    let str = '{ "Result": ' + JSON.stringify(jsonObj) + '}';
    return str;
  }


  //Method to converted selected results into CSV to be downloaded
  convertToCSV(){
    if( !this.saveIndex || !this.state.searchResults ){
      return;
    }
    let csvContent = '';
    for( let i = 0; i < this.saveIndex.length; i++ ){
      let item = this.state.searchResults[this.saveIndex[i]];
      csvContent +=  `"${item.title}","${item.link}","${item.snippet}"\n`;
    }
    return csvContent;
  }

  //Mehtod that prompts download
  downloadFile(id){
    if( this.saveIndex.length > 0 ){
      let items;
      if( id === "xml"){
        items = this.convertToXML();
      }
      else if( id === "json" ){
        items = this.convertToJSON();
      }
      else if( id === "csv" ){
        items = this.convertToCSV();
      }
      else{
        return;
      }
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(items));
      element.setAttribute('download', `links.${id}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }



  //Add a download button to the check box
  renderCheckBox(){
    let items;
    if( this.saveIndex ){
      items = this.saveIndex.length;
    }

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
              <div ref={this.downloadBadgeHref} className="downloadBadge">{items}</div>
            </div>
      </div>
    );
  }

  renderTable(){

  }
 

  //creates tables from the results received from Google json
  setResults(){
    
    //render the technology stack at the home page if nothig has been uploaded or searched on google
    if( this.props.renderTechStack ){
      return (<TechnologyStack /> );
    }

    //display loading while fetching results from Google
    if( !this.state.searchResults  && this.state.searchQuery ){
      return (<div className='col-12 text-center mt-5'>loading</div>);
    }

    //don't render anythig if nothing has been searched or uploaded
    if( !this.state.searchResults  || !this.state.searchQuery){
      return ;
    }

    let table = [];
    //push check box with the download button to be rendered
    table.push(
      <div className='col-12 mt-3' key={this.state.searchResults.length + 999}>
        {this.renderCheckBox()}
      </div>
    );

    //push individual tables into the array to be rendered from the searchResults json
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

  
  renderNextPgBtn(){
    //To render "End Of File" when a file was uploaded
    if( !this.state.nextPageBtn && this.state.searchResults ){
      return <div className="col-12 text-center mt-3">End Of File</div>;
    }
    //To render a button if the user searched on Google
    if( this.state.searchResults ){
      return (
          <div className='col-12 d-flex justify-content-center m-2'>  
            <button onClick={this.setNextPage}>
              {"load next page"}
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
        {this.renderNextPgBtn()}
      </div>
    );
  }

}
