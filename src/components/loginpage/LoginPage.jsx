import React from "react";
import Slideer from "../slider/Slideer";
import Login from "../Login/Login";
function LoginPage(){
    return(
        <div className="firstPage">
            <div className="row">
            <div className="col-md-6">
                <Slideer/>
            </div>
            <div className="col-md-6">
           <Login/>
            </div>
            </div>
        </div>
    )
}
export default LoginPage