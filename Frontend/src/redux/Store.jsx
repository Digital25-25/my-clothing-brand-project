import { configureStore } from "@reduxjs/toolkit"
import Reducer from "./Reduce"

const Store = configureStore({
    reducer: Reducer,
})

export default Store;