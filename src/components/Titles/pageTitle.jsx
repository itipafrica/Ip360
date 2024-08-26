export default function PageTitle({ children, classes }) {
     return (<h2 className={`text-lg capitalize text-slate font-medium mb-8 ${classes}`}>{children}</h2>)
}