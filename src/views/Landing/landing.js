import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {Spin, Space} from 'antd';
import { db_sessions } from "../../database/db";
import axios from 'axios';

import "../../assets/css/view_splash.css";
export function Landing({isOnline}){
    const [redirectNow, setRedirectNow] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const fetchFromCache = async () => {
        let sessionRecord = await db_sessions.logs.where("userid").notEqual("").first()
        // console.log(sessionRecord)
        if(sessionRecord){ //user has logged in, 
            setIsLoggedIn(true)
            // setIsLoggedIn(true)
            // let { hostname } = window.location
            // const url = hostname === 'localhost' ? 'http://localhost:8080/verify' : process.env.REACT_APP_BACKEND_URL

            // axios({
            //     method: 'post',
            //     url: url,
            //     headers: {
            //         "Content-Type": 'application/json'
            //     },
            //     data: { hash: sessionRecord?.hash }
            // })
            //     .then(() => setIsLoggedIn(true))
            //     .catch(err => {
            //         console.log('err', err)
            //     })
        } else {
            setIsLoggedIn(false)
        }
        
    }

    useEffect(()=> {
        fetchFromCache()
    }, [])


    const renderNavChoice = () => {
        return isLoggedIn ? <Navigate to={{pathname: '/home'}} state={{'trying':1}}  /> : <Navigate to='/login' state={{ abc:1 }} />
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
