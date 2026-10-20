const initialState = {
/*     isLoading: false, */
    isLoggedIn: false,
    user: {
        name: null,
        email: null,
    },
    categoryParent: [],
    categories: [],
    products: []
}
function Reducer(state = initialState, action){
    const {type, payload} = action

    switch (type) {
        case "LOGIN":
            return { 
                ...state, 
                user: {
                    name: payload.name,
                    email: payload.email,
                }
            }
        case "FETCH_CATEGORY":
            return { 
                ...state,
                categories: Array.isArray(payload) ? payload : []
            }
        case "FETCH_CATEGORY_PARENT":
            return {
                ...state, 
                categoryParent: Array.isArray(payload) ? payload : []
            }
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: Array.isArray(payload) ? payload : []
            }
        default:
            return state
    }
}
export default Reducer