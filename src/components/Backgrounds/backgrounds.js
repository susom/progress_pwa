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
            {/*<a href="#night" onClick={onSelect} name="night" className="bg night"><div/></a>*/}
            <a href="#norway" onClick={onSelect} name="norway" className="bg norway"><div/></a>
            <a href="#beach" onClick={onSelect} name="beach" className="bg beach"><div/></a>
            <a href="#fire" onClick={onSelect} name="fire" className="bg fire"><div/></a>
            <a href="#waterfall" onClick={onSelect} name="waterfall" className="bg waterfall"><div/></a>
            {/*<a href="#winter" onClick={onSelect} name="winter" className="bg winter"><div/></a>*/}
            <a href="#stillblue" onClick={onSelect} name="stillblue" className="bg stillblue"><div/></a>
        </aside>
    );
}

export default BackgroundSelection;