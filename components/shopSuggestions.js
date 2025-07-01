import Link from "next/link"

const ShopSuggestions = (props) => {
  return (
    <>
      <div className="beveled-box w-full max-w-5xl mx-auto my-2 bg-secondary2">
        <div className="beveled-box-inner"></div>
        <div className="flex flex-col p-2 justify-center">
          <div className="flex items-center justify-center text-center flex-wrap">
            <h1 className="text-3xl md:text-5xl m-6 font-normal text-primary2">
              Search&nbsp;
              <b className="font-bold text-primary1 uppercase">{props.title}</b>
              &nbsp;by:
            </h1>
          </div>
  
          <div className="w-full p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
              {props.items.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  tabIndex={0}
                  aria-label={`Search ${props.title} by ${item.label}`}
                  className="w-full group"
                >
                  <button className="beveled-button w-full p-4 transition-transform hover:scale-105 shadow-md font-bold text-lg uppercase bg-primary1 text-secondary1 cursor-pointer">
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .beveled-box {
          clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
          -webkit-clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
          position: relative;
        }
        .beveled-box > .flex {
          position: relative;
          z-index: 1;
        }
        .beveled-box > .beveled-box-inner {
          content: "";
          position: absolute;
          inset: 5px;
          background-color: var(--dl-color-theme-primary1);
          clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
          -webkit-clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
        }
        .beveled-box > .beveled-box-inner::before {
          content: "";
          position: absolute;
          inset: 4px;
          background-color: var(--dl-color-theme-secondary1);
          clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
          -webkit-clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
        }
        .beveled-button {
          clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
          -webkit-clip-path: polygon(
            16px 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            16px 100%,
            0 calc(100% - 16px),
            0 16px
          );
        }
      `}</style>
    </>
  );
};

export default ShopSuggestions;
