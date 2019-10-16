import React from 'react';
import './GSearch.css'
import MyCheckbox from './MyCheckbox';
import ResTable from './ResTable';
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
  

  //First fetch on component load
  //Method called only once at component creation
  componentDidMount(props) {
    if( this.state.searchResults )
      this.fetchData(this.props);
  }

    //Used to re render the results component after a new fetch call to the google API
  componentDidUpdate(prevProps, prevState) {
    //re fetch data if a new search query is received
    if (this.props.value !== prevProps.value) {
      this.setState({nextPageIndex : 1});
      this.setState({searchResults : null});
      this.setState({isAllChecked : false});
      this.setState({isChecked :  Array(100).fill(false)});
      this.saveIndex = [];
      this.setState({searchQuery : this.props.value}, () => this.fetchData() );
    }
    //re fetch data if the next page is requested
    else if(this.state.nextPageIndex !== prevState.nextPageIndex){
      this.fetchData()   
    }
  }

  //make the API call
  //get results from Google
  fetchData(props){
    //let key = 'AIzaSyDh2IgwS9Z2ALhZycon6wv0iyFFn2ZlDio';
    //let cx = '008144321938561881807:hxbcfwfhnwv'
    let linkTwo = "https://api.myjson.com/bins/1dxav6";
    let linkOne = "https://api.myjson.com/bins/p7f7u";
    let linkThree = "https://api.myjson.com/bins/lh7ky";
    let search = this.props.value;
    let pageNum = this.state.nextPageIndex;
    //fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDh2IgwS9Z2ALhZycon6wv0iyFFn2ZlDio&cx=008144321938561881807:hxbcfwfhnwv&q=${search}&start=${pageNum}`)
    let whattosearch;
    if( this.state.nextPageIndex === 11 )
      whattosearch = linkTwo;
      else if( this.state.nextPageIndex === 21 )
      whattosearch = linkThree;
      else if( this.state.nextPageIndex === 1 )
      whattosearch = linkOne;
   
    fetch(whattosearch )
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

  removeItem(item){
    let newSaveIndex = this.saveIndex;
    for( let i = 0; i < this.saveIndex.length; i++ ){
      if( this.saveIndex[i] === item ){
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

  //Add a download button to the check box
  renderCheckBox(){
    return(
      <div className='checkbox-outerbox'> 
        <MyCheckbox 
          saveResult = {this.setResultsToSave}
          value = "999999"
          title="All"
          checked = {this.state.isAllChecked}
          />
        <div className="btn-box">
        <button className="btn" type="button">
          <span>Download</span>
        </button>
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
        <div className="col-12 m-2" key={i}>
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
