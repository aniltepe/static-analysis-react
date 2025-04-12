import { createContext } from 'react'

export const UserContext = createContext({
    'loggedUser': undefined,
    'setLoggedUser': () => {}
})
