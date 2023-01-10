import React from "react";
import { useNavigate } from "react-router-dom";

export function Home(){
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/`);
    }

    return (
        <div>
            <h2>PROGRESS BINAURAL APP 1.0</h2>
        </div>
    )
}
