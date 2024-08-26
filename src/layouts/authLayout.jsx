import { Outlet } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import bodyBg from "../assets/body-bg.jpg";

export default function AuthLayout() {
     return (
          <div style={{ backgroundImage: `url(${bodyBg})` }} className="relative bg-no-repeat bg-cover bg-center h-screen w-full flex justify-center items-center">
               <div className="max-w-[25rem] w-11/12 bg-white shadow-lg rounded-md py-10 px-16">
                    <a href="" className="max-w-60"><img src={logo} alt="logo" /></a>
                    <Outlet />
               </div>
          </div>
     )
}