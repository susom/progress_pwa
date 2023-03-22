import React, { useState, useRef, useContext, useEffect } from "react";
import { SessionContext } from '../../contexts/Session';
import ReactPlayer from 'react-player';
import { Card, Col, Row, Button, Drawer } from 'antd';
import { PersonLock, PersonCheck } from 'react-bootstrap-icons';
import axios from 'axios';
import { db_sessions, db_user } from "../../database/db";

import MediaController from "../../components/MediaController";
import { useNavigate } from "react-router-dom";
import "../../assets/css/view_home.css";
import long from "../../assets/audio/R01_Beth_wBeats.m4a";
import short from '../../assets/audio/Audio_short.m4a';
import logo from '../../assets/img/logo_notext.png';
import BackgroundSelection from "../../components/Backgrounds";
// import Guide from '../../components/Guide';
import PWAInstall from '../../components/PWAInstall/pwa_install';

export function Home() {
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [transparent, setTransparent] = useState(true)
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [timeInterval, setTimeInterval] = useState(0);
    const [projectName, setProjectName] = useState("Empowered Relief");
    const [formatedTimeInterval, setFormatedTimeInterval] = useState("00:00:00");
    const [loading, setLoading] = useState(true)
    const [selectedAudio, setSelectedAudio] = useState(long)
    const [userInformation, setUserInformation] = useState('')
    const [instructionsOpen, setInstructions] = useState(false)
    // const { state: userInformation } = useLocation(); //User information passed from login navigation / session
    const [timeStarted, setTimeStarted] = useState(null)
    const navigate = useNavigate()
    const context = useContext(SessionContext);
    const player = useRef();

    const styles = {
        userLogin: {
            position:"absolute",
            top:"90px",
            left:"10px",
            width:"200px",
            height:"30px",
            textAlign:"left"
        },
        login : {
            display:"inline-block",
            width:"30px",
            height:"30px",
            color:"#666",
            cursor:"pointer"
        },
        userName : {
            verticalAlign:"bottom",
            color:"#666",
            fontSize:"85%"
        }
    }

    useEffect(() => {
        verifyLoginStatus()
    }, [])
    
    const verifyLoginStatus = async () => {
        let sessionRecord = await db_user.user.where("user_id").notEqual("").first()
        if(sessionRecord){
            // setUserInfo(sessionRecord)
            setUserInformation(sessionRecord)
            setLoading(false)    

        } else { //No Current user
            setLoading(false)
        }
        
    }

    const sendUsageData = async () => {
        let {hostname} = window.location
        const url = hostname === 'localhost' ? 'http://localhost:8080/sendUsageData' : 'https://analyze-j2igbnbiba-uw.a.run.app/sendUsageData'
        const session = { //Append session info to to local storage
            redcap_record_id: userInformation?.redcap_record_id,
            user_id: userInformation?.user_id,
            start_time: timeStarted,
            end_time: new Date().toISOString(), 
            uploaded: false
        }; 
       
        if (userInformation?.redcap_record_id && userInformation?.user_id){ //Only capture session info if logged in
            axios({
                method: 'post',
                url: url,
                headers: {
                    "Content-Type": 'application/json'
                },
                data: [session] 
            })
            .catch(err=>{ //We are logged in, but network fails
                console.log('Error saving data', err)
                db_sessions.logs.put(session); //Save to indexDB
            })
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if(playing){
                setTimeInterval(timeInterval + 1);
                setFormatedTimeInterval(formatTimeInterval(timeInterval));
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [timeInterval,playing]);

    const logout = async () => {
        let user = await db_user.user.where("user_id").notEqual("").delete()
        // return db_sessions.logs.where("user_id").equals(userRecord['user_id']).delete() //Delete all session logs if successful
        setUserInformation('')
    }

    const formatTimeInterval = (total_seconds) => {
        const date = new Date(null);
        date.setSeconds(total_seconds); // specify value for SECONDS here
        const result = date.toISOString().slice(11, 19);
        return result;
    }

    const handlePlayed = (e) => {
        // console.log(e)
        setPlayed(e.played)
    }

    const handlePlayPause = () => {
        setPlaying(!playing)
        
        if (timeStarted === null) { //Clicking play
            setTimeStarted(new Date().toISOString())
        } else { //Clicked pause
            sendUsageData() //Send play statistics to server
            
            setTimeStarted(null)
        }
    }

    const seek = (playedRatio) => {
        player.current.seekTo(parseFloat(playedRatio))
    };
    
    const showModal = () => setInstructions(!instructionsOpen)
    // const fastForward = () => {
    //     if (playbackRate === 1)
    //         setPlaybackRate(2)
    //     else
    //         setPlaybackRate(1)
    // }
    
    const onTouch = () => {
        setTransparent(false)
        setTimeout(() => {
            setTransparent(true)
        }, 5000)
    }
    
    const onAudioSelect = (filepath) => {
        setPlaying(false)
        setSelectedAudio(filepath)
        setTimeInterval(0)
        setFormatedTimeInterval("00:00:00")

    }

    const renderTransparentClasses = () => transparent ? `transparent` : 'visible'

    const renderClasses = () => `panel ${context.data.background}`
    
    // if (isLoggedIn === null) //if user is navigating here, wait until status check
    //     return null
    // if (isLoggedIn === false) //Can't verify user, redirect
    //     return <Navigate to="/login" replace />
    let items
    if(!userInformation?.user_id) {
        items = [
            {
                label: 'Login',
                key: '1',
                onClick: () => navigate('/login')
            }
        ]
    } else {
        items = [
            {
                label: 'Logout',
                key: '1',
                onClick: () => logout()
            }
        ]
    }

    if (loading === true)
        return null 
    
    return (
        <div id="main" className={renderClasses()}>
            <Drawer
                width={100}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                closable={false}
            >
                <BackgroundSelection />
            </Drawer>
            <Row justify="center" className={`titleBar ${playing ? "playing" : ""}`}>
                <Col style={{right: '10px'}}>
                    <hgroup className="AppTitle">
                        <img src={logo} style={{maxWidth:'50px', display:'inline-block', marginRight: '10px', marginTop:'10px' , verticalAlign:'top'}}/>
                        <div style={{display:'inline-block'}}>
                            <h2>{userInformation?.study_id ??projectName}</h2>
                            <h3>Binaural Technology</h3>
                        </div>
                    </hgroup>
                </Col>
            </Row>

            <div className='MediaPositioning'>
                <Row justify="center">
                    <Col xs={24} md={18} lg={16} xl={12}>
                        <Card
                            onMouseDown={onTouch}
                            onTouchStart={onTouch}
                            className={renderTransparentClasses()}
                        >
                            <div className='player-wrapper' >
                                <ReactPlayer
                                    ref={player}
                                    // onReady={() => console.log('ready to play!')}
                                    className='react-player'
                                    url={selectedAudio}
                                    pip={false}
                                    light={false}
                                    width='0%'
                                    height='0%'
                                    onProgress={handlePlayed}
                                    playbackRate={playbackRate}
                                    // onBuffer={() => console.log('buffering start')}
                                    // onBufferEnd={()=>console.log('buffering finished')}
                                    onError={(err) => {console.log("ERROR ENCOUNTERED", err)}}
                                    playing={playing}
                                    crossOrigin='anonymous'
                                />
                            </div>

                            <MediaController
                                playing={playing}
                                playedRatio={played}
                                handlePlayPause={handlePlayPause}
                                seek={seek}
                                files={[short, long]}
                                selected={selectedAudio}
                                onAudioSelect={onAudioSelect}
                            />

                            {
                                !playing
                                    ? <p className="play_text">Press the play button to {timeInterval ? "continue" : "begin"} your session.</p>
                                    : <p className="play_text">Now playing. Relax.</p>
                            }

                            {
                                playing || timeInterval ? <p className="play_text">Session Duration : <span className="time_interval">{formatedTimeInterval}</span></p> : ""
                            }
                        </Card>
                        <Button onClick={() => setDrawerVisible(true)} className="change_background">Change Background</Button>
                        <div style={{color:'#666', marginBottom:'10px'}}> © 2023 Stanford University</div>
                    </Col>

                </Row>
            </div>

            <div style={styles.userLogin}>
                {userInformation?.user_id
                    ? (<div><PersonCheck style={styles.login} onClick={() => { logout() }}/> <span style={styles.userName}>Hi, {userInformation.user_id}</span></div>)
                    : (<div><PersonLock style={styles.login} onClick={() => navigate('/login')}/></div>)
                }
            </div>
            <PWAInstall userInformation={userInformation}/>
        </div>
    )
}
