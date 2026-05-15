import React, { useState, useEffect } from "react";
import { Slider, Button, Dropdown, Space} from 'antd';
import { CaretRightOutlined, PauseOutlined, DownOutlined, CheckCircleTwoTone} from '@ant-design/icons';
import { Repeat } from 'react-bootstrap-icons';

import './mediacontroller.css'

const AUDIO_LABELS = {
    Audio_short: 'Rachel (10-min)',
    binaural_spanish_20m: 'Español (20-min)',
    Male_binaural_20m: 'Thomas (20-min)',
    Male_binaural_10m: 'Thomas (10-min)',
    AUS_female_20m: 'Sara (20-min)',
    AUS_female_10m: 'Sara (10-min)',
    Anna_20m: 'Anna (20-min)',
    Anna_10m: 'Anna (10-min)',
    Nathan_20m: 'Nathan (20-min)',
    Nathan_10m: 'Nathan (10-min)',
};

const getAudioLabel = (filepath) =>
    Object.entries(AUDIO_LABELS).find(([k]) => filepath.includes(k))?.[1] ?? 'Rachel (20-min)';

export const MediaController = ({ children, playing, playedRatio, handlePlayPause, seek, selected, files, onAudioSelect, loop, handleLoopToggle}) => {
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
    const items = files.map((e) => ({
        key: e,
        label: getAudioLabel(e),
        icon: e === selected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : undefined,
        disabled: e === selected,
    }))

    return (
        <div className="media-controller" style={{marginBottom: '35px'}}>
            <div style={{paddingBottom: '3px', textAlign: 'right'}}>
                {children}
                <Dropdown
                    menu={{items, onClick}}
                    placement={`topRight`}
                >
                    <span style={{cursor: 'pointer'}}>
                    <Space>
                        {getAudioLabel(selected)}
                        <DownOutlined />
                    </Space>
                    </span>
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
