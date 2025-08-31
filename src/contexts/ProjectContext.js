import { createContext } from 'react'

export const ProjectContext = createContext({
    loadedProject: undefined,
    setLoadedProject: () => {},
    modelLines: [],
    setModelLines: () => {},
    materials: [],
    focusedMaterial: {},
    frameSections: [],
    focusedFrame: {},
})
