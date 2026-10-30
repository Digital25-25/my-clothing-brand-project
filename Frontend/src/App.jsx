import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/authentication/Login"
import Register from "./components/authentication/Register"
import Administrator from "./components/Admin"
import Dashboard from "./components/Admin_Components/Dashboard"
import Product from "./components/Admin_Components/Product"
import AddProduct from "./components/Admin_Components/AddProduct"
import Category from "./components/Admin_Components/Category"
import AddCategory from "./components/Admin_Components/AddCategory"
import EditCategory from "./components/Admin_Components/EditCategory"
import EditProuduct from "./components/Admin_Components/EditProduct"
import ViewProuduct from "./components/Admin_Components/ViewProduct"

function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/u/login" element={<Login />} /> 
        
        {/* ADMIN ROUTE */}
        <Route path="/u/admin" element={<Administrator />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="editProduct/:id" element={<EditProuduct />} />
          <Route path="viewProduct/:id" element={<ViewProuduct />} />
          <Route path="category" element={<Category />} />
          <Route path="addCategory" element={<AddCategory />} />
          <Route path="category/:id" element={<EditCategory />} />
        </Route>

        
      </Routes>
    </>
  )
}

export default App
