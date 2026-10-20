import { useState, useEffect } from "react"
import { Search, Bell, User } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategory } from "../../redux/Action"
import api from "../../axio"
import { Pencil, Trash2 } from "lucide-react"

function Category(){
    const [search, setSearch] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState({})
    const categories = useSelector(s => s.categories)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCategory())
    }, [dispatch])
    useEffect(() => {
        if(success){
            const timer = setTimeout(() => {setSuccess(false)}, 3000)
            return () => clearTimeout(timer)
        }
    })
    const handleDelete = async (id) => {
        /* Send a delete request to the backend to delete an item */
        try{
            await api.delete(`/deleteCategory/${id}`)
            await dispatch(fetchCategory())
            setSuccess(true)
        }catch(err){
            if(err.response && err.response.data){
                setError(err.response.data)
                console.log(err.response.data)

            }else{
                console.log("Request error: ", err.message)
            }
        }
    }
    return(
        <div className="ml-5">
             {/* Head Section */}
            <section className="mb-4">
                <div className="flex justify-end shadow-2xs pb-2 items-center">
                    <div className="flex gap-4">
                        <button className="cursor-pointer "><Bell /></button>
                        <button className="border bg-white border-neutral-500 cursor-pointer rounded-full p-2"><User /></button>
                    </div>
                </div>
            </section>
            {/* Main Section */}
            <section className="bg-white p-4 rounded-lg">
                {/* Main Head */}
                <article className="flex justify-between items-center pb-4 border-b border-b-neutral-300">
                    <div>
                        <h1 className="font-extrabold text-3xl">Categories</h1>
                        <p className="text-neutral-400 -mt-1">Manage your store categories</p>
                    </div>
                    <Link to="/u/admin/addCategory" className="bg-black hover:bg-neutral-900 p-3 text-center rounded-xl w-40 text-white font-bold font-mono"> + Add Category</Link>
                </article>
                {/* Main Nav/Search/Filter bar */}
                <article className="my-3 flex">
                    <div className="relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"><Search size={17}/></button>
                        <input type="text" className="border border-neutral-300 px-3 py-2 pl-10 rounded-lg bg-white w-sm focus:outline-none focus:ring-1 focus:ring-neutral-400" placeholder="Search by name or slug..."/>
                    </div>
                    <div className="ml-4">
                        <select className="border border-neutral-300 py-2 pr-8 rounded-lg mr-2">
                            <option value="">All</option>
                        </select>
                    </div>
                </article>
                {success && <div className="bg-green-100 border border-green-400 py-3 font-bold px-8 mb-2 text-green-950 rounded-lg">Category deleted successfully.</div>}
                {error && error.message && <div className="bg-red-100 border border-red-400 py-3 font-bold px-8 mb-2 text-green-red rounded-lg">{error.message}</div>}
                
                <table className="w-full">
                    <thead className="bg-neutral-100 text-black font-extrabold text-left">
                        <tr>
                            <th className="rounded-tl-xl px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Slug</th>
                            <th className="px-6 py-3 text-left">Parent</th>
                            <th className="px-6 py-3 text-left">Products</th>
                            <th className="rounded-tr-xl px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {categories.map(c => <tr key={c.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">{c.name}</td>
                            <td className="px-6 py-4">{c.slug}</td>
                            <td className="px-6 py-4">{c.parent ? c.parent.name : "-" }</td>
                            <td className="px-6 py-4">{c.products_count}</td>
                            <td className="px-6 py-4 flex gap-3 justify-center">
                                {c.parent ? <Link to={`/u/admin/category/${c.id}`} className="border py-2 px-3 rounded inline-flex text-blue-600 border-black hover:bg-blue-600 hover:text-white hover:border-none"><Pencil size={20}/></Link> : ""}  
                                <button type="button" onClick={() => handleDelete(c.id)} className="cursor-pointer border border-black py-2 px-3 rounded inline-flex text-red-600 hover:bg-red-600 hover:text-white hover:border-none"><Trash2 size={20}/></button>
                            </td>
                        </tr>)}
                    </tbody>
                    <tfoot>
                        {/* PLEASE DO NOT FORGET TO ADD THE PAGINATION FOR THE CATEGORY */}
                    </tfoot>
                </table>
            </section>
        </div>
    )
}
export default Category