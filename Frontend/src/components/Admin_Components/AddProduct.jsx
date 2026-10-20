import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Save, Trash2, X, CloudUpload } from "lucide-react"
import { fetchCategory } from "../../redux/Action"
import api from "../../axio"


function AddProduct(){
    /* PRODUCT INFO. STATE */
    const [formData, setFormData] = useState({name: '', category_id: '', price: "", description: "", is_active: true})
    /* VARIANT STATE */
    const [variants, setVariants] = useState([])
    const [variantForm, setVariantForm] = useState({size: "", color: "", price_override: "", stock_qty: 0})
    const [isVariantDisplay, setIsVariantDisplay] = useState(false)
    /* IMAGE STATE */
    const [images, setImages] = useState([])
    const [preview, setPreview] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const category = useSelector(s => s.categories)
    useEffect(() => {
        dispatch(fetchCategory())
    }, [dispatch])
    useEffect(() => {
        const urls = images.map(image => URL.createObjectURL(image));
        setPreview(urls)

        return () => {
            urls.forEach(url => URL.revokeObjectURL(url))
        }
    }, [images])
    useEffect(() => {
        if(success){
            const timer = setTimeout(() => {setSuccess(false)}, 3000)

            return () => clearTimeout(timer);
        }
    }, [success])
    /*
     * ============================================================
     * HANDLING PRODUCT INFO.
     * ============================================================
     */
    const handleFormData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    /*
     * ============================================================
     * HANDLING VARIANT
     * ============================================================
     */
    /* Store variants info */
    const SetVariantData = (e) => {
        setVariantForm({...variantForm, [e.target.name]: e.target.value})
    }
    /* Delete a variants from our array*/
    const handleDelete = (index) => {
        setVariants(variants.filter((v, i) => i !== index))
    }
    /* Store variantForm that contian the variants data into the variants array */
    const handleVariantSubmit = (e) => {
        e.preventDefault()
        setVariants(prev => [...prev, variantForm])
        setIsVariantDisplay(false)
        setVariantForm({size: "", color: "", price_override: "", stock_qty: ""})
    }
    const handleVariantCancel = (e) => {
        e.preventDefault()

        setVariantForm({size: "", color: "", price_override: "", stock_qty: ""})
        setErrors({})
        setIsVariantDisplay(false)
    }
    /*
     * ============================================================
     * HANDLING IMAGE 
     * ============================================================
     */
    
    const addImages = (files) => {
        const MAX_LENGTH = 3

        setImages(prev => {
            const remainingSlot = MAX_LENGTH - prev.length

            if(remainingSlot <= 0){
                return prev
            }
            const filesToAdd = files.slice(0, remainingSlot)
           
            return [
                ...prev, 
                ...filesToAdd
            ]
        })
    }
    const handleImageDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        /* console.log(e.dataTransfer.files) */
        const files = Array.from(e.dataTransfer.files)
        addImages(files)
    }
    const handleImageOnClick = (e) => {
        e.preventDefault()

        const files = Array.from(e.target.files)
        addImages(files)
    }
    const handleDeleteImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }
    /*
     * ============================================================
     * THE MAIN LOGIC
     * ============================================================
     */
    /* Cancel the entire process */
    const handleCancel = (e) => {
        e.preventDefault()

        setFormData({name: '', category_id: '', price: "", description: "", is_active: ""})
        setVariantForm({size: "", color: "", price_override: "", stock_qty: ""})
        setImages([]);
        setErrors({})
        navigate('/u/admin/product')
    }
    /* Make our API request to our backend to store all our infomation */
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            /* MAKE A FormData REQUEST BECAUSE OF THE IMAGE SO  */
            const data = new FormData()
            /* APPEND OUR DATA */
            // P R O D U C T 
            data.append("name", formData.name)
            data.append("category_id", formData.category_id)
            data.append("description", formData.description)
            data.append("price", formData.price)
            data.append("is_active", formData.is_active ? "1" : "0")

            // V A R I A N T 
            variants.forEach((v, index) => {
                data.append(`variants[${index}][size]`, v.size)
                data.append(`variants[${index}][color]`, v.color)

                if (v.price_override !== "") {
                    data.append(`variants[${index}][price_override]`, v.price_override)
                }
                data.append(`variants[${index}][stock_qty]`, v.stock_qty)
            })
            // I M A G E 
            images.forEach(image => {
                data.append('images[]', image)
            })
