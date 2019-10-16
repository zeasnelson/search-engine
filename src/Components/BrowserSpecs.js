

import React from 'react';
import {initBrowserSpecs} from '../assets/libs/BrowserSpecs'
import './BrowserSpecs.css'


function renderRows(props){
    let rows = [];
    
    for(let i = 0; i < props.value; i++){
        rows.push(
            <tr key={i}>
                <th className="brow-tbl-th" id={`${props.id}t-${i+1}`}></th>
                <td className="brow-tbl-td" id={`${props.id}-${i+1}`}></td>
            </tr>
        );
    }
    return rows;
}

function RenderSingleTable(props){
    return(
        <div className="col-12 col-md-6 col-lg-4 pb-5">                             
            <table className="brow-tbl">
                <thead className="brow-tbl-h">
                    <tr>
                        <th className="brow-tbl-th" id={props.id} colSpan={2}></th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows(props)}
                </tbody>
            </table>
        </div>
    );
}


export default class BrowserSpecs extends React.Component {
    
    renderAllTables(){
        let id = ['nav', 'scr', 'loc', 'win', 'lat'];
        let rows = [6, 6, 4, 2, 2 ];
        let tables = [];

        for(let i = 0; i < 5; i++){
            tables.push(
                <RenderSingleTable 
                    key= {i}
                    id = {id[i]}
                    value = {rows[i]}
                />
            );
        }
        return tables;
    }

    componentDidMount() {
        initBrowserSpecs();
    }

    render(){
        return(
            <div className="tables">
                <div className="row browser-tables" >
                    {this.renderAllTables()}
                </div>
            </div>
        );
    }


}