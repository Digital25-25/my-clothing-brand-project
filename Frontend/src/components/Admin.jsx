import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ClipboardList, Users, Settings} from "lucide-react";

function Administrator(){
    const admin = useSelector(s => s.user)

    return(
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <nav className="flex flex-col  justify-between w-75 min-h-screen fixed left-0 top-0 bg-black p-5 text-white ">
                <section>
                    <h1 className="text-5xl font-black font-oldenglish">GodDeh</h1>
                    <h3 className="text-primary font-mono font-black text-xl">Admin</h3>

                    <div className="flex flex-col gap-3 mt-[60px]">
                        <Link to="/u/admin/dashboard" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"> <span className="text-gray-900"><LayoutDashboard /></span> Dashboard</Link>
                        <Link to="/u/admin/product" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"><span className="text-gray-900"><Package /></span>Products</Link>
                        <Link to="/u/admin/category" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"><span className="text-gray-900"><Tags /></span>Categories</Link>
                        <Link to="#" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"><span className="text-gray-900"><ClipboardList /></span>Orders</Link>
                        <Link to="#" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"><span className="text-gray-900"><Users /> </span>Customers</Link>
                        <Link to="#" className="hover:bg-primary p-2 rounded-lg font-bold font-mono flex gap-3"><span className="text-gray-900"><Settings /></span>Settings</Link>
                    </div>
                </section>
                {admin.name && <footer>
                    <div className="border-t border-t-neutral-500 pt-3 flex  gap-2 items-center">
                        <div className="border rounded-full h-10 w-10 text-center text-2xl font-bold shadow-lg shadow-neutral-500/60">{admin?.name?.charAt(0) ?? ""}</div>
                        <div className="flex flex-col">
                            <span className="font-bold -mb-1">{admin?.name?.split(" ")[0] ?? ""}</span>
                            <span className="text-sm">{admin?.email ?? ""}</span>

                            {/* An option button to logout and  do other things ⬇️⬇️*/}
                        </div>
                    </div>
                </footer>}
            </nav>

            {/* Main */}
            <main className="flex-1 ml-72 p-4 bg-neutral-100">
                <Outlet />
            </main>
        </div>
    )
}
export default Administrator;