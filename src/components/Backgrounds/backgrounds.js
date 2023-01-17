import {useContext} from "react";
import {SessionContext} from "../../contexts/Session";

import "../../assets/css/backgrounds.css";

function BackgroundSelection (){
    const session_context   = useContext(SessionContext);
    const onSelect = (e) => {
        if(e.target.name) {
            session_context.setData({
                ...session_context, 
                background: e.target.name
            })
        }
    }

    return (
        <aside id="bgs">
            {/* <a href="#" className="handle">Choose Background</a> */}
            <a href="#" onClick={onSelect} name="norway" className="bg norway"></a>
            <a href="#" onClick={onSelect} name="night" className="bg night"></a>
            <a href="#" onClick={onSelect} name="beach" className="bg beach"></a>
            <a href="#" onClick={onSelect} name="fire" className="bg fire"></a>
            <a href="#" onClick={onSelect} name="waterfall" className="bg waterfall"></a>
            <a href="#" onClick={onSelect} name="winter" className="bg winter"></a>
            <a href="#" onClick={onSelect} name="stillblue" className="bg stillblue"></a>
        </aside>
    );
}

export default BackgroundSelection;