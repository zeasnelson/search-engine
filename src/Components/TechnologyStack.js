import React from 'react';
import reactLogo from '../assets/images/reactlogo.png';
import bootstraplogo from '../assets/images/bootstraplogo.png';
import htmllogo from '../assets/images/htmllogo.png';
import jslogo from '../assets/images/jslogo.png';
import csslogo from '../assets/images/csslogo.png';
import './TechnologyStack.css'


export default class TechnologyStack extends React.Component {



    render(){
        return(
            // <div className="stack-box">
            //     <div className="stack-title">TECHNOLOGY STACK</div>
            //     <div className="stack-icons-box">
                    
            //     </div>
            // </div>
            <div className="row m-auto mt-2 ">
                <div className="col-md-12 text-center">
                <div className="stack-title">TECHNOLOGY STACK</div>
                </div>
                <div className="col-md-3 col-6 d-flex justify-content-center"> 
                    <div>
                        <div className="image-box"><img alt="Bootstrap" src={bootstraplogo} /></div>
                        <div className="bootstrap-txt">Bootstrap</div>
                    </div>
                </div>
                <div className="col-md-2  col-6 d-flex justify-content-center"> 
                    <div>
                        <div className="image-box"><img alt="react" src={reactLogo} /></div>
                        <div className="react-txt">React</div>
                    </div>
                </div>

                <div className="col-md-2  col-6 d-flex justify-content-center"> 
                    <div>
                        <div className="image-box"><img alt="javascipt" src={jslogo}/></div>
                        <div className="js-txt">Javascipt</div>
                    </div>
                </div>

                <div className="col-md-2 col-6  d-flex justify-content-center"> 
                    <div>
                        <div className="image-box"><img alt="html" src={htmllogo} /></div>
                        <div className="html-txt">HTML</div>
                    </div>
                </div>

                <div className="col-md-3  col-6 d-flex justify-content-center"> 
                    <div>
                        <div className="image-box"><img alt="css" src={csslogo}/></div>
                        <div className="css-txt">CSS</div>
                    </div>
                </div>
            </div>
        );
    }
}