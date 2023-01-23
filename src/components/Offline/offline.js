import { useEffect, useState } from 'react';
import { Drawer, Col, Row } from 'antd';
import wifi from '../../assets/img/wifi-connection-offline-icon.png'
import './offline.css'

export default function Offline({ children }) {
    const [online, setOnline] = useState(window.navigator.onLine)
    const [open, setOpen] = useState(!online)
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        function handleOnline() {
            setOnline(true)
            setOpen(false)
        }
        function handleOffline() {
            setOnline(false)
            setOpen(true)
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }

    }, []);

    return (
        <>
            <Drawer
                // title="You are offline Please check your internet connection."
                placement="top"
                closable={false}
                height="100px"
                onClose={onClose}
                open={open}
            >
                <Row align="middle" justify='center'>
                    <img style={{display: 'inline', marginRight: '35px'}} width={40} src={wifi}></img>
                    <div style={{display: 'inline'}}>
                        <h3>You are offline!</h3>
                        <p>Please check your internet connection.</p>
                    </div>
                </Row>
            </Drawer>
            {children}
        </>
    );
}