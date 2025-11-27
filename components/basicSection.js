import Image from "next/image"
import TitleCrest from "./titleCrest"

export default function BasicSection({ backdropSrc, title, titleIcon, children, ...props }) {
    return (
        <section className='relative bg-primary2/50 py-8 flex flex-col gap-5' {...props}>
            {/* backdrop */}
            <div className='absolute inset-0'>
                <Image layout='fill' className="object-cover opacity-15" src={backdropSrc} />
                <div className='absolute inset-0' style={{
                    boxShadow: "inset 0 0 400px -300px black"
                }} />
            </div>
            <TitleCrest icon={titleIcon}>{title}</TitleCrest>
            {children}
        </section>
    )
}