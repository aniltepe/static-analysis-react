import {useContext, useState, useEffect, useRef, useCallback,
   forwardRef, useImperativeHandle} from 'react';
import { ConfigContext, AppContext, ProjectContext } from '../contexts';
import * as THREE from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { TextureLoader, Vector2 } from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { LineGeometry, LineMaterial, Line2 } from 'three/examples/jsm/Addons.js'
import { Menu, MenuItem } from '@mui/material';

export default function ProjectCanvas(props) {
    const {gridPoints, gridLines, resetGrid, setResetGrid} = useContext(ConfigContext);
    const {addSnackbar, removeSnackbar} = useContext(AppContext);
    const {modelLines, setModelLines} = useContext(ProjectContext);
    const gridRef = useRef();

    const [selectedPnt, setSelectedPnt] = useState();
    const [shadowLine, setShadowLine] = useState();
    const modelDrawing = useRef(false);
    const camRef = useRef();

    const [ctxMenu, setCtxMenu] = useState();
    const gridPtHovered = useRef(false);
    const modelLnHovered = useRef(false);

    // const registered = useRef(false);
    // const testFunc = (e) => {
    //   if (e.key == 'f') {
    //     if (!camRef.current) {
    //       return
    //     }
    //     // console.log(camRef);        
    //     // camRef.current.rotation.set(new THREE.Euler(0, 0, Math.PI))
    //     // camRef.current.position.set(0, 10, 3)
    //     // camRef.current.rotation.set(-0.5 * Math.PI, 0, 0)
    //     camRef.current.up.set(0, -1, 0)
    //     camRef.current.updateProjectionMatrix()
    //   }
    // };
    // if (!registered.current) {
    //   window.addEventListener("keydown", testFunc);
    //   registered.current = true;
    // }

    useEffect(() => {
      if (!resetGrid) {
        return;
      }
      if (gridRef && gridRef.current) {
        gridRef.current.clearGrid();
        setResetGrid(false);
      }
    }, [resetGrid]);

    // useEffect(() => {
    //   if (camRef.current)
    //     props.setcam(camRef.current);
    // }, [camRef.current])


    // useEffect(() => {
      // console.log(props.id, props.width, props.height)
    // }, []);

    const captureEsc = useCallback((evt) => {
      if (evt.key == 'Escape') {
        setSelectedPnt(undefined);
        removeSnackbar('esc');
        window.removeEventListener('keydown', captureEsc);
        setShadowLine(undefined);          
      }
    }, []);

    const onGridPtClick = (evt) => {
      if (evt.distanceToRay < 0.03) {
        // console.log('pt clicked, distance to ray < 0.03')
        evt.stopPropagation()
        const pntPos = evt.object.geometry.attributes.position.array
        const newSelected = [pntPos[0], pntPos[1], pntPos[2]] 
        if (selectedPnt) {
          if (!selectedPnt.every((v, i) => v === newSelected[i])) {
            const lines = []
            lines.push(selectedPnt[0], selectedPnt[1], selectedPnt[2], newSelected[0], newSelected[1], newSelected[2])
            setModelLines([...modelLines, lines])
          }
          setSelectedPnt(undefined);
          removeSnackbar('esc');
          window.removeEventListener('keydown', captureEsc);
          setShadowLine(undefined);
          modelDrawing.current = false;
          // console.log("shadow line is getting removed")       
        }
        else {
          setSelectedPnt(newSelected);
          addSnackbar({
            msg: 'Press Esc to cancel', duration: undefined, open: true, closable: false, id: 'esc'
          });
          window.addEventListener('keydown', captureEsc);
          setShadowLine([pntPos[0], pntPos[1], pntPos[2], pntPos[0], pntPos[1], pntPos[2]]);
          modelDrawing.current = true;
        }
      }
    }

    const deleteModelLine = (e) => {
      setModelLines(modelLines.filter((_, i) => i !== ctxMenu.idx))
      setCtxMenu(undefined)
    };

    const onModelLineClick = (evt, idx) => {
      console.log(evt)
      if (gridPtHovered.current)
        return;
      // evt.nativeEvent.stopPropagation();
      const canvXOffset = window.innerWidth - evt.srcElement.clientWidth;
      const canvYOffset = window.innerHeight - evt.srcElement.clientHeight;
      const anchorX = (evt.clientX - canvXOffset) > evt.srcElement.clientWidth / 2 ? "right" : "left";
      const anchorY = (evt.clientY - canvYOffset) > evt.srcElement.clientHeight / 2 ? "bottom" : "top";
      
      setCtxMenu({
        hor: anchorX,
        ver: anchorY,
        idx: idx,
        pos: {x: parseInt(evt.clientX).toString(), y: parseInt(evt.clientY).toString()},
      });
    };

    const modelLnOnEnter = (evt) => {
      if (!gridPtHovered.current) {
        evt.object.material.linewidth = 6;
        evt.srcElement.style.cursor = 'pointer';
        modelLnHovered.current = true;
      }
    };

    const modelLnOnLeave = (evt) => {
      evt.object.material.linewidth = 3;
      evt.srcElement.style.cursor = 'auto';
      modelLnHovered.current = false;
    };
    
    const onPointerMove = (evt) => {
      if (modelDrawing.current && shadowLine) {
        // if (shadowLine !== undefined) {
        //   console.log("if this log appears after the message 'shadow line is getting removed', then you have a problem")
        // }
        setShadowLine([
          shadowLine[0], shadowLine[1], shadowLine[2], 
          evt.point.x, evt.point.y, evt.point.z
        ]);
      }
      let objected = false
      evt.intersections.forEach((i) => {
        if (i.distanceToRay < 0.03) {
          if (props.cam == '3dp') {
            i.object.material.size = 0.16
          }
          else {
            i.object.material.size = 8
          }
          objected = true;
          gridPtHovered.current = true;
        }
        else {
          if (props.cam == '3dp') {
            i.object.material.size = 0.08
          }
          else {
            i.object.material.size = 4
          }
        }
      })
      if (objected) {
        evt.srcElement.style.cursor = 'pointer'
      }
      else {
        gridPtHovered.current = false;
        if (!modelLnHovered.current) {
          evt.srcElement.style.cursor = 'auto'
        }
      }
    }

    const mouseMove = (e) => {
      if (props.cam !== '3dp' && props.cam !== '3do') {
        return;
      }
      // console.log("cam params changing")
      props.setCamPos(new THREE.Vector3(camRef.current.position.x, camRef.current.position.y, camRef.current.position.z));
      props.setCamRot(new THREE.Euler(camRef.current.rotation.x, camRef.current.rotation.y, camRef.current.rotation.z));
    };

    const mouseUp = (e) => {
      if (props.cam !== '3dp' && props.cam !== '3do') {
        return;
      }
      // console.log("cam params changing")
      props.setCamPos(new THREE.Vector3(camRef.current.position.x, camRef.current.position.y, camRef.current.position.z));
      props.setCamRot(new THREE.Euler(camRef.current.rotation.x, camRef.current.rotation.y, camRef.current.rotation.z));
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mouseup", mouseUp)
    };

    const onPointerDown = (e) => {
        if (e.nativeEvent.button !== 0) {
          return;
        }
        if (modelLnHovered.current) {
          return;
        }
        console.log("onPointerDown")
        window.addEventListener("mousemove", mouseMove)
        window.addEventListener("mouseup", mouseUp)
    };

    return (
        <div onWheel={props.handleEvent} style={{
            display: "flex",
            backgroundColor: "white",
            borderTop: "1px solid " + (props.active ? "#444444" : "#dddddd"),
            borderRight: "1px solid " + (props.active ? "#444444" : "#dddddd"),
            borderTopRightRadius: "10px",
            boxSizing: "border-box",
            width: props.width,
            height: props.height
        }}>
            {ctxMenu !== undefined && <Menu
              open={ctxMenu !== undefined}
              anchorEl={{nodeType: 1, getBoundingClientRect: () => DOMRect}}
              onClose={() => setCtxMenu(undefined)}
              anchorOrigin={{vertical: ctxMenu.ver, horizontal: ctxMenu.hor}}
              sx={{left: ctxMenu.pos.x + "px", top: ctxMenu.pos.y + "px"}}
            >
                <MenuItem onClick={deleteModelLine}>Delete</MenuItem>
                <MenuItem>Assign</MenuItem>
            </Menu>}
            <Canvas
              onPointerDown={onPointerDown}
            >
              <Cameras
                ref={camRef}
                cam={props.cam}
                initCamPos={props.initCamPos}
                initCamRot={props.initCamRot}
                setCamPos={props.setCamPos}
                setCamRot={props.setCamRot}
                camPos={props.camPos}
                camRot={props.camRot}
                // camParamsChange={props.camParamsChange}
              />
              <OrbitControls
                makeDefault
                enablePan={true}
                enableZoom={true}
                enableRotate={props.cam === "3dp" || props.cam === "3do"}
                // enableRotate={true}
                enableDamping={false}
                target={[0, 0, 0]}
              />
              
              <Grid ref={gridRef} gridPoints={gridPoints} gridLines={gridLines}
                onPointerMove={onPointerMove} onGridPtClick={onGridPtClick}
                cam={props.cam}/>
              
              {modelLines.map((lines, idx) => {
                return (
                  <primitive 
                    object={new Line2()} 
                    key={idx} 
                    frustrumCulled={false} 
                    onClick={(e) => onModelLineClick(e, idx)}
                    onPointerEnter={modelLnOnEnter}
                    onPointerLeave={modelLnOnLeave}
                  >
                    <primitive object={new LineGeometry().setPositions(new Float32Array(lines))} attach='geometry' />
                    <primitive object={new LineMaterial()} color='black' attach='material' linewidth={4} resolution={new Vector2(512, 512)} />
                  </primitive>
                )})
              }
              {shadowLine && (
                <primitive object={new Line2()} frustrumCulled={false} >
                  <primitive object={new LineGeometry().setPositions(new Float32Array(shadowLine))} attach='geometry' />
                  <primitive object={new LineMaterial()} color='#cccccc' attach='material' linewidth={4} resolution={new Vector2(512, 512)} />
                </primitive>
              )}
              <Labels cam={props.cam}/>                
            </Canvas>
        </div>
    )
}

