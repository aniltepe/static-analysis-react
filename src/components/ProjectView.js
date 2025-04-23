import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext, GridContext} from '../contexts';
import {ProjectFrame} from '../components';
import { height, width } from '@mui/system';


export default function ProjectView() {
    // const [frames, setFrames] = useState([{
    //     id: "init",
    //     cam: '3dp',
    //     width: [100, 0],
    //     height: [100, 80],
    //     top: [0, 80],
    //     left: [0, 0],
    // }]);
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
    }]);
    const dragLastPos = useRef(null);

    useEffect(() => {
        console.log(frames)
    }, [frames]);

    const verticalSplit = (frame) => {
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

    const verticalSplit2 = (frame) => {
        const newWidth = frame.width.map((val) => val/2);
        const fNew = [{
            id: frame.id + "_vsplit", 
            cam: frame.cam, 
            width: newWidth, 
            height: frame.height,
            top: frame.top,
            left: frame.left,
            ratio: 0.5,
            twin: frame.id + "_vsnew",
            // parent: {id: frame.id, width: frame.width, height: frame.height, top: frame.top, left: frame.left}
            parent: frame
        }, {
            id: frame.id + "_vsnew", 
            cam: frame.cam, 
            width: newWidth, 
            height: frame.height,
            top: frame.top,
            left: frame.left.map((val, idx) => val + newWidth[idx]),
            ratio: 0.5,
            twin: frame.id + "_vsplit",
            // parent: {id: frame.id, width: frame.width, height: frame.height, top: frame.top, left: frame.left}
            parent: frame
        }];
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {
                    ...val, 
                    child1: val.id + "_vsplit",
                    child2: val.id + "_vsnew",
                    splitted: true
                };
            }
        }), ...fNew];
        setFrames(fsNew);
    };

    const verticalSplit1 = (frame) => {
        const newWidth = frame.width.map((val) => val/2);
        const fNew = {
            id: frame.id + "_vsnew", 
            cam: frame.cam, 
            width: newWidth, 
            height: frame.height,
            top: frame.top,
            left: frame.left.map((val, idx) => val + newWidth[idx]),
            ratio: 0.5,
            twin: frame.id + "_vsplit"
        };
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {
                    ...val, 
                    id: val.id + "_vsplit", 
                    width: val.width.map((w) => w/2),
                    ratio: 0.5,
                    twin: val.id + "_vsnew"
                };
            }
        }), fNew];
        setFrames(fsNew);
    };

    const horizontalSplit1 = (frame) => {
        const newHeight = frame.height.map((val) => val/2);
        const fNew = {
            id: frame.id + "_hsnew", 
            cam: frame.cam, 
            width: frame.width, 
            height: newHeight,
            top: [frame.top[0] + newHeight[0], frame.top[1] - newHeight[1]],
            left: frame.left,
            ratio: 0.5,
            twin: frame.id + "_hsplit"
        };
        const fsNew = [...frames.map((val) => {
            if (val.id !== frame.id) {
                return val;
            }
            else {
                return {
                    ...val, 
                    id: val.id + "_hsplit", 
                    height: val.height.map((h) => h/2),
                    ratio: 0.5,
                    twin: val.id + "_hsnew"
                };
            }
        }), fNew];
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
        const deltaX = ((evt.clientX - dragLastPos.current.x)) /
            evt.target.parentElement.parentElement.clientWidth;
        if (Math.abs(deltaX) < 0.02) {
            return;
        }
        const tolerance = 0.16;
        if (evt.clientX / evt.target.parentElement.parentElement.clientWidth < tolerance ||
            evt.clientX / evt.target.parentElement.parentElement.clientWidth > 1-tolerance) {
            return;        
        }
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {...val, ratio: val.ratio + deltaX};
            }
            else if (val.id === frame.twin) {
                return {...val, ratio: val.ratio - deltaX};        
            }
            else {
                const items = [];
                let item = val.parent;
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
                    items[i + 1].parent = items[i]
                }
                console.log(val.id, items[items.length - 1]);
                return {...val, parent: items[items.length - 1], change: val.change+1};
            }
        })];
        setFrames(fsNew);        
    };

    const horizontalDrag = (evt, frame) => {
        if (evt.clientX === 0 && evt.clientY === 0) {
            return;
        }
        const deltaY = ((evt.clientY - dragLastPos.current.y)) /
            evt.target.parentElement.parentElement.clientHeight;
        if (Math.abs(deltaY) < 0.02) {
            return;
        }
        const tolerance = 0.16;
        if (evt.clientY / evt.target.parentElement.parentElement.clientHeight < tolerance ||
            evt.clientY / evt.target.parentElement.parentElement.clientHeight > 1-tolerance) {
            return;        
        } 
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {...val, ratio: val.ratio + deltaY};
            }
            else if (val.id === frame.twin) {
                return {...val, ratio: val.ratio - deltaY};        
            }
            else {
                const items = [];
                let item = val.parent;
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

    const verticalDrag1 = (evt, frame) => {
        if (evt.clientX === 0 && evt.clientY === 0) {
            return;
        }
        const deltaX = ((evt.clientX - dragLastPos.current.x)) /
            evt.target.parentElement.parentElement.clientWidth;
        if (Math.abs(deltaX) < 0.02) {
            return;
        }
        const tolerance = 0.16;
        if (evt.clientX / evt.target.parentElement.parentElement.clientWidth < tolerance ||
            evt.clientX / evt.target.parentElement.parentElement.clientWidth > 1-tolerance) {
            return;        
        } 
        // evt.nativeEvent.preventDefault();
        let twinHasSplits = false;
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        const newWidth = frame.width.map((w) => (w/frame.ratio)*(frame.ratio+deltaX));
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {
                    ...val, 
                    width: newWidth,
                    ratio: val.ratio + deltaX
                };
            }
            else if (val.id === frame.twin && !val.splitted) {
                const newWidthTwin = val.width.map((w) => (w/val.ratio)*(val.ratio-deltaX));
                return {
                    ...val, 
                    width: newWidthTwin,
                    left: frame.left.map((val, idx) => val + newWidth[idx]),
                    ratio: val.ratio - deltaX
                };        
            }
            else {
                return val;
            }
        })];
        setFrames(fsNew);        
    };

    const horizontalDrag1 = (evt, frame) => {
        if (evt.clientX === 0 && evt.clientY === 0) {
            return;
        }
        const deltaY = ((evt.clientY - dragLastPos.current.y)) /
            evt.target.parentElement.parentElement.clientHeight;
        if (Math.abs(deltaY) < 0.02) {
            return;
        }
        const tolerance = 0.16;
        if (evt.clientY / evt.target.parentElement.parentElement.clientHeight < tolerance ||
            evt.clientY / evt.target.parentElement.parentElement.clientHeight > 1-tolerance) {
            return;        
        } 
        // evt.nativeEvent.preventDefault();
        dragLastPos.current = {x: evt.clientX, y: evt.clientY};
        const newHeight = frame.height.map((h) => (h/frame.ratio)*(frame.ratio+deltaY));
        const fsNew = [...frames.map((val) => {
            if (val.id === frame.id) {                
                return {
                    ...val, 
                    height: newHeight,
                    ratio: val.ratio + deltaY
                };
            }
            else if (val.id.startsWith(frame.twin)) {
                const newHeightTwin = val.height.map((h) => (h/val.ratio)*(val.ratio-deltaY));
                return {
                    ...val, 
                    height: newHeightTwin,
                    top: [frame.top[0] + newHeight[0], frame.top[1] - newHeight[1]],
                    ratio: val.ratio - deltaY
                };
            }
            else {
                return val;
            }
        })];
        setFrames(fsNew);
    };

    const revertChange = (frameid) => {
        const fsNew = [...frames.map((f) => f.id === frameid ? {...f, change: false} : f)];
        setFrames(fsNew);
    }

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
                        {...val}
                        horsplit={horizontalSplit}
                        versplit={verticalSplit}
                        verdrag={verticalDrag}
                        hordrag={horizontalDrag}
                        verdragstart={verticalDragStart}
                        hordragstart={horizontalDragStart}
                        revertChange={revertChange} /> 
                )         
            })}  
        </div>
    )
}