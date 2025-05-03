import { createContext } from 'react'

export const ConfigContext = createContext({
    'gridStep': {},
    'setGridStep': () => {},
    'gridCount': {},
    'setGridCount': () => {},
    'gridPoints': [],
    'setGridPoints': () => {},
    'gridLines': [],
    'setGridLines': () => {},
    'resetGrid': {},
    'setResetGrid': () => {},
    'coordSystem': {}
})
