import { useState, useEffect } from "react"
import { fetchCategoryParentParent } from "../../redux/Action"
import { useDispatch, useSelector } from "react-redux"
import { Save, PackagePlus, Type, Link, Network } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../../axio"

/* Retreiving the cateogory parent. !!!!!!!!!! */
function AddCategory(){
    const [formData, setFormData] = useState({name: "", slug: "", parent_id: ""})
    const [error, setError] = useState({})
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()
    
    const dispatch = useDispatch()
    const parents = useSelector(s => s.categoryParent)
    const parentFind = parents.find(p => p.id === Number(formData.parent_id))
    const slugParent = parentFind?.name || ""

    useEffect( ()=> {
        dispatch(fetchCategoryParentParent());
    },[dispatch])

    useEffect(() => {
        if(success){
            const timer = setTimeout(() => {setSuccess(false)}, 3000)

            return () => clearTimeout(timer);
        }
    }, [success])

    /* Slug Auto-Generation based on the the parent name and the name of the category */
    useEffect(() => {
        const generatedSlug = slugParent && formData.name ? `${slugParent}/${formData.name}`.toLowerCase().replace(/\s+/g, "-") : "";
        setFormData(prev => ({...prev, slug: generatedSlug}))
    }, [slugParent, formData.name])

    const handleSubmit = async (e) => {
        e.preventDefault()
        /* SEND my form data to my backend for validation and storing */
        try{
            await api.post("/storeCategory", formData)

            setSuccess(true)
            setFormData({name: "", slug: "", parent_id: ""})
            setError({})

        }catch (err) {
            if (err.response) {
                switch (err.response.status) {
                    case 422:
                        console.log(err.response.data)
                        const errors = err.response.data.errors;
                        if(errors.parent_id){
                            errors.parent = ["The parent category field is required."]
                            delete errors.parent_id
                        }
                        setError(errors)
                        break;
                    case 405:
                        console.log("Invalid request method!");
                        break;
                    default:
                        console.log("Server error:", err.response.status);
                }
                } else if (err.request) {
                    console.log("No response received from server");
                } else {
                    console.log("Request setup error:", err.message);
                }
            }   
        }
    const handleCancel = (e) => {
        e.preventDefault()
        
        setFormData({name: "", slug: "", parent_id: ""})
        setError({})
        navigate("/u/admin/category")
    }
    return(
        <div className="bg-white h-full px-8 py-4  ml-3 shadow rounded-r-3xl">
            {/* HEAD SECTION */}
            <div className="mb-5 border-b-2 pb-3 border-neutral-200">
                <div className="flex gap-2 items-center">
                    <span className="bg-orange-100 p-4 rounded-lg text-orange-400"><PackagePlus /></span>
                    <div className="relative">
                        <h1 className="font-black text-2xl">Store Category</h1>
                        <h3 className="text-neutral-400 text-sm -mt-[1.2px]">Create a new category for your store</h3>
                        <div className=" my-3"></div>
                    </div>
                </div>
            </div>
            {/* Display the success or error message here. */}
           {success && <div className="bg-green-100 border border-green-400 py-3 font-bold px-8 text-green-950 rounded-lg">Category added successfully.</div>}
            

            
            {/* F O R M */}
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="font-black">Name</label><br />
                    <span className="text-neutral-400 block mb-2">Enter the name of the category</span>
                    <div className="relative">
                        <span className="absolute top-0 left-0 h-full flex items-center  bg-neutral-200 border rounded-l-xl  border-neutral-300 px-3 text-neutral-500"><Type size={16} /></span>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter name" className="border w-full focus:outline-none focus:ring-2 focus:ring-neutral-200 py-3 pl-12 border-neutral-300 rounded-xl"/>
                    </div>
                    {error && error.name && <div className="text-xs font-bold px-4 text-red-400">* {error.name}</div> }
                </div>
                <div className="mb-5">
                    <label className="font-black">Parent</label><br />
                    <span className="text-neutral-400 block mb-2">Select a parent category</span>
                    <div className="relative">
                        <span className="absolute left-0 top-0 h-full flex items-center bg-neutral-200 border rounded-l-xl  border-neutral-300 px-3 text-neutral-500"><Network size={16}/></span>
                        <select value={formData.parent} onChange={e => setFormData({...formData, parent_id: Number(e.target.value)})} className="border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-neutral-200 py-3 pl-12 border-neutral-300">
                            <option value="" disabled>Select a parent</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                        {error && error.parent && <div className="text-xs font-bold px-4 text-red-400">* {error.parent}</div> }
                </div>
                <div className="mb-5 relative">
                    <label className="font-black">Slug</label><br />
                    <span className="text-neutral-400 block mb-2">Unique slug for the category</span>
                    <div className="relative">
                        <span className="absolute top-0 left-0 h-full flex items-center bg-neutral-200 border rounded-l-xl  border-neutral-300 px-3 text-neutral-500"><Link size={16}/></span>
                        <input type="text" value={formData.slug} readOnly placeholder="Generated slug" className="border w-full focus:outline-none focus:ring-2 focus:ring-neutral-200 rounded-xl border-neutral-300 py-3 pl-12"/>
                    </div>
                </div> 
                <div className="flex gap-4 items-center justify-end">
                <button type="button" onClick={handleCancel} className="border border-neutral-300 w-[100px] px-3 py-[13.2px] cursor-pointer rounded-lg font-bold bg-neutral-100 text-sm transition-transform duration-500 hover:bg-neutral-200 hover:-translate-y-2">Cancel</button>
                <button type="submit" className="p-3 cursor-pointer rounded-lg font-bold text-sm bg-primary flex gap-3 text-white transition-transform duration-500 hover:bg-secondary hover:-translate-y-2"><Save />Save Category</button>
                </div>
            </form>
        </div>
    )
}
export default AddCategory