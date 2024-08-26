export default function CheckBox({ id, label, classes, revere, onChange, role }) {
     return (
          <div className={`flex items-center gap-2 mb-4 ${classes}`}>
               {!revere && <label htmlFor={id} className="">{label}</label>}
               <input role={role} id={id} name={id} className="w-fit" type="checkbox" onChange={(e) => onChange(e.target)} />
               {revere && <label htmlFor={id} className="">{label}</label>}
          </div>
     )
}