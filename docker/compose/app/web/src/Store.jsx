import {createContext, useReducer} from "react";
import Reducer from './Reducer';

const initialState = {
    keycloak: null,
    authenticated: false,
    updateTimeout: 1000
}

export const Context = createContext(initialState);

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={[state,dispatch]}>
            {children}
        </Context.Provider>
    )
}

export default Store