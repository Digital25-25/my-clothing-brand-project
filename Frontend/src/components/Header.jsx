
import { Link } from "react-router-dom"
import {User, Search, ShoppingCart } from "lucide-react"

function Header(){
    return(
        <nav className="flex items-center justify-between py-5 px-10 text-white hover:bg-gray-200 hover:text-black">
            {/* Links */}
            <div className="flex gap-7">                
                <Link to="#" className="font-semibold nav-link">Women</Link>
                <Link to="#" className="font-semibold nav-link">Men</Link>
                <Link to="#" className="font-semibold nav-link">Accessories</Link>
            </div>
            {/* LOGO */}
            <div>
                <h1 className="font-black font-mono text-2xl"><span className="text-3xl">GOD</span>DEH</h1>
            </div>
            {/* Actions */}
            <div className="flex gap-9">
                <button className="transition-transform duration-300 hover:-translate-y-1"><Search /></button>
                <Link to="/u/login" aria-label="Account" className="transition-transform duration-300 hover:-translate-y-1"><User /></Link>
                <Link to="#" aria-label="Shopping Cart" className="transition-transform duration-300 hover:-translate-y-1"><ShoppingCart /></Link>
            </div>
        </nav>
    )
}
export default Header