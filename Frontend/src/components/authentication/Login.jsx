import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoaderCircle } from "lucide-react";

import api from "../../axio";
import { login } from "../../redux/Action";

function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            setIsLoading(true)
            await api.get("/sanctum/csrf-cookie")
            const res = await api.post("/login", {email, password})
            if(res.data.success){
                const user = res.data.user
                dispatch(login(user.name, user.email))
                const role = res.data.user.role
                if(role === "admin"){
                    navigate('/u/admin')
                    setIsLoading(false)
                }else{
                    /* navigate('/u/customer') */
                }
            } 
        }catch(err){
            /* console.log(err);
            console.log(err.response?.data); */
  
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else if (err.response?.status === 401) {
                setErrors({
                    general: err.response.data.message || "Invalid credentials"
                });
            } else {
                setErrors({
                    general: "Something went wrong. Please try again."
                });
            }
        } finally {
            setIsLoading(false);
        }
    }
    return(
        /* flex flex-col min-h-screen items-center justify-center */
        <div className="min-h-screen flex flex-col items-center justify-center">
             {/* Login head */}
             <div className="text-center">
                <h1 className="text-3xl font-bold"><span className="text-4xl font-extrabold font-oldenglish">GodDeh</span> LOGIN</h1>
                <p className="text-gray-700">Discover your style, explore our latest collections, <span className="block -mt-1 mb-6">and stay updated on your orders.</span></p>
             </div>
             
             {/* LOGIN FORM */}
             <form className="flex flex-col w-full max-w-xs" onSubmit={handleLogin}>
                
                {errors.general && <p className="p-3 text-red-800 bg-red-300 border font-bold border-red-600 rounded-lg mb-4 ">{errors.general}</p>}
                <input type="email" placeholder="Email address*" className="border p-3 rounded-lg border-gray-400 mb-3" value={email} onChange={(e => setEmail(e.target.value))}/>
                {errors && errors.email && <p className="text-red-600 -mt-3 mb-4">{errors.email}</p>}

                <input type="password" placeholder="Password*" className="border p-3 rounded-lg border-gray-400" value={password} onChange={(e => setPassword(e.target.value))}/>
                 {errors && errors.password && <p className="text-red-600">{errors.password}</p>}
                <Link to="" className="text-center my-5 font-bold underline">Forgot password?</Link>

                <button className="bg-gray-900 hover:bg-gray-800 text-white font-black py-3 rounded-2xl cursor-pointer mt-2 mb-4 flex justify-center gap-2" type="submit">{isLoading && <span className="animateLoader">{<LoaderCircle />}</span>}LOG IN</button>
             </form>
             <p className="text-gray-500">Don't have an account? <Link to="" className="text-gray-900 font-bold underline">Sign up</Link></p>
        </div>
    )
}
export default Login;