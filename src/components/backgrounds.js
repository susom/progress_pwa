import {useContext} from "react";
import {SessionContext} from "../contexts/Session";

import "../assets/css/backgrounds.css";

function BackgroundSelection (){
    const session_context   = useContext(SessionContext);

    return (
        <aside id="bgs">
            <a href="#" className="handle">Chose Background</a>
            <a href="#" data-bg="bluewaters" className="bg bluewaters"></a>
            <a href="#" data-bg="seashell" className="bg seashell"></a>
            <a href="#" data-bg="stillblue" className="bg stillblue"></a>
            <a href="#" data-bg="beach" className="bg beach"></a>
            <a href="#" data-bg="carribean" className="bg carribean"></a>
            <a href="#" data-bg="norway" className="bg norway"></a>
            <a href="#" data-bg="night" className="bg night"></a>
        </aside>
    );
}

export default BackgroundSelection;