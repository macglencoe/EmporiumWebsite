export default function TitleCrest({ icon, children, ...props }) {
    const IconComponent = icon;
    return (
        <div className='relative my-5 flex flex-col gap-3 items-center' {...props}>
            <div className='relative rounded-full border-9 border-double border-secondary2 h-20 w-20 flex items-center justify-center opacity-30 p-2 bg-primary2'
            >
                <IconComponent className='h-full w-full'
                />
            </div>
            <h2 className='text-center text-3xl md:text-5xl font-bold text-secondary2 tracking-wider'>{children}</h2>
        </div>
    )
}