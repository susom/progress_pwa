import React, { useState, useEffect } from "react";
import { Slider, Button } from 'antd';
import { CaretRightOutlined, PauseOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons';
import './mediacontroller.css'

export const MediaController = ({ playing, playedRatio, handlePlayPause, seek, fastForward, playbackRate }) => {
    const [value, setValue] = useState(0);
    const [progressEnabled, setProgressEnabled] = useState(true)
    const formatter = (value) => `${value}%`;
    const onAfterChange = (e) => {
        if(e){
            let formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,      
                maximumFractionDigits: 2,
            });
            setValue(e)
            seek(formatter.format(e/100))
        }
        
        setProgressEnabled(true)
    }
    const onChange = (e) => {
        setProgressEnabled(false)
        setValue(e)
    }
    
    useEffect(() => {
        if (progressEnabled){
            setValue(playedRatio * 100)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedRatio])

    
    const handlePlay = () => handlePlayPause()
    
    const handleFastForward = () => {
       fastForward()
    }

    const renderFastForward = playbackRate === 1 ? <RightOutlined /> : <DoubleRightOutlined />
    const renderPlay = playing ? <PauseOutlined /> : <CaretRightOutlined />
    
    return (
        <div className="media-controller" style={{marginBottom: '35px'}}>
            <div className="icon-wrapper">
                <Button icon={renderPlay} onClick={handlePlay} />
                <Slider
                    min={0}
                    max={100}
                    onChange={onChange}
                    value={value}
                    step={0.01}
                    onAfterChange={onAfterChange}
                    tooltip={{
                        formatter
                    }}
                />
                <Button 
                    className="redo" 
                    icon={renderFastForward} 
                    onClick={handleFastForward}
                />
            </div>
        </div>
    )
}