import React from "react";
import { useNavigate } from "react-router-dom";

import "../../assets/skin/pink.flag/css/jplayer.pink.flag.css";
import "../../assets/css/view_home.css";

export function Home(){
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/`);
    }

    return (
        <div id="main" className="panel">
            <hgroup>
                <h1>Progress App</h1>
                <h2>Binaural Technology</h2>
            </hgroup>

            <div className='player'>
                <div id="jquery_jplayer_1" className="jp-jplayer"></div>
                <div id="jp_container_1" className="jp-audio" role="application" aria-label="media player">
                    <div className="jp-type-single">
                        <h5 id='alias'>Hi, <i></i></h5>
                        <div className="jp-gui jp-interface">
                            <div className="jp-volume-controls">
                              <button className="jp-mute" role="button" tabIndex="0">mute</button>
                              <button className="jp-volume-max" role="button" tabIndex="0">max volume</button>
                              <div className="jp-volume-bar">
                                <div className="jp-volume-bar-value"></div>
                              </div>
                            </div>
                            <div className="jp-controls-holder">
                                <div className="jp-controls">
                                    <button className="jp-play" role="button" tabIndex="0"></button>
                                    <button className="jp-stop" role="button" tabIndex="0">Reset</button>
                                </div>
                                <div className="jp-progress">
                                    <div className="jp-seek-bar">
                                        <div className="jp-play-bar"></div>
                                    </div>
                                </div>
                                <div className="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
                                <div className="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                            </div>
                        </div>
                        <div className="jp-details">
                            <div className="jp-title" aria-label="title">&nbsp;</div>
                        </div>
                        <div className="jp-no-solution">
                            <span>Update Required</span>
                            To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                        </div>
                        <aside>
                            <a href="#" className="btn logit">Finish & <span>Upload</span> Listen</a>
                        </aside>
                    </div>
                </div>
            </div>


        </div>
    )
}
