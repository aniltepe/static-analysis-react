import { createContext } from 'react'

export const AppContext = createContext({
    snackbars: [],
    addSnackbar: () => {},
    removeSnackbar: () => {},
})
