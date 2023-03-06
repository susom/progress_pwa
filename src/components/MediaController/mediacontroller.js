import React, { useState, useEffect } from "react";
import { Slider, Button, Dropdown, Space} from 'antd';
import { CaretRightOutlined, PauseOutlined, DownOutlined, CheckCircleTwoTone} from '@ant-design/icons';

import './mediacontroller.css'

export const MediaController = ({ playing, playedRatio, handlePlayPause, seek, selected, files, onAudioSelect }) => {
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
        return {
            key: e,
            label: e.includes("short") ? 'Audio short (~10 min)' : 'Audio Long (~30 min)',
            icon: e === selected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : undefined,
            disabled: e === selected ? true : false
        }
    })
    
    return (
        <div className="media-controller" style={{marginBottom: '35px'}}>
            <Dropdown
                placement="top"
                menu={{items, onClick}}
            >
                <a onClick={(e) => e.preventDefault()}>
                <Space>
                    {selected.includes("short") ? 'Audio short (~10 min)' : 'Audio long (~30 min)' }
                    {/* {selected} */}
                    <DownOutlined />
                </Space>
                </a>
                
            </Dropdown>
            
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
            </div>
        </div>
    )
}