const Cameras = forwardRef((props, ref) => {
  const {size} = useThree();
  const prevCam = useRef();

  useEffect(() => {
    if ((props.cam === '3dp' && prevCam.current === '3do') ||
        (props.cam === '3do' && prevCam.current === '3dp')) {
      ref.current.position.set(props.camPos.x, props.camPos.y, props.camPos.z)
      ref.current.updateProjectionMatrix()
      // console.log("orthographic to perspective")
    }
    prevCam.current = props.cam;
  }, [props.cam]);

  const camOnUpdate = (e) => {
    console.log("cam on update", props.cam, new THREE.Vector3(e.position.x, e.position.y, e.position.z))
    props.setCamPos(new THREE.Vector3(e.position.x, e.position.y, e.position.z));
    props.setCamRot(e.rotation);
    // props.camParamsChange(
    //   new THREE.Vector3(e.position.x, e.position.y, e.position.z),
    //   new THREE.Euler(e.rotation.x, e.rotation.y, e.rotation.z)
    // )
  };

  return (
    <>
      {props.cam == '3dp' && <PerspectiveCamera 
        ref={props.cam == '3dp' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == '3dp'}
        position={props.initCamPos} 
        rotation={props.initCamRot}
        near={0.01} 
        zoom={0.4} 
        fov={20} 
      />}
      {/* {props.cam != '3dp' && <OrthographicCamera 
        ref={props.cam != '3dp' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam != '3dp'} 
        position={
          props.cam == '3do' ? props.initCamPos
          : props.cam == 'xy' ? [0, 0, 10]
          : props.cam == 'yx' ? [0, 0, -10]
          : props.cam == 'xz' ? [0, -10, 0]
          : props.cam == 'zx' ? [0, 10, 0]
          : props.cam == 'yz' ? [10, 0, 0]
          : props.cam == 'zy' ? [-10, 0, 0]: [0,0,0]
        }
        rotation={props.cam == '3do' ? props.initCamRot : [0,0,0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height}
        top={1} 
        bottom={-1} 
        up={props.cam == 'zx' ? [0, -1, 0] : [0, 1, 0]}
        manual
      />} */}
      {props.cam == '3do' && <OrthographicCamera 
        ref={props.cam == '3do' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == '3do'} 
        position={props.initCamPos} 
        rotation={props.initCamRot} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height}
        top={1} 
        bottom={-1} 
        manual
      />}
      {props.cam == 'xy' && <OrthographicCamera
        ref={props.cam == 'xy' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'xy'}
        position={[0, 0, 10]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        manual
      />}
      {props.cam == 'yx' && <OrthographicCamera
        ref={props.cam == 'yx' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'yx'}
        position={[0, 0, -10]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        manual
      />}
      {props.cam == 'xz' && <OrthographicCamera 
        ref={props.cam == 'xz' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'xz'} 
        position={[0, -10, 0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        manual
      />}
      {props.cam == 'zx' && <OrthographicCamera 
        ref={props.cam == 'zx' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'zx'} 
        position={[0, 10, 0]} 
        near={0.01} 
        zoom={0.4}
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        up={[0, -1, 0]}
        manual
      />}
      {props.cam == 'yz' && <OrthographicCamera 
        ref={props.cam == 'yz' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'yz'} 
        position={[10, 0, 0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        manual
      />}  
      {props.cam == 'zy' && <OrthographicCamera 
        ref={props.cam == 'zy' ? ref : null}
        onUpdate={camOnUpdate}
        makeDefault={props.cam == 'zy'} 
        position={[-10, 0, 0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1}
        manual
      />}
    </>
  )
});

const Grid = forwardRef((props, ref) => {
  const {scene} = useThree();
  const [point, setPoint] = useState([])
  const [lines, setLines] = useState([]) 
  const gridLineRef = useRef([])
  const gridPointRef = useRef([])
  const disc = useLoader(TextureLoader, 'disc.png');

  useEffect(() => {
    setPoint(props.gridPoints);
    setLines(props.gridLines);
    // console.log(props.gridLines);
  }, [props.gridLines, props.gridPoints]);

  useImperativeHandle(ref, () => ({
    clearGrid() {
      console.log('lines:', gridLineRef.current.length, 'points:', gridPointRef.current.length)
      for (let i = 0; i < lines.length; i++) {
        gridLineRef.current[i].geometry.dispose()
        gridLineRef.current[i].material.dispose()
        scene.remove(gridLineRef.current[i])
      }
      for (let i = 0; i < point.length / 3; i++) {
        if (!gridPointRef.current[i]) {
          continue;
        }
        gridPointRef.current[i].geometry.dispose()
        gridPointRef.current[i].material.dispose()
        scene.remove(gridPointRef.current[i])
      }
      setPoint([])
      setLines([])
    }
  }));

  return (
    <>
      { point.map((_, idx) => {
        if (idx % 3 !== 0)
          return
        return (
          <points key={idx} ref={p => gridPointRef.current[idx / 3] = p} onPointerMove={props.onPointerMove} onClick={props.onGridPtClick}> 
            <pointsMaterial map={disc} depthTest={false} color='#ff0000' sizeAttenuation={true} size={props.cam == '3dp' ? 0.08 : 6} transparent={true} alphaTest={0.5} />
            <bufferGeometry>
              <bufferAttribute attach='attributes-position' count={1} array={new Float32Array([point[idx], point[idx + 1], point[idx + 2]])} itemSize={3} />
            </bufferGeometry>
          </points>
        )})
      }
      
      { lines.map((ll, idx) => {
        return (
          <line key={idx} ref={l => gridLineRef.current[idx] = l}>
            <lineBasicMaterial color='#cccccc'/>
            <bufferGeometry>
              <bufferAttribute attach='attributes-position' count={ll.length / 3} array={new Float32Array(ll)} itemSize={3} />
            </bufferGeometry>
          </line>
        )})
      }
    </>
  )
});

const Labels = forwardRef((props, ref) => {
  const {gridStep, gridCount, coordSystem} = useContext(ConfigContext);
  const font = useLoader(FontLoader, 'helvetiker_regular.typeface.json');
  return (
    <>
      { [...Array(gridCount.x + 1)].map((_, idx) => {
          return (
              <mesh key={idx}
                  scale={[0.0015, 0.0015, 0.0015]}
                  rotation={
                    props.cam === '3dp' ? [-0.5 * Math.PI, 0, Math.PI]
                    : props.cam === '3do' ? [-0.5 * Math.PI, 0, Math.PI]
                    : props.cam === 'xy' ? [0, 0, 0]
                    : props.cam === 'yx' ? [0, Math.PI, 0]
                    : props.cam === 'xz' ? [0.5 * Math.PI, 0, 0]
                    : props.cam === 'zx' ? [-0.5 * Math.PI, 0, Math.PI]
                    : props.cam === 'yz' ? undefined
                    : props.cam === 'zy' ? undefined : [0,0,0]
                  }
                  position={
                    props.cam === '3dp' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x + 0.1, 0.0, -1*(gridCount.z/2)*gridStep.z - 0.5]
                    : props.cam === '3do' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x + 0.1, 0.0, -1*(gridCount.z/2)*gridStep.z - 0.5]
                    : props.cam === 'xy' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x - 0.1, -0.5, (gridCount.z/2)*gridStep.z]
                    : props.cam === 'yx' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x + 0.1, -0.5, -1*(gridCount.z/2)*gridStep.z]            
                    : props.cam === 'xz' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x - 0.1, 0.0, -1*(gridCount.z/2)*gridStep.z - 0.5]
                    : props.cam === 'zx' ? [-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x + 0.1, gridCount.y*gridStep.y, -1*(gridCount.z/2)*gridStep.z - 0.5]
                    : props.cam === 'yz' ? undefined
                    : props.cam === 'zy' ? undefined : [0,0,0]
                  }
              >
                {(props.cam != 'yz' && props.cam != 'zy') && <>
                  <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                  <shapeGeometry args={[font.generateShapes(coordSystem.x + idx.toString())]} />
                </>}
              </mesh>
          )
      })}
      { [...Array(gridCount.y + 1)].map((_, idx) => {
          return (
              <mesh key={idx}
                  scale={[0.0015, 0.0015, 0.0015]}
                  rotation={
                    props.cam === '3dp' ? undefined
                    : props.cam === '3do' ? undefined
                    : props.cam === 'xy' ? [0, 0, 0]
                    : props.cam === 'yx' ? [0, Math.PI, 0]
                    : props.cam === 'xz' ? undefined
                    : props.cam === 'zx' ? undefined
                    : props.cam === 'yz' ? [0, 0.5 * Math.PI, 0]
                    : props.cam === 'zy' ? [0, -0.5 * Math.PI, 0] : [0,0,0]
                  }
                  position={
                    props.cam === '3dp' ? undefined
                    : props.cam === '3do' ? undefined
                    : props.cam === 'xy' ? [-1*(gridCount.x/2)*gridStep.x - 0.6, idx*gridStep.y - 0.07, (gridCount.z/2)*gridStep.z]
                    : props.cam === 'yx' ? [-1*(gridCount.x/2)*gridStep.x - 0.4, idx*gridStep.y - 0.07, -1*(gridCount.z/2)*gridStep.z]
                    : props.cam === 'xz' ? undefined
                    : props.cam === 'zx' ? undefined
                    : props.cam === 'yz' ? [(gridCount.x/2)*gridStep.x, idx*gridStep.y - 0.07, -1*(gridCount.z/2)*gridStep.z - 0.4]
                    : props.cam === 'zy' ? [-1*(gridCount.x/2)*gridStep.x, idx*gridStep.y - 0.07, -1*(gridCount.z/2)*gridStep.z - 0.6] : [0,0,0]
                  }
              >
                {(props.cam !== '3dp' && props.cam !== '3do' && props.cam !== 'xz' && props.cam !== 'zx') && <>
                  <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                  <shapeGeometry args={[font.generateShapes(coordSystem.y + idx.toString())]} />
                </>}
              </mesh>
          )
      })}
      { [...Array(gridCount.z + 1)].map((_, idx) => {
          return (
              <mesh key={idx}
                  scale={[0.0015, 0.0015, 0.0015]}
                  rotation={
                    props.cam === '3dp' ? [-0.5 * Math.PI, 0, -0.5 * Math.PI]
                    : props.cam === '3do' ? [-0.5 * Math.PI, 0, -0.5 * Math.PI]
                    : props.cam === 'xy' ? undefined
                    : props.cam === 'yx' ? undefined
                    : props.cam === 'xz' ? [0.5 * Math.PI, 0, 0]
                    : props.cam === 'zx' ? [-0.5 * Math.PI, 0, Math.PI]
                    : props.cam === 'yz' ? [0, 0.5 * Math.PI, 0]
                    : props.cam === 'zy' ? [0, -0.5 * Math.PI, 0] : [0,0,0]
                  }
                  position={
                    props.cam === '3dp' ? [-1*(gridCount.x/2)*gridStep.x - 0.5, 0.0, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1]
                    : props.cam === '3do' ? [-1*(gridCount.x/2)*gridStep.x - 0.5, 0.0, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1]
                    : props.cam === 'xy' ? undefined
                    : props.cam === 'yx' ? undefined
                    : props.cam === 'xz' ? [-1*(gridCount.x/2)*gridStep.x - 0.6, 0.0, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1]
                    : props.cam === 'zx' ? [-1*(gridCount.x/2)*gridStep.x - 0.4, gridCount.y*gridStep.y, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1]
                    : props.cam === 'yz' ? [(gridCount.x/2)*gridStep.x, -0.5, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z + 0.1]
                    : props.cam === 'zy' ? [-1*(gridCount.x/2)*gridStep.x, -0.5, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1] : [0,0,0]
                  }
              >
                {(props.cam !== 'xy' && props.cam !== 'yx') && <>
                  <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                  <shapeGeometry args={[font.generateShapes(coordSystem.z + idx.toString())]} />
                </>}
              </mesh>
          )
      })}
    </>
  )
});

