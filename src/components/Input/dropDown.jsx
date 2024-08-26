import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"

export default function DropDown({ id, label, list, defaultText, classes, onChange }) {
     const [dropMenu, setDropMenu] = useState(false)
     const [selectValue, setSelectValue] = useState(defaultText);

     return (
          <div id={id} name={id} className={`mb-4 rounded-full ${classes}`}>
               {label && <label className="inline-block mb-2 uppercase tracking-wider">{label}</label>}
               <div className="relative border border-sky/30 rounded-full">
                    <button type="button" className="w-full p-3 text-left" onClick={() => setDropMenu(!dropMenu)}>{selectValue}</button>
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span>
                    <ul className={`absolute top-full w-full left-0 bg-white rounded-md max-h-60 overflow-y-auto sl-shadow-fade z-30 ${dropMenu ? "block" : "hidden"}`}>
                         {list && list.map((value, index) => (
                              <li
                              onClick={() => {
                                   setDropMenu(false);
                                   setSelectValue(value);
                                   onChange(value); // <-- Change from onchange to onChange
                               }}
                                   key={index}
                                   className="px-3 py-2 cursor-pointer w-full first:rounded-t-md last:rounded-b-md hover:bg-slate hover:text-white sl-animated-md">
                                   {value}
                              </li>
                         ))}
                    </ul>
               </div>
          </div>
     )
}