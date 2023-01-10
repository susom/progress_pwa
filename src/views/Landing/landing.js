import {useState} from "react";
import {Navigate} from "react-router-dom";

import "../../assets/css/view_splash.css";
export function Landing(){
    const [redirectNow, setRedirectNow] = useState(false);

    setTimeout(() => {
        setRedirectNow(true);
    }, 3000); //3 secs

    return redirectNow ?
        (
            <Navigate to={{pathname: '/home'}} / >
        )
        :
        (
            <div id="splashScreen">
                <h1>PROGRESS BINAURAL APP 1.0</h1>
            </div>
        );
}
