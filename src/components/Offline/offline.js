import { useEffect, useState } from 'react';
import { Drawer, Row, Button} from 'antd';
import { EyeInvisibleOutlined, FileTextOutlined } from '@ant-design/icons';
// import Guide from '../../components/Guide';
import wifi from '../../assets/img/wifi-connection-offline-icon.png';
import './offline.css'

export default function Offline({ children }) {
    const [online, setOnline] = useState(window.navigator.onLine)
    const [open, setOpen] = useState(!online)
    // const isInStandaloneMode = (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')
    const [installOpen, setInstallOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const isIOS = () => {
    //     var userAgent = window.navigator.userAgent.toLowerCase();
    //     return /iphone|ipad|ipod/.test(userAgent);
    // };

    // Check if device is mobile
    const isMobile = () => {
        let hasTouchScreen = false;
        if ("maxTouchPoints" in navigator) {
            hasTouchScreen = navigator.maxTouchPoints > 0
        } else if ("msMaxTouchPoints" in navigator) {
            hasTouchScreen = navigator.msMaxTouchPoints > 0
        } else {
            const mQ = matchMedia?.("(pointer:coarse)")
            if (mQ?.media === "(pointer:coarse)") {
                hasTouchScreen = !!mQ.matches;
            } else if ("orientation" in window) {
                hasTouchScreen = true // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                const UA = navigator.userAgent.toLowerCase()
                hasTouchScreen =
                    /\b(blackberry|webos|iphone|iemobile)\b/i.test(UA) ||
                    /\b(android|windows phone|ipad|ipod)\b/i.test(UA);
            }
        }
        return hasTouchScreen
    }

    
    const onClose = () => {
        setOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const onCloseInstall = () => {
        setInstallOpen(false)
    }

    
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
                placement="top"
                closable={false}
                height="100px"
                onClose={onClose}
                open={open}
                className='offline'
            >
                <Row align="middle" justify='center'>
                    <img alt='wifi' style={{ display: 'inline', marginRight: '35px' }} width={40} src={wifi}></img>
                    <div style={{ display: 'inline' }}>
                        <h3 style={{margin: '10px'}}>You are offline!</h3>
                        <p>Please check your internet connection.</p>
                    </div>
                </Row>
            </Drawer>
            {/* {!isInStandaloneMode && isMobile() && */}
                <>
                    <Drawer
                        className='installprompt'
                        placement="bottom"
                        closable={false}
                        height='110px'
                        style={{ boxShadow: 'none' }}
                        open={installOpen}
                        onClose={onCloseInstall}
                        nm='install'
                    >
                        <Row align="middle" justify='center'>
                            <div style={{ display: 'inline' }}>
                                <h4>This app can be installed as an application</h4>
                            </div>

                        </Row>
                        <Row align="middle" justify='center'>
                            <Button style={{ marginRight: '5px' }} icon={<EyeInvisibleOutlined />} onClick={onCloseInstall}>Hide</Button>
                            <Button icon={<FileTextOutlined />} onClick={showModal}>Instructions</Button>
                        </Row>

                    </Drawer>
                    {/* <Guide
                        open={isModalOpen}
                        onClose={showModal}
                    /> */}
                </>
            {/* } */}
            {/* {
                Children.map(
                    children, 
                    child => cloneElement(child, { isOnline: online })
                  )
            } */}
            {children}
        </>
    );
}