import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext} from '../contexts';
import {ProjectCanvas} from '../components';

export default function ProjectFrame() {
    return (
        <div style={{
            display: "flex", 
            flexFlow: "column",
            backgroundColor: "gray",
            width: "100dvw",
            height: "calc(100dvh - 80px)"
        }}>
            <ProjectCanvas></ProjectCanvas>
        </div>
    )
}