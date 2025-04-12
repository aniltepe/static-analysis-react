import { createContext } from 'react'

export const ProjectContext = createContext({
    'loadedProject': undefined,
    'setLoadedProject': () => {}
})
