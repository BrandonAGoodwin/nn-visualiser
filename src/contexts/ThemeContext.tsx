import React, { useState, createContext } from "react";

export const ThemeContext = createContext({
    background: "linear-gradient(207deg, rgba(255,118,97,1) 0%, rgba(34,55,129,1) 100%)",
    minColour: "#223781",
    minColourName: "blue",
    midColour: "#FFFFFF",
    midColourName: "white",
    maxColour: "#ff7661",
    maxColourName: "orange"
});

interface ThemeProps {
    children: React.ReactChild | React.ReactChild[];
}

export const ThemeProvider = (props: ThemeProps) => {
    const [theme, setTheme] = useState({
        background: "linear-gradient(207deg, rgba(255,118,97,1) 0%, rgba(34,55,129,1) 100%)",
        minColour: "#223781",
        minColourName: "blue",
        midColour: "#FFFFFF",
        midColourName: "white",
        maxColour: "#ff7661",
        maxColourName: "orange"
    })
    
    return(
        <ThemeContext.Provider value={{
            background: "linear-gradient(207deg, rgba(255,118,97,1) 0%, rgba(34,55,129,1) 100%)",
            minColour: "#223781",
            minColourName: "blue",
            midColour: "#FFFFFF",
            midColourName: "white",
            maxColour: "#ff7661",
            maxColourName: "orange"
        }}>
            {props.children}
        </ThemeContext.Provider>
    );
}