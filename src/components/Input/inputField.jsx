export default function InputField({ id, label, required, classes, ...rest }) {
     return (
          <div className={`w-full mb-4 ${classes}`}>
               <label htmlFor={id} className={`relative uppercase tracking-wider ${required ? "after:absolute after:-right-3 after:top-0 after:text-red after:content-['*']" : ""}`}>{label}</label>
               <input id={id} name={id} className="relative w-full p-3 border border-sky/30 rounded-full mt-2 placeholder:uppercase" {...rest}  />
          </div>
     )
}