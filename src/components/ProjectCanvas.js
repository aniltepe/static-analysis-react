import {useContext, useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import { ConfigContext } from '../contexts';
import * as THREE from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { TextureLoader } from 'three'
import { FontLoader } from 'three/examples/jsm/Addons.js'

export default function ProjectCanvas(props) {
    const {gridPoints, gridLines, resetGrid, setResetGrid} = useContext(ConfigContext);
    const gridRef = useRef();

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
    //   console.log(props.id, props.width, props.height)
    // }, [])

    return (
        <div style={{
            display: "flex",
            backgroundColor: "white",
            borderTop: "1px solid #dddddd", 
            borderRight: "1px solid #dddddd",
            borderTopRightRadius: "10px",
            boxSizing: "border-box",
            width: props.width,
            height: props.height
        }}>
            <Canvas style={{
                // width: props.width,
                // height: props.height
            }}>
                <Cameras
                  cam={props.cam}/>
                <OrbitControls
                  makeDefault
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  target={[0, 0, 0]}
                />
                <ambientLight gridPoints={gridPoints} gridLines={gridLines}/>
                
                <Grid ref={gridRef} gridPoints={gridPoints} gridLines={gridLines}/>
                
                <Labels />
                
            </Canvas>
        </div>
    )
}

const Cameras = forwardRef((props, ref) => {
  const {size, gl} = useThree();
  // console.log(size);
  const perspCam = useRef();
  const orthoCam = useRef();
  const [camPos, setCamPos] = useState([-4, 3, 4]);
  const prevCam = useRef("");
  const [orthoLeft, setOrthoLeft] = useState(-1 * size.width / size.height);
  const [orthoRight, setOrthoRight] = useState(size.width / size.height);

  useEffect(() => {
    console.log("three size changed");
    // setOrthoLeft(-1 * size.width / size.height);
    // setOrthoRight(size.width / size.height);
    orthoCam.current.updateProjectionMatrix();
  }, [size.width, size.height]);

  useEffect(() => {
    console.log("ortholeftright changed");
    orthoCam.current.updateProjectionMatrix();
    console.log(size.width, size.height, gl.getSize())
    // gl.setSize(size.width, size.height);
  }, [orthoLeft, orthoRight, orthoCam.current]);

  // useEffect(() => {
  //     console.log(orthoCam.current)
  // }, [orthoCam.current]);

  return (
    <>
      <PerspectiveCamera 
        makeDefault={props.cam == '3dp'}
        position={camPos} 
        near={0.01} 
        zoom={0.4} 
        fov={20} />
      <OrthographicCamera ref={orthoCam}
        makeDefault={props.cam == '3do'} 
        position={camPos} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height}
        top={1} 
        bottom={-1} 
      />
      <OrthographicCamera
        makeDefault={props.cam == 'xy'}
        position={[0, 0, 10]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1} />
      <OrthographicCamera 
        makeDefault={props.cam == 'xz'} 
        position={[0, 10, 0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1} />
      <OrthographicCamera 
        makeDefault={props.cam == 'yz'} 
        position={[-10, 0, 0]} 
        near={0.01} 
        zoom={0.4} 
        left={-1 * size.width / size.height} 
        right={size.width / size.height} 
        top={1} 
        bottom={-1} />      
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
      {/* { point.map((_, idx) => {
            if (idx % 3 !== 0)
              return
            return (
              <points key={idx} ref={p => gridPointRef.current[idx / 3] = p}> 
                <pointsMaterial map={disc} depthTest={false} color='#ee0000' sizeAttenuation={true} size={0.2} transparent={true} alphaTest={0.5} />
                <bufferGeometry >
                  <bufferAttribute attach='attributes-position' count={1} array={new Float32Array([point[idx], point[idx + 1], point[idx + 2]])} itemSize={3} />
                </bufferGeometry>
              </points>
            )})
          } */}
      
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
                  rotation={[-0.5 * Math.PI, 0, 0]}
                  scale={[0.0015, 0.0015, 0.0015]}
                  position={[-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x - 0.1, 0.0, (gridCount.z/2)*gridStep.z + 0.5]}
              >
                  <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                  <shapeGeometry args={[font.generateShapes(coordSystem.x + idx.toString())]} />
              </mesh>
          )
      })}
      { [...Array(gridCount.z + 1)].map((_, idx) => {
          return (
              <mesh key={idx}
                  rotation={[-0.5 * Math.PI, 0, -0.5 * Math.PI]}
                  scale={[0.0015, 0.0015, 0.0015]}
                  position={[-1*(gridCount.x/2)*gridStep.x - 0.5, 0.0, -1*(gridCount.z/2)*gridStep.z + idx*gridStep.z - 0.1]}
              >
                  <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                  <shapeGeometry args={[font.generateShapes(coordSystem.z + idx.toString())]} />
              </mesh>
          )
      })}
    </>
  )
});

