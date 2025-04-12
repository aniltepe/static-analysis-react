import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext, GridContext} from '../contexts';
import {ProjectFrame, ToolBar} from '../components';


export default function ProjectView() {
    const [horView, setHorView] = useState(1);
    const [verView, setVerView] = useState(1);

    

    return (
        <div style={{
            display: "flex", 
            flexFlow: "column",
            width: "100dvw",
            height: "calc(100dvh - 50px)"
        }}>
            <ToolBar></ToolBar>            
            <ProjectFrame></ProjectFrame>            
        </div>
    )
}