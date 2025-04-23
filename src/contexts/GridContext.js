import { createContext } from 'react'

export const GridContext = createContext({
    'gridStep': {},
    'setGridStep': () => {},
    'gridCount': {},
    'setGridCount': () => {},
    'gridPoints': [],
    'setGridPoints': () => {},
    'gridLines': [],
    'setGridLines': () => {},
    'resetGrid': {},
    'setResetGrid': () => {}
})
