import React from 'react';
import './MyCheckbox.css'

export default class MyCheckBox extends React.Component {
    render(){
        return (
            <label className="checkbox-box">
              <input 
                type="checkbox"
                onChange={ (evt) => {this.props.saveResult(evt)} }
                value={this.props.value}
                checked = {this.props.checked}
              >
            </input>
              <span>{this.props.title}</span>
            </label>
      );
    }
}