export default function BasicParagraph({ children, className = "", ...props }) {
    return (
        <p className={`text-base leading-7 max-w-5xl mx-auto ${className}`} {...props}>
            {children}
        </p>
    )
}