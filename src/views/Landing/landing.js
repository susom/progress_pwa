import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {Spin, Space} from 'antd';
import { db_sessions } from "../../database/db";


import "../../assets/css/view_splash.css";
export function Landing(){
    const [redirectNow, setRedirectNow] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const fetchFromCache = async () => {
        let hashRecord = await db_sessions.logs.where("hash").notEqual("").first()
        if(hashRecord){ //user has logged in, 
            setIsLoggedIn(true)
        } 
    }

    useEffect(()=> {
        fetchFromCache()
    }, [])


    const renderNavChoice = () => {
        return isLoggedIn ? <Navigate to={{pathname: '/home'}} /> : <Navigate to={{pathname: '/login'}} />
    }

    setTimeout(() => {
        setRedirectNow(true);
    }, 3000); //3 secs

    return redirectNow ?
        (
            renderNavChoice()
        )
        :
        (
            <div id="splashScreen">
                <h1>PROGRESS BINAURAL APP 1.0</h1>
                <Space style={{position: 'relative', top: '140px'}}>
                    <Spin size="large">
                        <div className="content" />
                    </Spin>
                </Space>
                
            </div>
        );
}
