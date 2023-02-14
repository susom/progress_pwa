import {createContext, useState} from 'react';
import {db_audios, db_sessions} from "../database/db";

export const DatabaseContext = createContext({
    data : {},
    setData : () => {}
});

export const DatabaseContextProvider = ({children}) => {
    const [data, setData] = useState({
        audios : db_audios,
        sessions : db_sessions
    });

    return (
        <DatabaseContext.Provider value={{data, setData}}>
            {children}
        </DatabaseContext.Provider>
    );
}