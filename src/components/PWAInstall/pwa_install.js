// Import necessary libraries
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Download , XSquare, PersonFillLock, PersonLock, PersonCheck } from 'react-bootstrap-icons';
import { BrowserView, MobileView } from 'react-device-detect';

import AndroidInstallPrompt from "./pwa_install_android";

import "./pwa_install.css";

import browser_install_1 from "../../assets/img/desktop_chrome_install_1.png";
import browser_install_2 from "../../assets/img/desktop_chrome_install_2.png";
import guideImage from '../../assets/img/GuideIOS.jpg';
import guideSafari from '../../assets/img/GuideSafari.jpg';
import guideSafariAdd from '../../assets/img/guideSafariAdd.png';

// Detect device type (iOS or Android)
const getDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }
    if (/android/i.test(userAgent)) {
        return 'Android';
    }
    return 'unknown';
};

// Update the PWAInstallModal component to display device-specific instructions
const PWAInstallModal = (props) => {
    const [show, setShow]   = useState(false);
    const deviceType        = getDeviceType();

    const handleToggle = () => setShow(!show);

    const renderInstructions = () => {
        if (deviceType === 'Android') {
            return (
                <AndroidInstallPrompt/>
            );
        }else{
            //iOS or Unknwo
            return (
                <>
                    <BrowserView className={`pwa_install`}>
                        <p>The Calm Tool can be installed as an <b>desktop/laptop</b> application on your home screen using <b>Google Chrome</b>.
                            This will enable offline use after being loaded for the first time.
                            Please follow the instructions below.</p>
                        <p>The Discovery Tool can be installed as an app on your <b>desktop or laptop</b> from the <b>Google Chrome Browser</b>.
                            This will enable offline use of the app after being loaded for the first time.</p>
                        <ol>
                            <li >
                                <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={browser_install_1}></img>
                                <span>Click on the pictured icon in your URL bar</span>
                            </li>
                            <li >
                                <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={browser_install_2}></img>
                                <span>Confirm installation by clicking on the "Install" button</span>
                            </li>
                        </ol>
                    </BrowserView>
                    <MobileView className={`pwa_install`}>
                        <p>The Calm Tool can be installed as an <b>IOS application</b> (iPhone, iPad) on your home screen using <b>Safari</b>.
                            This will enable offline use after being loaded for the first time.
                            Please follow the instructions.</p>
                        <ol>
                            <li >
                                <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideSafari}></img>
                                <span>Click on the share icon at the bottom of the Safari window (pictured)</span>
                            </li>
                            <li >
                                <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideImage}></img>
                                <span>Click on "Add to Home Screen" from the context menu that pops up</span>
                            </li>
                            <li >
                                <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideSafariAdd}></img>
                                <span>Confirm installation by clicking on "Add"</span>
                            </li>
                            <li >
                                <span>Finally an app icon will appear somewhere on your device's homescreen!</span>
                            </li>
                        </ol>
                    </MobileView>
                </>
            )
        }
    };

    return (
        <>
            <div className={`pwa_install_btn`}>
                <Download className={`install_instructions`} onClick={handleToggle}/>
            </div>
            <Modal show={show} onHide={handleToggle} className={`install_modal`}>
                <Modal.Header>
                    <Modal.Title>App Installation Instructions</Modal.Title>
                    <XSquare onClick={handleToggle} className={`modal_close_x_btn`}/>
                </Modal.Header>
                <Modal.Body>
                    {renderInstructions()}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PWAInstallModal;