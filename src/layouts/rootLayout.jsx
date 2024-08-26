import { useEffect, useState } from "react";
import { Link, NavLink, Outlet,useNavigate  } from "react-router-dom";
import bodyBg from "../assets/body-bg.jpg";
import logoImg from "../assets/logo/logo_White.png";
import team from "../assets/team/team1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faBars, faMagnifyingGlass, faSortDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'; 
export default function RootLayout() {
     const [navBar, setNavBar] = useState(false)
     const [dropMenu, setDropMenu] = useState();
     const [inputValue, setInputValue] = useState('');
     const navigate = useNavigate();
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleSearchClick = async () => {
     // Example API call using fetch
     const response = await fetch('http://127.0.0.1:5000/translate_instruction_to_pagechoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instruction: inputValue }), // Ensure this matches what your Flask app expects
    });

     const data = await response.json();
     
     console.log(data.page);
        // Example response handling
        switch (data.page) {
            case 'RechercheBd':
               console.log("test"); 
                navigate('/app/recherche_bd', { state: { query: inputValue } });
                break;
            case 'Recherche opposition':
                navigate('/app/recherche_opp', { state: { query: inputValue } });
            
                break;
            // Add more cases as needed
            default:
                console.log('Page not found.');
        }
     console.log(data); // Process your response data as needed
 };
     useEffect(() => {
          if (window.screen.width >= 1024) {
               setNavBar(true)
          }
     }, [])

     return (
          <div style={{ backgroundImage: `url(${bodyBg})` }} className="relative bg-top bg-fixed sl-bg-full">
               <nav className={`fixed top-0 left-0 bottom-0 overflow-x-hidden z-50 sl-animated-lg bg-slate text-white ${navBar ? "w-[270px]" : "w-0"}`}>
                    <div className="relative md:p-7 px-9 py-5">
                         <Link to={`/app/`}><img src={logoImg} alt="logo" /></Link>
                         <button onClick={() => setNavBar(false)} className="absolute right-2 top-1 lg:hidden flex justify-center items-center w-5 h-5 rounded-full border-2 border-slate"><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                    <ul className="font-medium uppercase">
                         <li><NavLink to={`/app/recherche_bd`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche Bd</NavLink></li>
                         <li><NavLink to={`/app/recherche_dant`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Rapport Du Recherche</NavLink></li>
                         <li><NavLink to={`/app/recherche_marque`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche Marque</NavLink></li>
                         <li><NavLink to={`/app/recherche_opp`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche Oppositions</NavLink></li>
                         <li><NavLink to={`/app/recherche_tribunal`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche Tribunal</NavLink></li>
                         <li><NavLink to={`/app/recherche_dmi`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche DMI</NavLink></li>
                         <li><NavLink to={`/app/recherche_ompic`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Recherche Ompic</NavLink></li>
                         <li>
                              <button onClick={() => { dropMenu === "val1" ? setDropMenu("") : setDropMenu("val1") }} id="val1" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "val1" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Val 1
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/70 sl-animated-lg ${dropMenu === "val1" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/comparison`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Valeur De Comparaison</NavLink></li>
                                   <li><NavLink to={`/app/strong_valid`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Phonetique</NavLink></li>
                                   <li><NavLink to={`/app/validation`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Notification Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification_manage`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Gestion Des Conflits</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "val2" ? setDropMenu("") : setDropMenu("val2") }} id="val2" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "val2" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Val 2
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/70 sl-animated-lg ${dropMenu === "val2" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/strong_valid_global`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Phonetique</NavLink></li>
                                   <li><NavLink to={`/app/Validation_global`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notificationglobal`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Notification Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification_manage_global`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Gestion Des Conflits</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "val3" ? setDropMenu("") : setDropMenu("val3") }} id="val3" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "val3" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Val 3
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/70 sl-animated-lg ${dropMenu === "val3" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/strong_valid`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Phonetique</NavLink></li>
                                   <li><NavLink to={`/app/validation`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Notification Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification_manage`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Gestion Des Conflits</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "val4" ? setDropMenu("") : setDropMenu("val4") }} id="val4" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "val4" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Val 4
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/70 sl-animated-lg ${dropMenu === "val4" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                              <li><NavLink to={`/app/Listwl`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Watch list</NavLink></li>
                              <li><NavLink to={`/app/strong_valid_globalwl`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Phonetique</NavLink></li>
                                   <li><NavLink to={`/app/Validation_globalwl`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Validation Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notificationglobalwl`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Notification Des Conflits</NavLink></li>
                                   <li><NavLink to={`/app/notification_manage_globalwl`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Gestion Des Conflits</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "image" ? setDropMenu("") : setDropMenu("image") }} id="image" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "image" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Image Similarite
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/10 sl-animated-lg ${dropMenu === "image" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/img_similarity`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Similitude des images</NavLink></li>
                                   <li><NavLink to={`/app/img_validation`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Notification Des Conflit</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "opp" ? setDropMenu("") : setDropMenu("opp") }} id="opp" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "opp" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>Opposition
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/10 sl-animated-lg ${dropMenu === "opp" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/formulaire`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Formulaire</NavLink></li>
                                   <li><NavLink to={`/app/formulaires`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Formulaires</NavLink></li>
                                   <li><NavLink to={`/app/result`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Resultat</NavLink></li>
                                   <li><NavLink className={"block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Historique</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "app1" ? setDropMenu("") : setDropMenu("app1") }} id="app1" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "app1" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>App V1
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/10 sl-animated-lg ${dropMenu === "app1" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/add_alert`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Ajouter Alerte</NavLink></li>
                                   <li><NavLink to={`/app/generate_pdf`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Generer Document</NavLink></li>
                                   <li><NavLink to={`/app/parameter`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Parametre</NavLink></li>
                              </ul>
                         </li>
                         <li>
                              <button onClick={() => { dropMenu === "app2" ? setDropMenu("") : setDropMenu("app2") }} id="app2" className={`relative block w-full md:py-4 py-3 md:px-5 px-3 text-left border-l-8 hover:text-white hover:bg-sky/30 hover:border-purple sl-animated-md ${dropMenu === "app2" ? "text-white bg-sky/30 border-purple" : "border-transparent "}`}>App V2
                                   <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span></button>
                              <ul className={`bg-sky/10 sl-animated-lg ${dropMenu === "app2" ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0"}`}>
                                   <li><NavLink to={`/app/recherche_phonetique`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Recherche Phonetique</NavLink></li>
                                   <li><NavLink to={`/app/parameter`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white bg-gradient-to-b from-purple to-violet sl-animated-md" : "block md:py-4 py-3 md:pr-5 pr-3 md:pl-14 pl-8 text-white hover:bg-gradient-to-b hover:from-purple hover:to-violet sl-animated-md"}>Parametre</NavLink></li>
                              </ul>
                         </li>
                         <li><NavLink to={`/app/archive`} className={({ isActive }) => isActive ? "block md:py-4 py-3 md:px-5 px-3 text-white bg-sky/30 border-l-8 border-purple sl-animated-md" : "block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Archive</NavLink></li>
                         <li><NavLink className={"block md:py-4 py-3 md:px-5 px-3 border-l-8 border-transparent hover:text-white hover:bg-sky/30 hover:border-l-8 hover:border-purple sl-animated-md"}>Ip Data</NavLink></li>
                    </ul>
               </nav>
               <main className={`relative md:p-8 p-4 min-h-screen ${navBar ? "lg:ml-[270px]" : "ml-0"}`}>
                    <header className="flex justify-between items-center text-slate">
                         <div className="flex items-start md:gap-9 sm:gap-5 gap-3">
                              <button onClick={() => setNavBar(!navBar)} className="text-xl hover:text-violet sl-animated-md">
                                   <FontAwesomeIcon icon={faBars} />
                              </button>
                              <div className="flex items-center sm:gap-3 gap-1 border-b border-slate md:pb-3 sm:pb-2 pb-1">
                                   <button className="inline-block text-base" onClick={handleSearchClick} ><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                                   <input type="text" placeholder="CHERCHER" className="sm:w-40 w-24 placeholder:text-slate" value={inputValue}
                onChange={handleInputChange} />
                              </div>
                         </div>
                         <div className="relative group md:block hidden">
                              <button className="flex items-center gap-2 py-2 hover:text-violet sl-animated-md">
                                   <span>French</span>
                                   <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                              <ul className="absolute top-full w-full hidden bg-slate/70 py-1 text-white group-hover:block text-center">
                                   <li className="py-2 px-3 cursor-pointer hover:bg-gradient-to-t hover:from-violet hover:to-purple">French</li>
                                   <li className="py-2 px-3 cursor-pointer hover:bg-gradient-to-t hover:from-violet hover:to-purple">English</li>
                              </ul>
                         </div>
                         <div className="relative group md:hidden block">
                              <button className="flex items-center gap-1 py-2 hover:text-violet sl-animated-md">
                                   <span>Fn</span>
                                   <FontAwesomeIcon icon={faArrowDown} />
                              </button>
                              <ul className="absolute top-full w-full hidden bg-slate/70 py-1 text-white group-hover:block text-center">
                                   <li className="py-1 px-2 cursor-pointer hover:bg-gradient-to-t hover:from-violet hover:to-purple">Fn</li>
                                   <li className="py-1 px-2 cursor-pointer hover:bg-gradient-to-t hover:from-violet hover:to-purple">En</li>
                              </ul>
                         </div>
                         <div className="group relative">
                              <button className="sm:w-10 w-8 sm:h-10 h-8 rounded-full overflow-hidden">
                                   <img src={team} alt="" />
                              </button>
                              <button className="absolute top-full -right-3 hidden group-hover:block w-max bg-slate/70 text-white md:p-2 p-1 font-medium">Déconnecter</button>
                         </div>
                    </header>
                    <div className="pt-12">
                         <Outlet />
                    </div>
               </main>
          </div>
     )
}