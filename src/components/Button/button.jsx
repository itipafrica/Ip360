export default function Button({ children, bg, classes, ...rest }) {
     return (
          <button className={`md:px-5 px-4 uppercase font-semibold tracking-wider rounded-full hover:sl-shadow-fade sl-animated-lg ${!bg ? "text-white bg-gradient-to-r from-violet to-purple leading-[30px]" : "bg-white border border-purple leading-[28px]"} ${classes}`} {...rest}>{children}</button>
     )
}