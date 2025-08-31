import { createContext } from 'react'

export const HistoryContext = createContext({
    undoList: [],
    setUndoList: () => {},
    redoList: [],
    setRedoList: () => {},
})
