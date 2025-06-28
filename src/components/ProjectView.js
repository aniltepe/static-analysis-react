import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectFrame} from '../components';
import { height, width } from '@mui/system';


export default function ProjectView() {
    const [frames, setFrames] = useState([{
        id: "init",
        cam: '3dp',
        width: [100, 0],
        height: [100, 80],
        top: [0, 80],
        left: [0, 0],
        ratio: 1.0,
        split: 0, // 0: None, 1: Vertical, 2: Horizontal
        part: 0, // 0: Init, 1: Original, 2: New
        parent: undefined
    }]);
    const dragLastPos = useRef(null);

    // useEffect(() => {
    //     console.log(frames)
    // }, [frames]);

    const verticalSplit = (frame) => {
        // const par = document.getElementById(frame.id);
        const fNew = [{
            id: frame.id + "_vsplit", 
            twin: frame.id + "_vnew", 
            cam: frame.cam, 
            split: 0,
            part: 1, 
            parent: {...frame, split: 1},
            ratio: 0.5,
            change: 0
        }, {
            id: frame.id + "_vnew", 
            twin: frame.id + "_vsplit", 
            cam: frame.cam, 
            split: 0,
            part: 2, 
            parent: {...frame, split: 1},
            ratio: 0.5,
            change: 0
        }];
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {...val, split: 1};
            }
        }), ...fNew];
        setFrames(fsNew);
    };

    const horizontalSplit = (frame) => {
        const fNew = [{
            id: frame.id + "_hsplit", 
            twin: frame.id + "_hnew", 
            cam: frame.cam, 
            split: 0,
            part: 1, 
            parent: {...frame, split: 2},
            ratio: 0.5,
            change: 0
        }, {
            id: frame.id + "_hnew", 
            twin: frame.id + "_hsplit", 
            cam: frame.cam, 
            split: 0,
            part: 2, 
            parent: {...frame, split: 2},
            ratio: 0.5,
            change: 0
        }];
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {...val, split: 2};
            }
        }), ...fNew];
        setFrames(fsNew);
    };

    const verticalDragStart = (evt, frame) => {
        // console.log(evt.clientX, "DRAGSTART");
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
    };

    const horizontalDragStart = (evt, frame) => {
        // console.log(evt.clientY, "DRAGSTART");
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
    };

    const verticalDrag = (evt, frame) => {
        if (evt.clientX === 0 && evt.clientY === 0) {
            return;
        }
        const par = document.getElementById(frame.parent.id);
        // console.log(par, par.clientWidth, par.offsetLeft)
        const deltaX = ((evt.clientX - dragLastPos.current.x)) / par.clientWidth;
        if (Math.abs(deltaX) < 0.04) {
            return;
        }
        const tolerance = 100;
        if (evt.clientX - par.offsetLeft < tolerance ||
            evt.clientX - par.offsetLeft > par.clientWidth - tolerance) {
            return;
        }
        // const children = document.querySelectorAll('[id^="' + frame.id + '"]');
        // for (let i = 0; i < children.length; i++) {
        //     if (children.item(i).clientWidth - (evt.clientX - dragLastPos.current.x) < tolerance) {
        //         return;
        //     }
        // }        
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        console.log("delta X:", deltaX);
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {...val, ratio: val.ratio + deltaX};
            }
            else if (val.id === frame.twin) {
                return {...val, ratio: val.ratio - deltaX};        
            }
            else {
                // console.log("id: ", val.id, "deltaX:", deltaX);
                if (val.id === "init") {
                    return val;
                }
                let items = [];
                let item = JSON.parse(JSON.stringify(val.parent));
                while (true) {
                    if (item === undefined) {
                        break;
                    }
                    if (item.id === frame.id) {
                        item = {...item, ratio: item.ratio + deltaX}
                    }
                    else if (item.id === frame.twin) {
                        item = {...item, ratio: item.ratio - deltaX}
                    }
                    items.unshift(item);
                    item = item.parent;
                }
                for (let i = 0; i < items.length - 1; i++) {
                    console.log(items[i+1].id, items[i+1].ratio)
                    items[i + 1].parent = items[i];
                }
                // console.log(val.id, items[items.length - 1]);
                return {...val, parent: items[items.length - 1], change: val.change+1};
            }
        })];
        setFrames(fsNew);        
    };

    const horizontalDrag = (evt, frame) => {
        if (evt.clientX === 0 && evt.clientY === 0) {
            return;
        }
        const par = document.getElementById(frame.parent.id);
        const deltaY = ((evt.clientY - dragLastPos.current.y)) / par.clientHeight;
        if (Math.abs(deltaY) < 0.04) {
            return;
        }
        const tolerance = 100;
        if (evt.clientY - par.offsetTop < tolerance ||
            evt.clientY - par.offsetTop > par.clientHeight - tolerance) {
            return;
        }
        // const children = document.querySelectorAll('[id^="' + frame.id + '"]');
        // for (let i = 0; i < children.length; i++) {
        //     if (children.item(i).clientHeight + (evt.clientY - dragLastPos.current.y) < tolerance) {
        //         return;
        //     }
        // }  
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {...val, ratio: val.ratio + deltaY};
            }
            else if (val.id === frame.twin) {
                return {...val, ratio: val.ratio - deltaY};        
            }
            else {
                if (val.id === "init") {
                    return val;
                }
                let items = [];
                let item = JSON.parse(JSON.stringify(val.parent));
                while (true) {
                    if (item === undefined) {
                        break;
                    }
                    if (item.id === frame.id) {
                        item = {...item, ratio: item.ratio + deltaY}
                    }
                    else if (item.id === frame.twin) {
                        item = {...item, ratio: item.ratio - deltaY}
                    }
                    items.unshift(item);
                    item = item.parent;
                }
                for (let i = 0; i < items.length - 1; i++) {
                    items[i + 1].parent = items[i]
                }
                console.log(val.id, items[items.length - 1]);
                return {...val, parent: items[items.length - 1], change: val.change+1};
            }
        })];
        setFrames(fsNew);        
    };

    const camChange = (frame, mode) => {
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {...val, cam: mode};
            }
        })];
        setFrames(fsNew);
    };

    const closeFrame = (frame) => {
        const fsNew = [...frames.map((val) => {            
            if (val.id === frame.twin) {
                let newVal = {...val, 
                    id: val.parent.id,
                    twin: val.parent.twin,
                    ratio: val.parent.ratio,
                    part: val.parent.part, 
                    parent: val.parent.parent};
                if (val.parent.id === "init") {
                    newVal = {...newVal, 
                        width: val.parent.width,
                        height: val.parent.height,
                        top: val.parent.top,
                        left: val.parent.left};
                }
                return newVal;
            }
            else if (val.id !== frame.id && val.id !== frame.parent.id) {
                const items = [];
                let item = val.parent;
                while (true) {
                    if (item === undefined) {
                        break;
                    }
                    if (item.id === frame.twin) {
                        if (item.parent.id === "init") {
                            item = {...item, 
                                width: item.parent.width,
                                height: item.parent.height,
                                top: item.parent.top,
                                left: item.parent.left};
                        }
                        item = {...item, 
                            id: item.parent.id,
                            twin: item.parent.twin,
                            ratio: item.parent.ratio,
                            part: item.parent.part, 
                            parent: item.parent.parent};
                        
                    }
                    items.unshift(item);
                    item = item.parent;
                }
                for (let i = 0; i < items.length - 1; i++) {
                    items[i + 1].parent = items[i]
                }
                return {...val, parent: items[items.length - 1], change: val.change+1};
            }
        }).filter((val) => val !== undefined)];
        setFrames(fsNew);
    };

    return (
        <div style={{
            display: "flex", 
            flexFlow: "column",
            width: "100dvw",
            height: "calc(100dvh - 80px)"
        }}> 
            { frames.map((val, idx) => {
                return (
                    <ProjectFrame
                        key={val.id}
                        idx={idx}
                        {...val}
                        versplit={verticalSplit}
                        horsplit={horizontalSplit}
                        verdrag={verticalDrag}
                        hordrag={horizontalDrag}
                        verdragstart={verticalDragStart}
                        hordragstart={horizontalDragStart}
                        camchange={camChange}
                        close={closeFrame} /> 
                )         
            })}  
        </div>
    )
}