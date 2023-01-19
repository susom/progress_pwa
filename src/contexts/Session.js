import {createContext, useState} from 'react';

export const SessionContext = createContext({
    data : {},
    setData : () => {}
});

export const SessionContextProvider = ({children}) => {
    const [data, setData] = useState({
        user_id : null,
        splash_viewed : false,
        current_page : [],
        session_start : null,
        session_end : null, 
        background: 'norway'
    });

    return (
        <SessionContext.Provider value={{data, setData}}>
            {children}
        </SessionContext.Provider>
    );
}