import guideChrome from "../../assets/img/guide_menu_chrome.jpg";
import guideInstall from "../../assets/img/guide_install_chrome.jpg";

const InstallPrompt = () => {
    return (
        <div className={`pwa_install android`}>
            <p>The Calm Tool can be installed as an app on your <b>Android device</b> using the <b>Google Chrome browser</b>.
                This will install an app icon on your home screen and enable offline use of the app after being loaded for the first time.</p>

            <br/>
            <ol>
                <li>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', verticalAlign: 'top' }} src={guideChrome} alt="Guide Chrome" />
                    <span>Tap the three-dot menu (⋮) in the top-right corner of Chrome (pictured)</span>
                </li>
                <li>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', verticalAlign: 'top' }} src={guideInstall} alt="Guide Install" />
                    <span>Tap "Add to Home Screen" from the menu that appears</span>
                </li>
                <li>
                    <span>Tap "Add" to confirm installation</span>
                </li>
                <li>
                    <span>An app icon will appear on your device's home screen!</span>
                </li>
            </ol>


        </div>
    );
};

export default InstallPrompt;


