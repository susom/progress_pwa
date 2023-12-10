import guideSafari from "../../assets/img/GuideSafari.jpg";
import guideImage from "../../assets/img/GuideIOS.jpg";
import guideSafariAdd from "../../assets/img/guideSafariAdd.png";

const InstallPrompt = () => {
    return (
        <div className={`pwa_install safari`}>
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
            </div>
    );
};

export default InstallPrompt;
