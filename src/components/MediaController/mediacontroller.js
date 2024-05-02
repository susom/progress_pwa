import React, { useState, useEffect } from "react";
import { Slider, Button, Dropdown, Space} from 'antd';
import { CaretRightOutlined, PauseOutlined, DownOutlined, CheckCircleTwoTone} from '@ant-design/icons';
import { Repeat } from 'react-bootstrap-icons';

import './mediacontroller.css'
// import {PersonCheck, PersonLock} from "react-bootstrap-icons";

export const MediaController = ({ children, playing, playedRatio, handlePlayPause, seek, selected, files, onAudioSelect , userInformation, navigate, logout, loop, handleLoopToggle}) => {
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
    
    // On audio select handler
    const onClick = ({ key }) => {
        onAudioSelect(key)
    };

    useEffect(() => {
        if (progressEnabled){
            setValue(playedRatio * 100)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedRatio])



    const handlePlay = () => handlePlayPause()

    const renderPlay = playing ? <PauseOutlined /> : <CaretRightOutlined />
    const items = files.map((e,i) => { //name has to be items for antd
        let file_display = e.includes("short") ? '10 Minute Audio' : '20 Minute Audio';
        file_display =  e.includes("spanish") ? '20 Minute Spanish Audio' : file_display;
        file_display =  e.includes("Male") ? 'Male Audio' : file_display;

        return {
            key: e,
            label: file_display ,
            icon: e === selected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : undefined,
            disabled: e === selected ? true : false
        }
    })
    
    return (
        <div className="media-controller" style={{marginBottom: '35px'}}>
            <div style={{paddingBottom: '3px', textAlign: 'right'}}>
                {children}
                <Dropdown
                    disabled={playing}
                    menu={{items, onClick}}
                    placement={`topRight`}
                >
                    <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        {selected.includes("short") ? '10 Minute Audio' : (selected.includes("spanish")) ? '20 Minute Spanish Audio': '20 Minute Audio' }
                        {/* {selected} */}
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </div>
            <div className="icon-wrapper">
                <Button size="large" icon={renderPlay} onClick={handlePlay} />
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
                    // trackStyle={{color: 'red'}}
                    // railStyle={{color:'red'}}
                    // handleStyle
                />
                <div className={`repeat_icon`}>
                    <Repeat
                        size={24}
                        style={loop ? {
                            color: 'green',
                        } : {
                            color: '#ccc',
                        }
                        }
                        onClick={() => {
                            handleLoopToggle();
                        }}
                    />
                    <i>Repeat</i>
                </div>
            </div>
        </div>
    )
}