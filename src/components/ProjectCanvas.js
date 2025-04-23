import {useContext, useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import { GridContext } from '../contexts';
import * as THREE from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera, useHelper } from '@react-three/drei'
import { TextureLoader, Vector3, CameraHelper, Vector2, ShapeGeometry } from 'three'
import { LineGeometry, LineMaterial, Line2, FontLoader } from 'three/examples/jsm/Addons.js'

export default function ProjectCanvas(props) {
    const {gridStep, gridCount, gridPoints, gridLines, resetGrid, setResetGrid} = useContext(GridContext);
    const font = useLoader(FontLoader, 'helvetiker_regular.typeface.json');
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
                <PerspectiveCamera makeDefault position={[-4, 3, 4]} near={0.01} zoom={0.4} fov={20} />
                <OrbitControls
                    makeDefault
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    target={[0, 0, 0]}
                />
                <ambientLight gridPoints={gridPoints} gridLines={gridLines}/>
                
                <Grid ref={gridRef} gridPoints={gridPoints} gridLines={gridLines}/>
                

                { [...Array(gridCount.x + 1)].map((_, idx) => {
                    return (
                        <mesh key={idx}
                            rotation={[-0.5 * Math.PI, 0, 0]}
                            scale={[0.0015, 0.0015, 0.0015]}
                            position={[-1*(gridCount.x/2)*gridStep.x + idx*gridStep.x - 0.1, 0.0, (gridCount.z/2)*gridStep.z + 0.5]}
                        >
                            <lineBasicMaterial color='#cccccc' side={THREE.DoubleSide} />
                            <shapeGeometry args={[font.generateShapes('X'+idx.toString())]} />
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
                            <shapeGeometry args={[font.generateShapes('Y'+idx.toString())]} />
                        </mesh>
                    )
                })}
            </Canvas>
        </div>
    )
}

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
          <>
              <line key={idx} ref={l => gridLineRef.current[idx] = l}>
                <lineBasicMaterial color='#cccccc'/>
                <bufferGeometry>
                  <bufferAttribute attach='attributes-position' count={ll.length / 3} array={new Float32Array(ll)} itemSize={3} />
                </bufferGeometry>
              </line>
          </>
        )})
      }
    </>
  )
})