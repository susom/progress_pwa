import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Spin, Space } from 'antd';
import { db_sessions, db_user } from "../../database/db";
import axios from 'axios';

import "../../assets/css/view_splash.css";
export function Landing() {
    const [redirectNow, setRedirectNow] = useState(false)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [userInfo, setUserInfo] = useState({})

    const fetchFromCache = async () => {
        let userRecord = await db_user.user.where("user_id").notEqual("").first()

        if (userRecord) { //We have encountered a user
            let sessionRecords = await db_sessions.logs.where("user_id").equals(userRecord['user_id']).toArray()
            if (sessionRecords.length) {
                let { hostname } = window.location
                const url = hostname === 'localhost' ? 'http://localhost:8080/sendUsageData' : process.env.REACT_APP_BACKEND_URL

                axios({
                    method: 'post',
                    url: url,
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    data: sessionRecords
                }).then(() => {
                    return db_sessions.logs.where("user_id").equals(userRecord['user_id']).delete() //Delete all session logs if successful
                }).then((log) => {
                    console.log('Deleted:', log)
                    // setIsLoggedIn(true)
                    // setUserInfo(userRecord)
                })
                    .catch(err => { //We are logged in, but network fails
                        console.log('Error attempting to save cached session statistics', err)
                        // setIsLoggedIn(true)
                        // setUserInfo(userRecord)
                    })
            }

        }

    }

    useEffect(() => {
        fetchFromCache()
    }, [])


    setTimeout(() => {
        setRedirectNow(true);
    }, 3000); //3 secs

    return redirectNow ?
        (
            <Navigate to={{ pathname: '/home' }} />
        )
        :
        (
            <div id="splashScreen">
                <h1>PROGRESS BINAURAL APP 1.0</h1>
                <Space style={{ position: 'relative', top: '140px' }}>
                    <Spin size="large">
                        <div className="content" />
                    </Spin>
                </Space>

            </div>
        );
}
