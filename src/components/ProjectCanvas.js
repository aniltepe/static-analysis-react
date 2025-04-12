import {useContext, useState, useEffect, useRef} from 'react';
import {ProjectContext, GridContext} from '../contexts';
import * as THREE from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera, useHelper } from '@react-three/drei'
import { TextureLoader, Vector3, CameraHelper, Vector2, ShapeGeometry } from 'three'
import { LineGeometry, LineMaterial, Line2, FontLoader } from 'three/examples/jsm/Addons.js'

export default function ProjectCanvas() {
    const {gridStep, gridCount, gridPoints, gridLines} = useContext(GridContext);
    const disc = useLoader(TextureLoader, 'disc.png');
    const font = useLoader(FontLoader, 'helvetiker_regular.typeface.json');

    return (
        <div style={{
            display: "flex",
            backgroundColor: "white",
            // border: "1px solid black", 
            // boxSizing: "border-box",
            width: "100dvw",
            height: "calc(100dvh - 80px)"
        }}>
            <Canvas style={{
                // top:'70px', 
                height: 'calc(100dvh - 80px)', 
                width: '100dvw'}}
            >
                <PerspectiveCamera makeDefault position={[-2, 3, 4]} near={0.01} zoom={0.4} fov={20} />
                <OrbitControls
                    makeDefault
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    target={[0, 0, 0]}
                />
                <ambientLight />
                

                {/* { gridPoints.map((_, idx) => {
                  if (idx % 3 !== 0)
                    return
                  return (
                    <points key={idx}> 
                      <pointsMaterial map={disc} depthTest={false} color='#ee0000' sizeAttenuation={true} size={0.2} transparent={true} alphaTest={0.5} />
                      <bufferGeometry >
                        <bufferAttribute attach='attributes-position' count={1} array={new Float32Array([point[idx], point[idx + 1], point[idx + 2]])} itemSize={3} />
                      </bufferGeometry>
                    </points>
                  )})
                } */}
            
                { gridLines.map((ll, idx) => {
                  return (
                    <>
                        <line key={idx}>
                          <lineBasicMaterial color='#cccccc'/>
                          <bufferGeometry>
                            <bufferAttribute attach='attributes-position' count={ll.length / 3} array={new Float32Array(ll)} itemSize={3} />
                          </bufferGeometry>
                        </line>
                    </>
                  )})
                }

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