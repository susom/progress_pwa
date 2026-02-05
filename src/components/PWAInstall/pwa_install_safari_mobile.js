import guideSafari from "../../assets/img/GuideSafari.jpg";
import guideImage from "../../assets/img/GuideIOS.jpg";
import guideSafariAdd from "../../assets/img/guideSafariAdd.png";

const InstallPrompt = () => {
    return (
        <div className={`pwa_install safari`}>
                <p>The Calm Tool can be installed as an <b>iOS application</b> (iPhone, iPad) on your home screen using <b>Safari</b>.
                    This will enable offline use after being loaded for the first time.</p>

                <p><b>For iOS 15 and earlier:</b></p>
                <ol>
                    <li>
                        <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideSafari}></img>
                        <span>Tap the "Share" button at the bottom of the screen (pictured)</span>
                    </li>
                    <li>
                        <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideImage}></img>
                        <span>Tap "Add to Home Screen" from the menu that appears</span>
                    </li>
                    <li>
                        <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideSafariAdd}></img>
                        <span>Tap "Add" to confirm installation</span>
                    </li>
                </ol>

                <p><b>For devices running iOS 16 or later:</b></p>
                <ol>
                    <li>
                        <span>Tap the three-dot menu (⋯) at the bottom right corner of Safari</span>
                    </li>
                    <li>
                        <span>Tap the "Share" icon</span>
                    </li>
                    <li>
                        <span>Swipe up on the Share menu to reveal more options</span>
                    </li>
                    <li>
                        <span>Tap "Add to Home Screen", then tap "Add"</span>
                    </li>
                </ol>

                <p>An app icon will appear on your device's home screen!</p>
            </div>
    );
};

export default InstallPrompt;
