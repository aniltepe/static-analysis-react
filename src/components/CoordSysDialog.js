import {useContext, useState, useEffect, useRef, Fragment} from 'react';
import { Button, Dialog, DialogContent, List, ListItem, Typography,
    InputLabel, Select, MenuItem,
    DialogActions,
    TextField,
    DialogTitle
 } from "@mui/material";
 import { Canvas, useLoader, useThree } from '@react-three/fiber';
 import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function CoordSysDialog(props) {
    const camRef = useRef();
    const clicked = useRef(false);
    const [labelRot, setLabelRot] = useState(new THREE.Euler(0, 0, 0));
    const font = useLoader(FontLoader, 'helvetiker_regular.typeface.json');
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
    const [coordSys, setCoordSys] = useState({x: '', y: '', z: '', xn: false, yn: false, zn: false})
    const [labels, setLabels] = useState(['','','','','','']);
    const [applyDisabled, setApplyDisabled] = useState(true);

    const [goneOutside, setGoneOutside] = useState(false);

    useEffect(() => {
        setCoordSys(props.coordSystem);
    }, [props.coordSystem]);

    useEffect(() => {
        setLabels([
            `${coordSys.xn ? '-' : '+'}${coordSys.x}`,
            `${coordSys.yn ? '-' : '+'}${coordSys.y}`,
            `${coordSys.zn ? '-' : '+'}${coordSys.z}`,
            `${coordSys.xn ? '+' : '-'}${coordSys.x}`,
            `${coordSys.yn ? '+' : '-'}${coordSys.y}`,
            `${coordSys.zn ? '+' : '-'}${coordSys.z}`
        ]);
        if (coordSys.x === props.coordSystem.x && 
            coordSys.y === props.coordSystem.y && 
            coordSys.z === props.coordSystem.z && 
            coordSys.xn === props.coordSystem.xn && 
            coordSys.yn === props.coordSystem.yn && 
            coordSys.zn === props.coordSystem.zn) {
            setApplyDisabled(true);
        }
        else {
            setApplyDisabled(false);
        }
    }, [coordSys]);

    const handleClose = () => {
        props.open(false);
    }

    const handleApply = () => {
        props.change(coordSys);
        props.open(false);        
    };

    const camOnUpdate = (evt) => {
        setLabelRot(evt.rotation);
    };

    const onPointerDown = () => {
        clicked.current = true;
    };

    const onPointerUp = () => {
        clicked.current = false;
        setGoneOutside(false);
        setLabelRot(new THREE.Euler(camRef.current.rotation.x, camRef.current.rotation.y, camRef.current.rotation.z));
    };

    const onPointerMove = () => {
        if (!clicked.current) {
            return;
        }
        setLabelRot(new THREE.Euler(camRef.current.rotation.x, camRef.current.rotation.y, camRef.current.rotation.z));
    };

    const swap = (a1, a2) => {
        if (a2 !== undefined) {
            const a1l = coordSys.x === a1 ? 'x' : coordSys.y === a1 ? 'y' : coordSys.z === a1 ? 'z' : '';
            const a2l = coordSys.x === a2 ? 'x' : coordSys.y === a2 ? 'y' : coordSys.z === a2 ? 'z' : '';
            setCoordSys({...coordSys, [a1l]: coordSys[a2l], [a2l]: coordSys[a1l]});
        }
        else {
            const a1l = coordSys.x === a1 ? 'x' : coordSys.y === a1 ? 'y' : coordSys.z === a1 ? 'z' : '';
            setCoordSys({...coordSys, [a1l + 'n']: !coordSys[a1l + 'n']});
        }
    };

    const onPointerEnter = () => {
        if (clicked.current) {
            console.log("gone outside")
            clicked.current = false
            setGoneOutside(false)
        }
    };

    const onPointerLeave = () => {
        if (clicked.current) {
            console.log("gone outside");
            clicked.current = false;
            setGoneOutside(true);
            setLabelRot(new THREE.Euler(camRef.current.rotation.x, camRef.current.rotation.y, camRef.current.rotation.z));
        }
    };
    
    return (
        <Dialog
          open
          fullWidth
          onClose={handleClose}
        >
            <DialogTitle sx={{fontWeight: "800"}}>Coordinate System</DialogTitle>
            <DialogContent sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
            }}>
                <Canvas
                      style={{height: "200px"}}
                      onPointerDown={onPointerDown}
                      onPointerUp={onPointerUp}
                      onMouseMove={onPointerMove}
                      onPointerEnter={onPointerEnter}
                      onPointerLeave={onPointerLeave}
                    >
                    <PerspectiveCamera 
                      onUpdate={camOnUpdate}
                      ref={camRef}
                      makeDefault
                      position={[-4, 3, 3]} 
                      near={0.01} 
                      zoom={0.65} 
                      fov={20} />
                    <OrbitControls
                      makeDefault
                      enablePan={false}
                      enableZoom={false}
                      enableRotate={goneOutside ? false : true}
                      enableDamping={false}
                      target={[0, 0, 0]}
                      dampingFactor={0}
                    />
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
                            <mesh position={[ll[0] + (idx === 0 ? 0.15 : idx === 3 ? -0.15 : 0.0),
                                    ll[1] + (idx === 1 ? 0.15 : idx === 4 ? -0.15 : 0.0),
                                    ll[2] + (idx === 2 ? 0.15 : idx === 5 ? -0.15 : 0.0)]} 
                                rotation={labelRot}
                                scale={[0.0018, 0.0018, 0.0018]}>
                              <mesh position={[-100, -50, 0]}>
                                <lineBasicMaterial side={THREE.DoubleSide} color={colors.current[0][idx % 3]} />
                                <shapeGeometry args={[font.generateShapes(labels[idx])]} /> 
                              </mesh>
                                                      
                            </mesh>                            
                        </Fragment>
                      )})
                    } 
                    <mesh position={[0, -1.0, 0]} rotation={labelRot} scale={[0.0018, 0.0018, 0.0018]}>
                        <mesh position={[-260, -260, 0]}>
                            <lineBasicMaterial side={THREE.DoubleSide} color={colors.current[0][1]} />
                            <shapeGeometry args={[font.generateShapes("(Gravity)")]} />
                        </mesh>
                    </mesh>
                </Canvas>  
                <div style={{display: "flex", justifyContent: "space-between", margin: "10px 0px"}}>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'X' || coordSys.x === '-X' ? colors.current[0][0] : 
                                coordSys.y === 'X' || coordSys.y === '-X' ? colors.current[0][1] : 
                                coordSys.z === 'X' || coordSys.z === '-X' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>X</Typography>
                        <Button onClick={() => swap('X','Y')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'Y' || coordSys.x === '-Y' ? colors.current[0][0] : 
                                coordSys.y === 'Y' || coordSys.y === '-Y' ? colors.current[0][1] : 
                                coordSys.z === 'Y' || coordSys.z === '-Y' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>Y</Typography>
                    </div>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'Y' || coordSys.x === '-Y' ? colors.current[0][0] : 
                                coordSys.y === 'Y' || coordSys.y === '-Y' ? colors.current[0][1] : 
                                coordSys.z === 'Y' || coordSys.z === '-Y' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>Y</Typography>
                        <Button onClick={() => swap('Y','Z')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'Z' || coordSys.x === '-Z' ? colors.current[0][0] : 
                                coordSys.y === 'Z' || coordSys.y === '-Z' ? colors.current[0][1] : 
                                coordSys.z === 'Z' || coordSys.z === '-Z' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>Z</Typography>
                    </div>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'Z' || coordSys.x === '-Z' ? colors.current[0][0] : 
                                coordSys.y === 'Z' || coordSys.y === '-Z' ? colors.current[0][1] : 
                                coordSys.z === 'Z' || coordSys.z === '-Z' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>Z</Typography>
                        <Button onClick={() => swap('Z','X')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'X' || coordSys.x === '-X' ? colors.current[0][0] : 
                                coordSys.y === 'X' || coordSys.y === '-X' ? colors.current[0][1] : 
                                coordSys.z === 'X' || coordSys.z === '-X' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>X</Typography>
                    </div>
                </div>          
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'X' || coordSys.x === '-X' ? colors.current[0][0] : 
                                coordSys.y === 'X' || coordSys.y === '-X' ? colors.current[0][1] : 
                                coordSys.z === 'X' || coordSys.z === '-X' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>+X</Typography>
                        <Button onClick={() => swap('X')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'X' || coordSys.x === '-X' ? colors.current[0][0] : 
                                coordSys.y === 'X' || coordSys.y === '-X' ? colors.current[0][1] : 
                                coordSys.z === 'X' || coordSys.z === '-X' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>-X</Typography>
                    </div>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'Y' || coordSys.x === '-Y' ? colors.current[0][0] : 
                                coordSys.y === 'Y' || coordSys.y === '-Y' ? colors.current[0][1] : 
                                coordSys.z === 'Y' || coordSys.z === '-Y' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>+Y</Typography>
                        <Button onClick={() => swap('Y')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'Y' || coordSys.x === '-Y' ? colors.current[0][0] : 
                                coordSys.y === 'Y' || coordSys.y === '-Y' ? colors.current[0][1] : 
                                coordSys.z === 'Y' || coordSys.z === '-Y' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>-Y</Typography>
                    </div>
                    <div style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                        <Typography 
                            color={coordSys.x === 'Z' || coordSys.x === '-Z' ? colors.current[0][0] : 
                                coordSys.y === 'Z' || coordSys.y === '-Z' ? colors.current[0][1] : 
                                coordSys.z === 'Z' || coordSys.z === '-Z' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700", textAlign: "right"}}>+Z</Typography>
                        <Button onClick={() => swap('Z')}><ArrowBack/>Swap<ArrowForward/></Button>
                        <Typography 
                            color={coordSys.x === 'Z' || coordSys.x === '-Z' ? colors.current[0][0] : 
                                coordSys.y === 'Z' || coordSys.y === '-Z' ? colors.current[0][1] : 
                                coordSys.z === 'Z' || coordSys.z === '-Z' ? colors.current[0][2] : ''}
                            sx={{width: "20px", fontWeight: "700"}}>-Z</Typography>
                    </div>
                </div>           
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleApply} disabled={applyDisabled}>
                    <Typography>Apply</Typography>
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    <Typography>Discard</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    )
}