/*             for (const [key, value] of data.entries()) {
                console.log(key, value) //This will be used for debugging
            } */

            const res = await api.post('/products/storeProduct', data)
            console.log(res.data)
            setFormData({name: '', category_id: '', description: "", price: "", is_active: true})
            setVariants([]); setImages([]); setErrors({}); setSuccess(true);
        }catch(err){
            if (err.response) {
                switch (err.response.status) {
                    case 422:
                        console.log("Validation Error")
                        const errs = err.response.data.errors
                        console.log(errs)
                        console.log("Error: ",errs.price)
                        if(errs.category_id){
                            //Add category error field and delete category_id field from the errors object
                            errs.category = ["The category field is required."]
                            delete errs.category_id
                        }
                        if(errs.images){
                            errs.images = ["Add an image"]
                        }
                        errs.variants = ["Add at least one variant"]
                        
                        setErrors(errs)
                        break;
                    case 405:
                        console.log("Invalid request method!");
                        break;
                    default:
                        console.log("Server error:", err.response.status);
                        console.log("Server error:", err.response);
                }
            } else if (err.request) {
                    console.log("No response received from server");
            } else {
                    console.log("Request setup error:", err.message);
                }
        }
    }
    return(
        <div className="h-full py-4 ml-3">
            {/* HEAD SECTION */}
            <section className="pb-4 flex justify-between items-center border-b border-b-neutral-400">
                <div>
                    <h1 className="font-black text-2xl">Add Product</h1>
                    <h3 className="text-neutral-400 text-sm -mt-[1.2px]">Create a new product for your store</h3>
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <button type="button" onClick={handleCancel} className="border border-neutral-300 w-[100px] px-3 py-[13.2px] cursor-pointer rounded-lg font-bold bg-neutral-100 text-sm hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="p-3 cursor-pointer rounded-lg font-bold text-sm bg-primary flex gap-3 text-white hover:bg-secondary"><Save />Save Category</button>
                </div>
            </section>
            {/* MAIN SECTION */}
            {success && <p className="mt-3 bg-green-100 border border-green-400 rounded text-green-900 font-bold p-2 text-center">The product has succesfully been added.</p>}
            <section className="mt-3">
                {/* PRODUCT */}
                <div className="bg-white rounded-lg shadow py-4 px-3">
                    <h1 className="font-bold text-lg mb-3">Product Information</h1>
                    {/* FORM SECTION FOR THE PRODUCT INFO*/}
                    <form /* onSubmit={handleSubmit} */ >
                        <section className="flex gap-4">
                            <div className="w-full">
                                <label className="font-bold text-sm">Name</label><br />
                                <input type="text" name="name" value={formData.name} onChange={handleFormData} placeholder="Enter product name" className="border border-neutral-400 text-sm py-2 px-3 rounded min-w-full"/>
                                {errors && errors.name && <p className="text-red-600 text-base">*{errors.name}</p>}
                            </div>
                            <div className="w-full">
                                <label className="font-bold text-sm">Category</label><br />
                                <select type="text" name="category_id" value={formData.category_id} onChange={handleFormData} className="border border-neutral-400 text-sm py-2 rounded px-3 min-w-full">
                                    <option value="">Select category...</option>
                                    {category.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors && errors.category && <p className="text-red-600 text-base">*{errors.category}</p>}
                            </div>
                            <div className="w-full">
                                <label className="font-bold text-sm">Price</label><br />
                                <input type="number" name="price" className="border border-neutral-400 text-sm py-2 px-3 rounded min-w-full" value={formData.price} onChange={handleFormData} placeholder="Enter price"/>                
                                {errors && errors.price && <p className="text-red-600 text-base">*{errors.price}</p>}
                            </div>
                        </section>
                        {/* THIS SECTION IS INCLUSIVE OF THE DESCRIPTION AND THE ACTIVE BUTTON */}
                        <section className="flex gap-4 mt-3 items-center">
                            <div className="min-w-2xl">
                                <label className="font-bold text-sm">Description</label><br />
                                <textarea name="description" value={formData.description} onChange={handleFormData} cols="81" rows="5" className="border border-neutral-400 p-3 rounded" placeholder="Enter product description..."></textarea>
                            </div>
                            <div>
                                <label className="font-bold text-sm">Status</label><br />
                                <label className="relative inline-flex items-center cursor-pointer mt-2">
                                    <input type="checkbox" checked={formData.is_active} onChange={() => setFormData(prev => ({...prev, is_active: !prev.is_active}))} className="peer sr-only"/>
                                     
                                     <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"></div>

                                    <span className="ml-3">{formData.is_active ? "Active" : "Inactive"}</span>
                                </label>
                            </div>
                        </section>
                    </form>
                </div>
                {/* VARIANT */}
                <div className="bg-white rounded-lg shadow py-4 px-3 mt-3">
                    {/* VARIANT HEADER ⬇️⬇️⬇️*/}
                    <article className="flex justify-between items-center mb-3">
                        <div>
                            <h1 className="font-bold text-lg ">Variant</h1>
                            <h3 className="text-neutral-400 text-[13px] -mt-[1.2px]">Add variants for this product (size, color, stock, price) </h3>
                            {errors && errors.variants && <p className="text-red-600 text-base">*{errors.variants}</p>}
                        </div>
                        <button onClick={() => setIsVariantDisplay(true)} className="border border-neutral-400 rounded text-sm font-bold text-primary p-2 cursor-pointer hover:scale-125 hover:mr-3">+ Add Variant</button>
                    </article>
                    {/* variants POP-UP AND A DARK CONTAINER ⬇️⬇️⬇️ */}
                    <article className="relative">
                        <div className={isVariantDisplay ? "pointer-events-none" : ""}></div>
                        {isVariantDisplay && (<div className="fixed inset-0 bg-black/40 z-40"></div>)}

                    {/* DISPLAY THE VARIANT FORM  ⬇️⬇️⬇️*/}
                        {isVariantDisplay && (
                            <div className="fixed bg-white rounded-lg shadow-xl p-6 z-50 left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px]">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h1 className="font-bold text-lg ">Add variants</h1>
                                        <h3 className="text-neutral-400 text-[13px] -mt-[1.2px]">Add a new variants for the product </h3>
                                    </div>
                                    <button onClick={handleVariantCancel} className="rounded text-2xl font-mono hover:text-red-700 cursor-pointer hover:scale-125">x</button>
                                </div>
                                <form onSubmit={handleVariantSubmit}>
                                    <article className="flex gap-4">
                                        <div className="w-full">
                                            <label className="font-bold">Size</label><br />
                                            <select name="size" value={variantForm.size} onChange={SetVariantData} className="border min-w-full p-2 rounded-lg">
                                                <option value="">Select size</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                                <option value="4XL">4XL</option>
                                            </select><br />
                                        </div>
                                        <div className="w-full">
                                            <label className="font-bold">Color</label><br />
                                            <select name="color"   value={variantForm.color} onChange={SetVariantData} className="border min-w-full p-2 rounded-lg">
                                                <option value="">Select Color</option>
                                                <option value="Black">Black</option>
                                                <option value="White">White</option>
                                                <option value="Brown">Brown</option>
                                            </select>
                                        </div>
                                    </article>
                                    
                                    <div className="w-full mt-4">
                                        <label className="font-bold">Price Override{" "}<span className="text-gray-400 font-normal">(Optional)</span>
                                        <span className="block -mb-5 font-normal text-sm text-gray-400">Leave empty to use product price</span></label><br />
                                        
                                        <label className="relative block">
                                            <span className="absolute inset-y-0 left-0 flex w-10 items-center justify-center rounded-l-lg bg-gray-200 border-r border-r-gray-400">$</span>
                                            <input type="number" name="price_override" value={variantForm.price_override} onChange={SetVariantData} className="border p-2 pl-13 rounded-lg min-w-full border-gray-400" />
                                        </label>
                                    </div>
                                    <div className="w-full mt-4 mb-4 pb-3">
                                        <label className="font-bold">Stock Quantity<span className="text-gray-400 font-normal"></span>
                                        <span className="block -mb-5 font-normal text-sm text-gray-400">Available stock for this product</span></label><br />
                                        <input type="number" name="stock_qty" value={variantForm.stock_qty} onChange={SetVariantData} placeholder="e.g. 25.00" className="border p-2 rounded-lg min-w-full border-gray-400" />
                                    </div>
                                    <div className="border-b -mx-6 mb-3 border-b-gray-400"></div>

                                    <div className="flex justify-end gap-3">
                                        <button onClick={handleVariantCancel} className="border py-2 px-4 rounded-lg cursor-pointer hover:bg-neutral-100 font-bold">Cancel</button>
                                        <button type="submit" className="border py-2 px-4 rounded-lg cursor-pointer bg-primary hover:bg-secondary text-white font-bold">Add Variant</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </article>
                    {/* VARIANT TABLE ⬇️⬇️⬇️ */}
                    <article>
                        <table className="w-full">
                            <thead className="bg-neutral-200 text-left">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl">Size</th>
                                    <th className="px-6 py-4">Color</th>
                                    <th className="px-6 py-4">Price Override</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 rounded-tr-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                               {variants.map((v,i) => 
                               <tr key={i} className="border-b border-b-neutral-200 hover:bg-gray-50 transition">
                                <td className="px-6 py-3">{v.size}</td>
                                <td className="px-6 py-3">{v.color}</td>
                                <td className="px-6 py-3">{v.price_override}</td>
                                <td className="px-6 py-3">{v.stock_qty}</td>
                                <td className="px-6 py-3"><button type="button" onClick={() => handleDelete(i)} className="cursor-pointer border border-black py-2 px-3 rounded inline-flex text-red-600 hover:bg-red-600 hover:text-white hover:border-none"><Trash2 size={20}/></button></td>
                               </tr>)}
                            </tbody>
                        </table>
                    </article>
                </div>
                {/* IMAGE */}
                <div className="bg-white rounded-lg shadow py-4 px-3 mt-3">
                    <article>
                        <h1 className="font-bold text-lg ">Product Images</h1>
                        <h3 className="text-neutral-400 text-[13px] -mt-[1.2px] mb-4">Upload product images (you can upload up to 3 images)</h3>
                        {errors && errors.images && <p className="text-red-600 text-base">*{errors.images}</p>}
                    </article>
                    {/* This article contains our form for the image */}
                    <article className="mb-2">
                        <form encType="multipart/form-data">
                            <label onDragOver={(e) => {e.preventDefault(); setIsDragging(true)}} onDragLeave={(e)=>{e.preventDefault(); setIsDragging(false)}} onDrop={handleImageDrop} className="flex gap-4 justify-center items-center border rounded border-dashed cursor-pointer border-gray-300 bg-white px-6 py-4 transition hover:border-gray-400 hover:bg-neutral-100">
                                <div className="font-black"><CloudUpload size={40}/></div>
                                <div>
                                    <h1 className="text-base font-bold -mb-1">Drag & drop images here, or click to select</h1>
                                    <span className="text-sm text-neutral-400">PNG, JPG, JPEG, WEBP up to 5MB each</span>
                                </div>
                                <input type="file" accept="image/*" multiple hidden onChange={handleImageOnClick}/>
                            </label>
                        </form>
                    </article>
                    {/* This article contains the image preview */}
                    {preview.length > 0 && <article>
                        <div>
                            <h1 className="font-bold mb-3">Image Preview</h1>
                        </div>
                        <div className="grid grid-cols-3 auto-cols-auto justify-center gap-2">
                                {preview.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img src={url} key={index}  className="shadow rounded w-full"/>

                                        <button type="button" onClick={() => handleDeleteImage(index)} className="absolute top-2 right-2 hidden group-hover:block cursor-pointer bg-neutral-400 text-white rounded-full p-1"><X /></button>
                                    </div>
                                ))} 
                        </div>
                    </article>} 
                        {/* problemToSolve: 
                                *       Store user information in localstorage (A place that we render our user info.)??????.
                                        When user refreshes, he doesn't need to re-login all the time.
                        */}
                </div>

            </section>
        </div>
    )
}
export default AddProduct