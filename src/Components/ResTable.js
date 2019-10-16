
import React from 'react';
import './ResTable.css';


export default class ResTable extends React.Component {


    render(){
        return(
            <table className="res-table" >
                <thead className="res-table-h">
                    <tr className="res-table-r">
                        <th >  <a className="header" href={this.props.link} target="_blank" rel="noopener noreferrer" >  {this.props.title}   </a>     </th>
                    </tr>
                </thead>
                    <tbody className="res-table-b">
                    <tr className="res-table-r"> 
                        <td ><a className="link" href={this.props.link} target="_blank" rel="noopener noreferrer" >{this.props.link}</a></td>
                    </tr>
                    <tr className="res-table-r">
                        <td className="description">{this.props.snippet}</td>
                    </tr>
                </tbody>
      </table>
        );
    }
}