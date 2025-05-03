import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext} from '../contexts';
import {ProjectCanvas} from '../components';
import { VerticalSplit, HorizontalSplit, Close, Videocam, 
    MoreHoriz, MoreVert } from '@mui/icons-material';
import { IconButton, Typography, Menu, MenuItem, Divider, Grow } from '@mui/material';

export default function ProjectFrame(props) {
    // console.log("projectframe", props)
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [innerWidth, setInnerWidth] = useState("");
    const [innerHeight, setInnerHeight] = useState("");
    const [top, setTop] = useState("");
    const [left, setLeft] = useState("");
    const [tabMaxWidth, setTabMaxWidth] = useState("");
    const [dragStarted, setDragStarted] = useState(false);
    const [camMenuOpen, setCamMenuOpen] = useState(false);
    const [camMenuAnchor, setCamMenuAnchor] = useState(undefined);
    const outer = 30;

    useEffect(() => {
        let newwidth = "", newinnerwidth = "", newleft = "";
        let newheight = "", newinnerheight = "", newtop = "";
        if (props.part === 0) {
            newwidth = `calc(${props.width[0]}dvw - ${props.width[1]}px)`;
            newheight = `calc(${props.height[0]}dvh - ${props.height[1]}px)`;
            newinnerwidth = `calc(${props.width[0]}dvw - ${props.width[1] + outer}px)`;
            newinnerheight = `calc(${props.height[0]}dvh - ${props.height[1] + outer}px)`;
            newtop = `calc(${props.top[0]}dvh + ${props.top[1]}px)`;
            newleft = `calc(${props.left[0]}dvw + ${props.left[1]}px)`;
        }
        else if (props.part > 0) {
            const ancestors = [];
            const ratios = [];
            const splits = [];
            const parts = [];
            let item = props;
            while (true) {
                ancestors.unshift(item.id);
                ratios.unshift(item.ratio);
                splits.unshift(item.split);
                parts.unshift(item.part);
                if (item.parent === undefined) {
                    break;
                }
                else {
                    item = item.parent;
                }
            }
            splits.unshift(null);
            splits.pop();
            let width = Array.from(item.width);
            let height = Array.from(item.height);
            let left = Array.from(item.left);
            let top = Array.from(item.top);
            for (let i = 1; i < ancestors.length; i++) {
                if (splits[i] === 1) {
                    if (parts[i] === 2) {
                        const otherwidth = width.map((w) => w * (1 - ratios[i]));
                        left = left.map((val, idx) => val + otherwidth[idx]);
                    }
                    width = width.map((w) => w * ratios[i]);
                }
                else if (splits[i] === 2) {
                    if (parts[i] === 2) {
                        const otherheight = height.map((h) => h * (1 - ratios[i]));
                        top = [top[0] + otherheight[0], top[1] - otherheight[1]];
                    }
                    height = height.map((h) => h * ratios[i]);
                }
            }
            console.log(width, height, left, top);
            newwidth = `calc(${width[0].toFixed(2)}dvw - ${width[1].toFixed(2)}px)`;
            newheight = `calc(${height[0].toFixed(2)}dvh - ${height[1].toFixed(2)}px)`;
            newinnerwidth = `calc(${width[0].toFixed(2)}dvw - ${(width[1] + outer).toFixed(2)}px)`;
            newinnerheight = `calc(${height[0].toFixed(2)}dvh - ${(height[1] + outer).toFixed(2)}px)`;
            newtop = `calc(${top[0].toFixed(2)}dvh + ${top[1].toFixed(2)}px)`;
            newleft = `calc(${left[0].toFixed(2)}dvw + ${left[1].toFixed(2)}px)`;
            const tabmaxwidth = `calc(${width[0].toFixed(2)}dvw - ${(width[1] + outer + 23).toFixed(2)}px)`;
            setTabMaxWidth(tabmaxwidth);
            
        }
        setWidth(newwidth);
        setHeight(newheight);
        setInnerWidth(newinnerwidth);
        setInnerHeight(newinnerheight);
        setTop(newtop);
        setLeft(newleft);
    }, [props.ratio, props.change]);

    useEffect(() => {
        console.log(props.id, width, height);
    }, [width, height]);

    const dragStart = (evt, vertical) => {
        setDragStarted(true);
        if (vertical) {
            props.verdragstart(evt, props);
        }
        else {
            props.hordragstart(evt, props);
        }
    };

    const dragEnd = () => {
        setDragStarted(false);
    };

    const camMenuClick = (evt) => {
        setCamMenuAnchor(evt.currentTarget);
        setCamMenuOpen(true);
    }

    const camMenuClose = () => {
        setCamMenuOpen(false);
    };

    const camChange = (mode) => {
        props.camchange(props, mode);
        setCamMenuOpen(false);
    };

    return (
        <div id={props.id} style={{
            display: "flex", 
            flexFlow: "column",
            backgroundColor: "#f4f4f4",
            width: width,
            height: height,
            position: "absolute",
            top: top,
            left: left,
            opacity: props.splitted ? 0 : 1,
        }}>
            {innerWidth !== "" && innerHeight !== "" && (
                <>
                    {props.split === 0 && (
                        <>
                            <div style={{
                                display: "flex",
                                width: width, 
                                height: outer + "px",
                                justifyContent: "end",
                                backgroundColor: "#f4f4f4",
                            }}>                        
                                <IconButton sx={{color: "black", height: "29px",
                                    paddingLeft: "3px", paddingRight: "3px"
                                    }} onClick={() => props.versplit(props)}>
                                    <VerticalSplit/>
                                </IconButton>
                            </div>
                            <div style={{
                                position: "absolute",
                                width: "200px",
                                height: "27px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginLeft: "13px",
                                marginTop: "4px",
                                maxWidth: tabMaxWidth
                            }}>
                                <div style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    width: "200px",
                                    height: "27px",
                                    transform: "perspective(15px) rotateX(1deg)",
                                    backgroundColor: "white",
                                    borderLeft: "1px solid #dddddd",
                                    borderRight: "1px solid #dddddd",
                                    borderTop: "1px solid #dddddd",
                                    borderTopRightRadius: "10px",
                                    borderTopLeftRadius: "10px",
                                    maxWidth: tabMaxWidth
                                }}/>
                                <Typography sx={{
                                    marginLeft: "13px",
                                    marginTop: "13px",
                                    zIndex: 11,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis"
                                }}>
                                    {
                                        props.cam === "3dp" ? "3D Perspective" :
                                        props.cam === "3do" ? "3D Orthographic" : 
                                        props.cam === "xy" ? "X-Y Plane" : 
                                        props.cam === "yx" ? "Y-X Plane" :
                                        props.cam === "xz" ? "X-Z Plane" :
                                        props.cam === "zx" ? "Z-X Plane" :
                                        props.cam === "yz" ? "Y-Z Plane" :
                                        props.cam === "zy" ? "Z-Y Plane" : ""                                        
                                        // props.id
                                    }
                                </Typography>
                                {props.id !== 'init' && (
                                    <IconButton
                                        onClick={() => props.close(props)} sx={{
                                        marginRight: "-2px",
                                        marginTop: "13px",
                                        zIndex: 12,
                                    }}>
                                        <Close size="x-small" sx={{
                                            display: "flex", 
                                            justifyContent: "end"
                                        }} />
                                    </IconButton>  
                                )}                                                      
                            </div>
                            <div style={{
                                display: "flex",
                                flexFlow: "row",
                                width: width
                            }}>
                                <ProjectCanvas 
                                    cam={props.cam} 
                                    width={innerWidth} 
                                    height={innerHeight} 
                                    id={props.id}/>     
                                <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    width: outer + "px",
                                    height: innerHeight,
                                    justifyContent: "space-between",
                                    backgroundColor: "#f4f4f4"
                                }}>
                                    <IconButton onClick={camMenuClick} sx={{color: "black", width: "29px",
                                        paddingTop: "3px", paddingBottom: "3px",
                                        marginTop: "6px"
                                    }} >
                                        <Videocam/>
                                    </IconButton>
                                    <Menu
                                        anchorEl={camMenuAnchor}
                                        open={camMenuOpen}
                                        onClose={camMenuClose}
                                        TransitionComponent={Grow}
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                    >
                                        <MenuItem onClick={() => camChange("3dp")} >3D Perspective</MenuItem>
                                        <MenuItem onClick={() => camChange("3do")} >3D Orthographic</MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => camChange("xy")} >X-Y Plane</MenuItem>
                                        <MenuItem onClick={() => camChange("yx")} >Y-X Plane</MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => camChange("xz")} >X-Z Plane</MenuItem>
                                        <MenuItem onClick={() => camChange("zx")} >Z-X Plane</MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => camChange("yz")} >Y-Z Plane</MenuItem>
                                        <MenuItem onClick={() => camChange("zy")} >Z-Y Plane</MenuItem>
                                    </Menu>
                                    <IconButton sx={{color: "black", width: "29px",
                                        paddingTop: "3px", paddingBottom: "3px",
                                        marginBottom: "10px"}} onClick={() => props.horsplit(props)}>
                                        <HorizontalSplit/>
                                    </IconButton>
                                </div>
                            </div>
                        </>
                    )}
                    
                    { props.part === 1 && (props.parent.split === 1) && (
                        <>
                            <div draggable style={{
                                height: height,
                                position: "absolute",
                                width: "3px",
                                right: "-2px",
                                zIndex: 99999 - props.idx,
                                cursor: "col-resize",
                                opacity: 0
                            }}
                            onDrag={(evt) => props.verdrag(evt, props)}
                            onDragStart={(evt) => dragStart(evt, true)}
                            onDragEnd={dragEnd}
                            >
                                <div style={{
                                    width: "12px",
                                    height: "40px",
                                    borderRadius: "12px",
                                    position: "absolute",
                                    top: "calc(50% - 20px)",
                                    right: "-5px"
                                }}></div>
                            </div>
                            <div style={{
                                height: height,
                                position: "absolute",
                                width: "3px",
                                backgroundColor: dragStarted ? "#57769e" : "#000000",
                                right: "-2px",
                                zIndex: 99999 - props.idx - 1,
                                cursor: "col-resize"
                            }}>
                                <div style={{
                                    width: "12px",
                                    height: "40px",
                                    backgroundColor: dragStarted ? "#57769e" : "#000000",
                                    borderRadius: "12px",
                                    position: "relative",
                                    top: "calc(50% - 20px)",
                                    right: "5px"
                                }}>
                                    <MoreVert 
                                        preserveAspectRatio='none'
                                        sx={{color: "white", 
                                            width: "12px", 
                                            height: "40px"}} />
                                </div>
                            </div>
                        </>
                        
                    )}
                    { props.part === 1 && (props.parent.split === 2) && (
                        <>
                            <div draggable style={{
                                height: "3px",
                                position: "absolute",
                                width: width,
                                bottom: "0px",
                                zIndex: 99999 - props.idx,
                                cursor: "row-resize",
                                opacity: 0
                            }}
                            onDrag={(evt) => props.hordrag(evt, props)} 
                            onDragStart={(evt) => dragStart(evt, false)}
                            onDragEnd={dragEnd}
                            >
                                <div style={{
                                    width: "40px",
                                    height: "12px",
                                    borderRadius: "12px",
                                    position: "absolute",
                                    left: "calc(50% - 20px)",
                                    bottom: "-5px"
                                }}></div>
                            </div>
                            <div style={{
                                height: "3px",
                                position: "absolute",
                                width: width,
                                backgroundColor: dragStarted ? "#57769e" : "#000000",
                                bottom: "0px",
                                zIndex: 99999 - props.idx - 1,
                                cursor: "row-resize"
                            }} >
                                <div style={{
                                    width: "40px",
                                    height: "12px",
                                    backgroundColor: dragStarted ? "#57769e" : "#000000",
                                    borderRadius: "12px",
                                    position: "relative",
                                    left: "calc(50% - 20px)",
                                    bottom: "5px",
                                    lineHeight: "12px"
                                }}>
                                    <MoreHoriz 
                                        preserveAspectRatio='none'
                                        sx={{color: "white", 
                                            height: "12px", 
                                            width: "40px"}} />
                                </div>
                            </div>
                        </>
                        
                    )}
                </>            
            )}            
        </div>
    )
}