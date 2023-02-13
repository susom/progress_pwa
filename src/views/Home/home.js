import React, { useState, useRef, useContext, useEffect } from "react";
import { SessionContext } from '../../contexts/Session';
import ReactPlayer from 'react-player';
import { Card, Col, Row, Button, Drawer } from 'antd';
import axios from 'axios';
import MediaController from "../../components/MediaController";

import "../../assets/css/view_home.css";
import mp3 from "../../assets/audio/R01_Beth_wBeats.m4a";
import BackgroundSelection from "../../components/Backgrounds";

export function Home() {
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [transparent, setTransparent] = useState(true)
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [timeInterval, setTimeInterval] = useState(0);
    const [formatedTimeInterval, setFormatedTimeInterval] = useState("00:00:00");

    const context = useContext(SessionContext)
    const player = useRef();

    // useEffect(() => {
    //     let {hostname} = window.location
    //     const url = hostname === 'localhost' ? 'http://localhost:8080/analyze' : process.env.REACT_APP_BACKEND_URL
    //
    //     axios({
    //         method: 'post',
    //         url: url,
    //         headers: {
    //             "Content-Type": 'application/json'
    //         }
    //     }).then((res) => console.log(res))
    //     .catch(err=>console.log(err))
    // }, [])

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
        date.setSeconds(total_seconds); // specify value for SECONDS here
        const result = date.toISOString().slice(11, 19);
        return result;
    }


    const handlePlayed = (e) => {
        setPlayed(e.played)
    }

    const handlePlayPause = () => {
        setPlaying(!playing)
    }

    const seek = (playedRatio) => {
        player.current.seekTo(parseFloat(playedRatio))
    };
    const fastForward = () => {
        if (playbackRate === 1)
            setPlaybackRate(2)
        else
            setPlaybackRate(1)
    }

    const onTouch = () => {
        setTransparent(false)
        setTimeout(() => {
            setTransparent(true)
        }, 5000)
    }

    const renderTransparentClasses = () => transparent ? `transparent` : 'visible'

    const renderClasses = () => `panel ${context.data.background}`

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
                <Col>
                    <hgroup style={{ marginBottom: '15vh' }} className="AppTitle">
                        <h1>Calm Tool - Relief App</h1>
                        <h2>Binaural Technology</h2>
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
                                    url={mp3}
                                    pip={false}
                                    light={false}
                                    width='0%'
                                    height='0%'
                                    onProgress={handlePlayed}
                                    playbackRate={playbackRate}
                                    playing={playing}
                                />
                            </div>

                            <MediaController
                                playing={playing}
                                playedRatio={played}
                                handlePlayPause={handlePlayPause}
                                seek={seek}
                                fastForward={fastForward}
                                playbackRate={playbackRate}
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
                    </Col>

                </Row>
            </div>
        </div>
    )
}
