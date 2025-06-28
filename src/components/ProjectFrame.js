import {useContext, useState, useEffect, useRef, Fragment} from 'react';
import {ProjectContext} from '../contexts';
import {ProjectCanvas} from '../components';
import { VerticalSplit, HorizontalSplit, Close, Videocam, 
    MoreHoriz, MoreVert, 
    Merge} from '@mui/icons-material';
import { IconButton, Typography, Menu, MenuItem, Divider, Grow } from '@mui/material';

import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three';

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
    const defaultCamPos = [-4, 3, 4];
    const camRef = useRef();
    const [campos, setCampos] = useState();
    const [camrot, setCamrot] = useState();
    const [camobj, setCamobj] = useState();
    const [orbitOpen, setOrbitOpen] = useState(true);


    const lines = useRef([
        [1, 0, 0], 
        [0, 1, 0], 
        [0, 0, 1], 
        [-1, 0, 0], 
        [0, -1, 0], 
        [0, 0, -1]
    ]);
    const colors = useRef([[
        "#a13f4d",
        "#4ab589",
        "#d1b034"
    ],[
        0xa13f4d,
        0x4ab589,
        0xd1b034
    ]]);

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
            // console.log(width, height, left, top);
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

    // useEffect(() => {
    //     console.log(props.id, width, height);
    // }, [width, height]);

    // useEffect(() => {
    //     console.log(camRef.current);
    // }, [camRef.current]);

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

    const setcam = (cam) => {
        console.log("setcam", cam)
        // camRef.current = cam;
        // setCampos(cam.position);
        // setCamrot(cam.rotation);
        // camRef.current.updateProjectionMatrix();
        setCamobj(cam);
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
                                    id={props.id}
                                    setcam={setcam}/>     
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
                                    
                                    <div>
                                        <IconButton onClick={() => setOrbitOpen(!orbitOpen)} sx={{width: "29px",
                                            padding: "3px 3px",
                                            marginBottom: "6px"}}>
                                            <AxisIcon active={orbitOpen}/>
                                        </IconButton>
                                        <IconButton sx={{color: "black", width: "29px",
                                            paddingTop: "3px", paddingBottom: "3px",
                                            marginBottom: "10px"}} onClick={() => props.horsplit(props)}>
                                            <HorizontalSplit/>
                                        </IconButton>
                                    </div>
                                    {orbitOpen && (
                                        <div style={{position: "absolute",
                                            right: outer, bottom: 0,
                                            width: "150px", height: "150px"
                                        }}>
                                            <Canvas>
                                                <PerspectiveCamera ref={camRef}
                                                  makeDefault
                                                  position={camobj?.position ? camobj.position : defaultCamPos} 
                                                  rotation={camobj?.rotation ? camobj.rotation : [0,0,0]}
                                                // position={[-4, 3, 3]} 
                                                  near={0.01} 
                                                  zoom={0.65} 
                                                  fov={20} />
                                                { lines.current.map((ll, idx) => {
                                                  return (
                                                    <Fragment key={idx}>
                                                        <mesh>
                                                          <arrowHelper args={[
                                                            new THREE.Vector3(ll[0], ll[1], ll[2]), 
                                                            new THREE.Vector3(0, 0, 0), 1, 
                                                            colors.current[1][idx % 3], 0.2, 0.1
                                                          ]}/>
                                                        </mesh>                        
                                                    </Fragment>
                                                  )})
                                                }
                                            </Canvas>
                                        </div>
                                    )}
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

const AxisIcon = (props) => {
    return (
        <svg style={{width: "24px", height: "24px", fill: props.active ? 'blue' : 'black'}} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M 6.99514,1.80245 6.2576,3.98086 c 0.15422,0.0866 0.32769,0.14517 0.50913,0.1732 l 0,3.36119 -0.97869,0.56507 0,1.08164 -2.86891,1.65638 C 2.80412,10.67521 2.66662,10.55428 2.51454,10.464 L 1,12.19755 3.25533,11.74707 c -0.002,-0.17683 -0.0381,-0.35636 -0.10457,-0.52751 l 2.82694,-1.63214 1.02069,0.58932 1.02069,-0.58932 2.82694,1.63214 c -0.0664,0.17116 -0.10244,0.35069 -0.10459,0.52755 L 13,12.19196 11.48222,10.46402 c -0.15208,0.0903 -0.28956,0.2112 -0.40457,0.35433 l -2.86888,-1.65636 0,-1.08167 -0.97875,-0.5651 0,-3.36116 c 0.18145,-0.028 0.35493,-0.0866 0.50916,-0.1732 L 6.99514,1.80245 Z"/></svg>
    )
}