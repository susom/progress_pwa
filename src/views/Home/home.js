import React, { useState, useRef, useContext} from "react";
import {SessionContext} from '../../contexts/Session';
import ReactPlayer from 'react-player';
import { Card, Col, Row, Button, Drawer } from 'antd';
import MediaController from "../../components/MediaController";
import "../../assets/skin/pink.flag/css/jplayer.pink.flag.css";
import "../../assets/css/view_home.css";
import mp3 from "../../assets/audio/R01_Beth_wBeats.mp3";
import AudioPlaceholder from '../../assets/img/music-notes-fill.svg';
import BackgroundSelection from "../../components/Backgrounds";

export function Home() {
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [transparent, setTransparent] = useState(true)
    const [drawerVisible, setDrawerVisible] = useState(false);

    const context = useContext(SessionContext)
    const player = useRef();
    const handlePlayed = (e) => {
        setPlayed(e.played)
    }

    const handlePlayPause = () => {
        setPlaying(!playing)
    }

    const seek = (playedRatio) => player.current.seekTo(playedRatio);
    const fastForward = () => {
        if(playbackRate === 1)
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
                placement="left" 
                onClose={()=>setDrawerVisible(false)} 
                open={drawerVisible}
                closable={false}
            >
                <BackgroundSelection/>
            </Drawer>
            <Row justify="center">
                <Col span={12}>
                    <hgroup style={{ marginBottom: '15vh' }}>
                        <h1>Progress App</h1>
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
                        cover={
                            <img
                                style={{maxWidth: '70px', display:'block', marginLeft:'auto', marginRight: 'auto'}}
                                alt="example"
                                src={AudioPlaceholder}
                            />
                        }
                    >
                        <div className='player-wrapper' >
                            <Button onClick={()=>    setDrawerVisible(true)}>Change Background</Button>
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
                    </Card>
                </Col>
            
            </Row>
            </div>
        </div>
    )
}
