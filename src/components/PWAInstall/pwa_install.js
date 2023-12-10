// Import necessary libraries
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Download , XSquare, PersonFillLock, PersonLock, PersonCheck } from 'react-bootstrap-icons';
import { BrowserView, MobileView } from 'react-device-detect';

import ChromeMobileInstallPrompt from "./pwa_install_chrome_mobile";

import SafariMobileInstallPrompt from "./pwa_install_safari_mobile";

import EdgeMobileInstallPrompt from "./pwa_install_edge_mobile";

import UnsupportedMobile from "./pwa_install_unsupported_mobile";



import "./pwa_install.css";



// Detect device type (iOS or Android)
// Updated getDeviceType function
const getDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for Firefox
    if (/firefox/i.test(userAgent) || /FxiOS/i.test(userAgent)) {
        return 'Firefox';
    }

    // Check for Edge
    if (/Edg\//.test(userAgent) || /EdgiOS/i.test(userAgent) || /EdgA/i.test(userAgent)) {
        if(isIOS()){
            return 'EdgeIOS';
        }else{
            return 'Edge'
        }
    }

    // Check for Safari on iOS devices and Desktop Safari
    if ((/iPad|iPhone|iPod/.test(userAgent) || /safari/i.test(userAgent)) && !/chrome|chromium|crios/i.test(userAgent) && !window.MSStream) {
        return 'Safari';
    }

    // Default to Chrome if browser is not Firefox, Edge, or Safari
    if(isIOS()){
        return 'ChromeIOS';
    }else{
        return 'Chrome'
    }
};

const isIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

// alert(getDeviceType());
// alert(isIOS());
// Update the PWAInstallModal component to display device-specific instructions
const PWAInstallModal = (props) => {
    const [show, setShow]   = useState(false);
    const deviceType        = getDeviceType();

    const handleToggle = () => setShow(!show);

    const renderInstructions = () => {
        switch (deviceType) {
            case 'Chrome':
                return (
                    <>
                        <MobileView>
                            <ChromeMobileInstallPrompt />
                        </MobileView>
                    </>
                );
                break;
            case 'Safari':
                return (
                    <>
                        <MobileView>
                            <SafariMobileInstallPrompt />
                        </MobileView>
                    </>
                );
            case 'EdgeIOS':
                return (
                    <>
                        <MobileView>
                            <EdgeMobileInstallPrompt />
                        </MobileView>
                    </>
                );
                break;
            default:
                // Handle other cases or provide a default message
                return (
                    <>
                        <MobileView>
                            <UnsupportedMobile isIOS={isIOS()} deviceType={deviceType}/>
                        </MobileView>
                    </>
                );
        }
    };




    return (
        <>
            <MobileView>
                <div className={`pwa_install_btn`}>
                    <Download className={`install_instructions`} onClick={handleToggle}/>
                </div>
            </MobileView>
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