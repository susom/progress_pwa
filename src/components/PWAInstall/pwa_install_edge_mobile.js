import guideEdge from "../../assets/img/guide_menu_edge.jpg";
import guideShareEdge from "../../assets/img/guide_share_edge.jpg"
import guideImage from "../../assets/img/GuideIOS.jpg";
import guideSafariAdd from "../../assets/img/guideSafariAdd.png";

const InstallPrompt = () => {
    return (
        <div className={`pwa_install safari`}>
            <p>The Calm Tool can be installed as an application to your home screen using <b>Microsoft Edge</b>.
                This will enable offline use after being loaded for the first time.
                Please follow the instructions.</p>
            <ol>
                <li >
                    <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideEdge}></img>
                    <span>Click on the menu icon at the bottom of the Edge window (circled in red)</span>
                </li>
                <li >
                    <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideShareEdge}></img>
                    <span>Click on the share icon in the context menu (circled in red)</span>
                </li>
                <li >
                    <img style={{ maxWidth: '85%', borderRadius: '10px', display: 'block' }} src={guideImage}></img>
                    <span>Find and Click on "Add to Home Screen" from the context menu that pops up</span>
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
