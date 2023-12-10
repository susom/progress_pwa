import guideChrome from "../../assets/img/guide_menu_chrome.jpg";
import guideInstall from "../../assets/img/guide_install_chrome.jpg";

const InstallPrompt = () => {
    return (
        <div className={`pwa_install android`}>
            <p>The Calm Tool can be installed as an app on your <b>Android device</b> using the <b>Chrome browser</b>.
                This will install an app icon on your home screen and enable offline use of the app after being loaded for the first time.</p>

            <br/>
            <ol>
                <li>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', verticalAlign: 'top' }} src={guideChrome} alt="Guide Chrome" />
                    <span>Click on the 3 vertical dot icon at the top of the window (pictured)</span>
                </li>
                <li>
                    <img style={{ maxWidth: '85%', borderRadius: '10px', verticalAlign: 'top' }} src={guideInstall} alt="Guide Install" />
                    <span>Click on "Install App" from the context menu that pops up</span>
                </li>
                <li>
                    <span>Confirm installation by clicking on "Add"</span>
                </li>
                <li>
                    <span>Finally an app icon will appear somewhere on your device's home screen!</span>
                </li>
            </ol>


        </div>
    );
};

export default InstallPrompt;


