
export default function SelectionField({ dataArray, id, label, revere, onChange }) {
     return (
          <div className="mb-4">
               {label && <span className="inline-block mb-2 uppercase tracking-wider">{label}</span>}
               <div className="flex flex-wrap items-center gap-6">
                    {dataArray && dataArray.map((item, index) => (
                         <div key={index} className="flex items-center gap-2">
                              {/* <input onClick={(e) => { onChange(e.target.value) }} className="w-fit" id={id + index} type="radio" name={id} value={item} /> */}
                              {revere && <label htmlFor={id + index}>{item}</label>}
                              <input className="w-fit" id={id + index} type="radio" name={id} value={item} />
                              {!revere && <label htmlFor={id + index}>{item}</label>}
                         </div>
                    ))}
               </div>
          </div>
     )
}