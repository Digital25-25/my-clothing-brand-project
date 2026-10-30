import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Search, Bell, User, Eye, SquarePen, Trash2, ChevronRight, ChevronLeft, TriangleAlert} from "lucide-react"
import { Link } from "react-router-dom"
import { fetchProducts } from "../../redux/Action"
import { fetchCategory } from "../../redux/Action"
import api from "../../axio"
function Product(){
    const [nameSearch, setNameSearch] = useState("")
    const [categorySearch, setCategorySearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteConfirmeDisplay, setDeleteConfirmeDisplay] = useState(false)
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)
    const [selectedID, setSelectedID] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // FETCHING OUR PRODUCTS AND CATEGORIES FROM OUR REDUX STORE
    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchCategory())
    }, [dispatch])
    // STORING THE FETCHED PRODUCTS IN A "PRODUCTS" VARIABLE
    const products = useSelector(s => s.products)
    // STORING THE FETCHED CATEGORIES IN A "CATEGORIES" VARIABLE
    const categories = useSelector(s => s.categories)

    //FILTERING THE PRODUCT
    const filteredProduct = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(nameSearch.toLowerCase())

        const matchCategory = categorySearch ? product.category.name === categorySearch : true

        return matchName && matchCategory
    })

    // THIS FUNCTION WILL NAVIGATE TO THE VIEW PAGE WHERE WE WILL SEE THE FULL DETAIL OF THE PROD.
    const handleView = (id) => {
        navigate(`/u/admin/viewProduct/${id}`)
    }
    // THIS FUNCTION WILL NAVIGATE TO THE EDIT PRODUCT PAGE
    const handleEdit = (id) => {
        navigate(`/u/admin/editProduct/${id}`)
        console.log("hello")
    }
    // THIS FUNCTION WILL BE USE TO DISPLAY A CONFIRMATION TO DELETE A PRODUCT
    const handleDeleteConfirmationDisplay = (id) => {
        setDeleteConfirmeDisplay(true)
        setSelectedID(id)
    }
    // THIS FUNCTION WILL BE USE TO EXECUTE THE DELETION OF A PRODUCT
    const handleDelete = async() => {
        setIsDeleteConfirm(true)
        if(selectedID === null) return
        try{
            /* API DELETION HERE */
            await api.delete(`/products/destroy/${selectedID}`)
            dispatch(fetchProducts())
            setDeleteConfirmeDisplay(false)
            setIsDeleteConfirm(false)
        }catch(err){
            console.log(err.response.data)
        }
    }
    //BACKGROUND COLORS FOR THE CATEGORY
    const categoryColors = {
        "T-shirts": "bg-blue-100 text-blue-950 font-bold px-2 py-1 rounded-lg",
        "Accessories": "bg-green-100 text-green-950 font-bold px-2 py-1 rounded-lg",
        "Hoodies": "bg-purple-100 text-purple-950 font-bold px-2 py-1 rounded-lg",
        "Sweatshirts": "bg-red-100 text-red-950 font-bold px-2 py-1 rounded-lg",
        "Pants": "bg-amber-100 text-amber-950 font-bold px-2 py-1 rounded-lg",
        "Shorts": "bg-orange-100 text-orange-950 font-bold px-2 py-1 rounded-lg",
    };
    //PAGINATION STARTS
    const itemsPerPage = 5
    const totalPage = Math.ceil(filteredProduct.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProduct = filteredProduct.slice(startIndex, endIndex)
    //PAGINATION ENDS

    return(
        <div className="ml-5">
             {/* Head Section */}
            <section className="mb-4">
                <div className="flex justify-end shadow-2xs pb-2 items-center">
{/*                     <div className="mr-10 relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"><Search size={17}/></button>
                        <input className="border border-neutral-300 px-3 py-1 pl-10 rounded-lg bg-white w-full focus:outline-none focus:ring-1 focus:ring-neutral-500"   placeholder="Search products..."/>
                    </div> */}
                    {/* A div was removed and the flex justify-between was changed to justify-end*/}
                    <div className="flex gap-4">
                        <button className="cursor-pointer "><Bell /></button>
                        <button className="border bg-white border-neutral-500 cursor-pointer rounded-full p-2"><User /></button>
                    </div>
                </div>
            </section>
            {/* Main Section */}
            <section className="bg-white p-4 rounded-lg">
                    {/* Main Header */}
                <article className="flex justify-between items-center pb-4 border-b border-b-neutral-300">
                    <div>
                        <h1 className="font-extrabold text-3xl">Products</h1>
                        <p className="text-neutral-400 -mt-1">Manage your store products</p>
                    </div>
                    <Link to="/u/admin/addProduct" className="bg-black hover:bg-neutral-900 p-3 text-center rounded-xl w-40 text-white font-bold font-mono"> + Add Product</Link>
                </article>
                {/* Main Nav/Search/Filter bar */}
                <article className="my-3 flex">
                    <div className="relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"><Search size={17}/></button>
                        <input type="text" value={nameSearch} onChange={e => setNameSearch(e.target.value)} className="border border-neutral-300 px-3 py-2 pl-10 rounded-lg bg-white w-sm focus:outline-none focus:ring-1 focus:ring-neutral-400" placeholder="Search by name..."/>
                    </div>
                    <div className="ml-4">
                        <select value={categorySearch} onChange={e => setCategorySearch(e.target.value)}  className="border border-neutral-300 py-2 pr-8 rounded-lg mr-2">
                            <option value="">All categories</option>
                            {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
                        </select>

                    </div>
                </article>
                {/* Main table for product listing */}
                <table className="w-full">
                    <thead className="bg-neutral-100 font-extrabold text-black text-left">
                        <tr>
                            <th className="rounded-tl-xl px-4 py-3">Image</th>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="rounded-tr-xl px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProduct.length > 0 ? (currentProduct.map(product => {
                            const bgColor = categoryColors[product.category.name] || ""
                            return(
                                <tr key={product.id} className="border-b border-b-neutral-300 hover:bg-gray-50 transition">
                                    <td className="px-4 py-3"><img src={`http://localhost:8000/storage/${product.images[0].url}`} alt={product.name} className="w-20 h-20 rounded object-cover border border-neutral-200"/></td>
                                    <td className="pr-10 pl-4 py-3">
                                        <h1 className="font-extrabold text-[14px]">{product.name}</h1>
                                        <span className="text-gray-500 text-sm">{product.sku}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]"><span className={bgColor}>{product.category.name}</span></td>
                                    <td className="px-4 py-3 text-sm">{product.price}</td>
                                    <td className="px-4 py-3 text-sm">{product.variants.reduce((sum, item) => sum + item.stock_qty, 0)}</td>
                                    <td className="px-4 py-3 text-sm">{product.is_active == 1 ? <span className="text-green-500 font-bold bg-green-100 py-1.5 px-2 rounded-2xl flex items-center justify-center gap-2"><div className="rounded bg-green-500 w-2 h-2"></div>Active</span> : <span className="text-red-500 font-bold bg-red-100 py-1.5 px-2 rounded-2xl flex items-center justify-center gap-2"><div className="rounded bg-red-500 w-2 h-2"></div>Inactive</span>}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => handleView(product.id)} className="border border-neutral-400 p-2 rounded cursor-pointer hover:bg-black hover:text-white"><Eye size={16}/></button>
                                            <button type="button" onClick={() => handleEdit(product.id)} className="border border-blue-400 p-2 rounded cursor-pointer hover:bg-blue-600 hover:text-white"><SquarePen size={16}/></button>
                                            <button type="button" onClick={() => handleDeleteConfirmationDisplay(product.id)} className="border border-red-400 p-2 rounded cursor-pointer text-red-600 hover:bg-red-600 hover:text-white"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            )})) : 
                            (<tr>
                                <td colSpan={7} className="px-4 py-4 font-bold text-center">
                                    <h1 className="text-5xl text-red-600 font-black">404</h1>
                                    <span className="text-2xl">No product found.</span>
                                </td>
                            </tr>)
                        } 
                    </tbody>
                    {/* PAGINATION */}
                    <tfoot>
                        <tr>
                            <td colSpan={7}>
                                <div className="flex justify-between items-center mt-4">
                                <span>Showing {currentProduct.length} of {filteredProduct.length} products.</span>
                                <div className="flex gap-3">
                                    <button className="flex items-center cursor-pointer border py-2 px-4 rounded-lg text-neutral-600 bg-neutral-100 border-neutral-400 hover:bg-black hover:text-white hover:border-none hover:font-black" onClick={() => setCurrentPage(page => page - 1)} disabled={currentPage == 1}><ChevronLeft />  Previous</button>
                                    <div className="flex items-center">
                                        {Array.from({length: totalPage}, (_, index) => <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className="cursor-pointer font-bold py-2 px-4 text-blue-700 hover:bg-black hover:text-white rounded">{index + 1}</button>)}
                                    </div>   
                                    <button className="flex items-center cursor-pointer border py-2 px-4  rounded-lg text-neutral-600 bg-neutral-100 border-neutral-400 hover:bg-black hover:text-white hover:border-none hover:font-black" onClick={() => setCurrentPage(page => page + 1)} disabled={currentPage === totalPage}>Next <ChevronRight /></button>
                                </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                {/* A pop-up page for confirming a delete */}
                <article className="relative">
                    <div className={deleteConfirmeDisplay ? "pointer-events-none" : ""}></div>
                    {deleteConfirmeDisplay && <div className="fixed inset-0 bg-black/40 z-40"></div>}
                    {deleteConfirmeDisplay && (
                        <div className="fixed bg-white rounded-lg shadow-xl p-6 z-50 left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] flex justify-center flex-col items-center">
                            <h1 className="font-extrabold text-2xl mb-4">DELETE PRODUCT</h1>
                            <p className="font-semibold text-lg mb-4">Are you sure you want to delete this product?</p>
                            <div className="bg-red-100 p-4 border-l-9 border-red-400">
                                <h3 className="flex gap-2 items-center font-black text-red-600 text-lg"><TriangleAlert color="red" size={24}/> Warning</h3>
                                <p className="text-sm font-semibold text-red-800">This action cannot be undone. All values associated with this item will be deleted.</p>
                            </div>
                            <div className="mt-4 w-full flex justify-between">
                                <button onClick={() => setDeleteConfirmeDisplay(false)} className="border bg-black text-white hover:text-neutral-300 font-semibold p-3 cursor-pointer">No, Cancel</button>
                                <button onClick={handleDelete} className="border bg-white font-semibold p-3 cursor-pointer hover:bg-red-500 hover:text-white ">Yes, Delete</button>
                            </div>
                        </div>
                    )}
                </article>
            </section>
        </div>
        /* inProgress:
                *   Work on the search category ---------------------------- DONE
                *   Pagination --------------------------------------------- DONE ------ (IMPROVED BY ADDING AN ECLIPSE BUTTON).
                *   Work on the action buttons 
                *   DELETE ACTION >>>> We are doing the delete like this, we will ask for confirmation first, if the user clicks yes, we will execute with the delete --- DONE.
                *   UPDATE ACTION >>>> 
         */
    )
}
export default Product