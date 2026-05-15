import React, { useState, useRef, useContext, useEffect } from "react";
import { SessionContext } from '../../contexts/Session';
import ReactPlayer from 'react-player';
import { Card, Col, Row, Button, Drawer } from 'antd';
import axios from 'axios';
import ReactGA from "react-ga4";
import { db_sessions, db_user } from "../../database/db";

import MediaController from "../../components/MediaController";
import "../../assets/css/view_home.css";

import female_long from "../../assets/audio/R01_Beth_wBeats.m4a";
import female_short from '../../assets/audio/Audio_short.m4a';
import male_long from "../../assets/audio/Male_binaural_20m.m4a";
import male_short from "../../assets/audio/Male_binaural_10m.m4a";
import aus_female_long from "../../assets/audio/AUS_female_20m.m4a";
import aus_female_short from "../../assets/audio/AUS_female_10m.m4a";
import spanish_female_long from '../../assets/audio/binaural_spanish_20m.m4a';
import anna_long from '../../assets/audio/Anna_20m.mp3';
import anna_short from '../../assets/audio/Anna_10m.mp3';
import nathan_long from '../../assets/audio/Nathan_20m.mp3';
import nathan_short from '../../assets/audio/Nathan_10m.mp3';

import logo from '../../assets/img/logo_side.png';
import BackgroundSelection from "../../components/Backgrounds";
import PWAInstall from '../../components/PWAInstall/pwa_install';

export function Home() {
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [transparent, setTransparent] = useState(true)
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [timeInterval, setTimeInterval] = useState(0);
    const [formatedTimeInterval, setFormatedTimeInterval] = useState("00:00:00");
    const [loading, setLoading] = useState(true)
    const [selectedAudio, setSelectedAudio] = useState(female_long)
    const [userInformation, setUserInformation] = useState('')
    const [timeStarted, setTimeStarted] = useState(null)
    const context = useContext(SessionContext);
    const player = useRef();

    const [isLooping, setIsLooping] = useState(false);

    const handleLoopToggle = () => {
        setIsLooping(prev => !prev);
    };

    useEffect(() => {
        verifyLoginStatus()
    }, [])

    const verifyLoginStatus = async () => {
        let sessionRecord = await db_user.user.where("user_id").notEqual("").first()
        if(sessionRecord){
            setUserInformation(sessionRecord)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const sendUsageData = async () => {
        let {hostname} = window.location
        const url = hostname === 'localhost' ? 'http://localhost:8080/sendUsageData' : 'https://analyze-j2igbnbiba-uw.a.run.app/sendUsageData'
        const session = {
            redcap_record_id: userInformation?.redcap_record_id,
            user_id: userInformation?.user_id,
            start_time: timeStarted,
            end_time: new Date().toISOString(),
            uploaded: false
        };

        if (userInformation?.redcap_record_id && userInformation?.user_id){
            axios({
                method: 'post',
                url: url,
                headers: {
                    "Content-Type": 'application/json'
                },
                data: [session]
            })
            .catch(err=>{
                console.log('Error saving data', err)
                db_sessions.logs.put(session);
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

    const formatTimeInterval = (total_seconds) => {
        const date = new Date(null);
        date.setSeconds(total_seconds);
        const result = date.toISOString().slice(11, 19);
        return result;
    }

    const handlePlayed = (e) => {
        setPlayed(e.played)
    }

    const handlePlayPause = () => {
        setPlaying(!playing)

        if (timeStarted === null) {
            setTimeStarted(new Date().toISOString());
            ReactGA.event({
                category: "Media",
                action: "Play Audio",
                label: selectedAudio
            });
        } else {
            sendUsageData()
            setTimeStarted(null);
            ReactGA.event({
                category: "Media",
                action: "Pause Audio",
                label: selectedAudio
            });
        }
    }

    const seek = (playedRatio) => {
        player.current.seekTo(parseFloat(playedRatio))
    };

    const onTouch = () => {
        setTransparent(false)
        setTimeout(() => {
            setTransparent(true)
        }, 5000)
    }

    const onAudioSelect = (filepath) => {
        setSelectedAudio(filepath)
        setPlayed(0)
        setTimeInterval(0)
        setFormatedTimeInterval("00:00:00")
    }

    const renderTransparentClasses = () => transparent ? `transparent` : 'visible'

    const renderClasses = () => `panel ${context.data.background}`

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
                        <div style={{position:'relative'}}>
                            <img src={logo} alt="Empowered Relief" style={{display:'inline-block', margin:'5px', maxHeight:'70px',  verticalAlign:'top'}}/>
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
                                    className='react-player'
                                    url={selectedAudio}
                                    pip={false}
                                    light={false}
                                    width='0%'
                                    height='0%'
                                    loop={isLooping}
                                    onProgress={handlePlayed}
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
                                files={[female_long,female_short,male_long, male_short, aus_female_long, aus_female_short, spanish_female_long, anna_long, anna_short, nathan_long, nathan_short]}
                                selected={selectedAudio}
                                onAudioSelect={onAudioSelect}
                                loop={isLooping}
                                handleLoopToggle={handleLoopToggle}
                            >
                                {userInformation?.user_id ? (<span className={`user_name`}>Hi, {userInformation.user_id}</span>) : "" }
                            </MediaController>

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
                        <div style={{color:'#fff', marginBottom:'10px', textShadow:"1px 1px 1px #333"}}> © 2026 Stanford University</div>
                    </Col>

                </Row>
            </div>

            <PWAInstall userInformation={userInformation}/>
        </div>
    )
}
