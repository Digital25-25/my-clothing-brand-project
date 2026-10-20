import { useState } from "react";
import { Bell, User, Search } from "lucide-react";

function Dashboard(){
    return(
        <div className="ml-5">
            {/* Head Section */}
            <section className="flex justify-between items-center mb-10">
                <h1 className="font-black font-mono text-4xl">Dashboard</h1>
                <div className="flex gap-7 items-center">
                    <div className="mr-10 relative">
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"><Search /></button>
                        <input className="border border-neutral-500 px-3 py-2 pl-13 rounded-lg bg-white w-full focus:outline-none focus:ring-1 focus:ring-neutral-500" type="text" placeholder="Search orders, products..."/>
                    </div>
                    <button className="cursor-pointer "><Bell /></button>
                    <button className="border bg-white border-neutral-500 cursor-pointer rounded-full p-2"><User /></button>
                </div>
            </section>
            {/* Overview*/}
            <section>
                <div className="grid grid-cols-4 gap-2">
                    <div className="p-3 bg-white rounded shadow flex flex-col gap-4">
                        <h1 className="font-mono font-black text-xs text-neutral-400">REVENUE</h1>
                        <span className="text-xl font-bold font-mono">$41,240.00</span>
                        <span className="-mt-3 text-xs font-bold text-blue-600">2%</span>
                    </div>
                    <div className="p-3 bg-white rounded shadow flex flex-col gap-4">
                        <h1 className="font-mono font-black text-xs text-neutral-400">ORDERS</h1>
                        <span className="text-xl font-bold font-mono">381</span>
                        <span className="-mt-3 text-xs font-bold text-green-600">2%</span>
                    </div>
                    <div className="p-3 bg-white rounded shadow flex flex-col gap-4">
                        <h1 className="font-mono font-black text-xs text-neutral-400">NEW CUSTOMERS</h1>
                        <span className="text-xl font-bold font-mono">423</span>
                        <span className="-mt-3 text-xs font-bold text-red-600">2%</span>
                        
                    </div>
                    <div className="p-3 bg-white rounded shadow flex flex-col gap-4">
                        <h1 className="font-mono font-black text-xs text-neutral-400">PRODUCT ACTIVE</h1>
                        <span className="text-xl font-bold font-mono">1823</span>
                        <span className="-mt-3 text-xs font-bold text-orange-500">2%</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Dashboard;