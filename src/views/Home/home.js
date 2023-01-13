import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player';
import { Card, Col, Row } from 'antd';
import MediaController from "../../components/MediaController";
import "../../assets/skin/pink.flag/css/jplayer.pink.flag.css";
import "../../assets/css/view_home.css";
import mp3 from "../../assets/audio/R01_Beth_wBeats.mp3";
import AudioPlaceholder from '../../assets/img/AudioPlaceholder.png';

export function Home() {
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const handlePlayed = (e) => {
        setPlayed(e.played)
    }

    const handlePlayPause = () => {
        setPlaying(!playing)
    }

    const seek = (playedRatio) => player.current.seekTo(playedRatio);
    const fastForward = (rate) => {
        if(playbackRate === 1)
            setPlaybackRate(2)
        else 
            setPlaybackRate(1)
    }

    const player = useRef();
    return (

        <div id="main" className="panel" >
            <Row justify="center">
                <Col span={12}>
                    <hgroup style={{ marginBottom: '15vh' }}>
                        <h1>Progress App</h1>
                        <h2>Binaural Technology</h2>
                    </hgroup>
                </Col>
            </Row>
            <Row justify="center">
                <Col xs={24} md={18} lg={16} xl={12}>
                    <div style={{ height: '33vh', position: 'relative' }}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src={AudioPlaceholder}
                            />
                        }
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
                                // onReady={() => console.log('Ready!')}
                                // onError={(e) => console.log(e)}
                                // onBuffer={() => console.log('buffer')}
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
                    </Card>
                    </div>
                </Col>
            
            </Row>

        </div>
    )
}
