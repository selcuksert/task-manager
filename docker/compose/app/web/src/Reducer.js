const Reducer = (state, action) => {
    switch (action.type) {
        case 'LOGGED_IN':
            return {
                ...state,
                keycloak: action.payload.keycloak,
                authenticated: action.payload.authenticated
            };
        case 'LOGGED_OUT':
            return {
                ...state,
                keycloak: null,
                authenticated: false
            };
        default:
            return state;
    }
}

export default Reducer;