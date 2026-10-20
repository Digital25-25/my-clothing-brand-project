import api from "../axio"

export const login = (name, email) =>  {
    return {
        type: "LOGIN",
        payload: {name, email}
    }
}
const logout = (name, email) =>  {
    return {
        type: "LOGOUT",
        payload: {name, email}
    }
}
const Categories = (info) => {
    return {
        type: "FETCH_CATEGORY",
        payload: info
    }
}
const Category_Parent = (info) => {
    return {
        type: "FETCH_CATEGORY_PARENT",
        payload: info
    }
}
const Products = (info) => {
    return {
        type: "FETCH_PRODUCTS",
        payload: info
    }
}
/* FETCHING DATA ⬇️⬇️⬇️ */
export const fetchCategoryParentParent = () => {
    return async (dispatch) => {
        const res = await api.get("/categoryParent")
        if (res.data.success){
            dispatch(Category_Parent(res.data.parent))
        }
    }
}
export const fetchCategory = () => {
    return async (dispatch) => {
        const res = await api.get("/categories")
        if (res.data.success){
            dispatch(Categories(res.data.categories))
        }
    }
}
export const fetchProducts = () => {
    return async (dispatch) => {
        try {
            const res = await api.get("/products/index");

            if (res.data.success) {
                dispatch(Products(res.data.products));
            }
        } catch (error) {
            console.error("Fetch products failed:", error.response?.data || error);
        }
    }
}