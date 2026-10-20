import { Link } from "react-router-dom";
import Header from "./Header";

function Home(){
    return(
        <div className="">
            <header className="relative min-h-[160px] bg-[url('/hero1.png')] bg-cover bg-no-repeat">
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10">
                    <Header />
                    <div className="flex flex-col justify-center items-center gap-3 mt-[12%] p-4 text-white">
                        <h3 className="font-bold text-xl text-white">SUMMER ESSENTIALS</h3>
                        <p className="text-center font-medium text-white">Refresh your wardrobe with lightweight styles made for sunny days. <span className="block -mt-2">Shop the season's favorites before they're gone.</span></p>
                        
                        <Link to="#" className="mt-4 border p-5 text-white">SHOP NOW</Link>
                    </div>
                </div>
            </header>
            <main className="grid grid-cols-3 gap-4 m-4">
                <div className="border h-20">1</div>
                <div className="border h-20">2</div>
                <div className="border h-20">3</div>
            </main>
        </div>
    )
}
export default Home

/* THIS IS MY LANDING PAGE OR THE PAGE THAT THE CUSTOMER HAVE TO SEE */