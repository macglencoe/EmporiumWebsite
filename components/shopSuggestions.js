import Link from "next/link"


const ShopSuggestions = (props) => {
  return (
    <>
      <div className="">
        <div className="flex flex-col gap-4 p-2 items-start justify-center w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-start flex-wrap">
            <h1 className="text-3xl font-normal italic">
              Search&nbsp;
              <b className="font-bold text-secondary1 uppercase">{props.title}</b>
              &nbsp;by:
            </h1>
          </div>
  
          <div className="flex flex-col md:flex-row gap-4 p-2 items-center justify-center w-full">
            {
              props.items.map((item, index) => (
                <Link href={item.href} key={index} tabIndex={0} aria-label={'Search' + props.title + 'By' + item.label} className="w-full group">
                    <button className="border-3 border-secondary2 p-5 cursor-pointer w-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl">
                      <span className="text-lg font-bold uppercase transition-colors duration-300 ease-out text-secondary1 ">
                        {item.label}
                      </span>
                    </button>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      <style jsx>
        {`
          @media (max-width: 1200px) {
            .shop-suggestions {
              flex-direction: column;
            }
          }
          @media (max-width: 680px) {
            .shop-suggestions-card > span {
              color: var(--dl-color-theme-secondary1);
            }
          }
        `}
      </style>
    </>
  )
}

export default ShopSuggestions