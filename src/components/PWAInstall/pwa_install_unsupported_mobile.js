
const InstallPrompt = ({ isIOS, deviceType }) => {
    let notSupportedMessage;
    let suggestedBrowsers;

    if (isIOS) {
        notSupportedMessage = `The Calm Tool installation is not supported for ${deviceType}.`;
        suggestedBrowsers = 'Safari or Edge';
    } else {
        if (deviceType === 'Edge') {
            notSupportedMessage = 'The Calm Tool installation is not supported for Edge on Android devices.';
        } else {
            notSupportedMessage = `The Calm Tool installation is not supported for ${deviceType}.`;
        }
        suggestedBrowsers = 'Chrome';
    }

    return (
        <div className={`pwa_install unsupported`}>
            <p>{notSupportedMessage} You may still use this while online in this browser.</p>
            <p>In order to install the app for offline usage, please open the web site URL in one of the following browsers: <b>{suggestedBrowsers}</b>.</p>
        </div>
    );
};

export default InstallPrompt;



