import Link from "next/link";
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

const PageTitle1 = (props) => {
  return (
    <div className="bg-secondary2 px-3 py-3">
      {/* Title & Divider */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-primary1 text-3xl md:text-4xl font-bold tracking-wide">
          {props.children}
        </h1>
        <div className="flex-1 h-1 bg-primary1" />
      </div>

      {/* Subtitle, Nav Arrows, and Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ml-1">
        {/* Subtitle */}
        {props.subtitle && (
          <h2 className="text-primary1 text-sm md:text-base font-inter font-semibold tracking-wide">
            {props.subtitle}
          </h2>
        )}

        {/* Prev / Next Arrows */}
        {(props.prev || props.next) && props.href && props.nameField && (
          <nav aria-label="Previous/Next navigation">
            <ul className="flex items-center list-none p-0 m-0 gap-1">
              {props.prev?.[props.nameField] && (
                <li>
                  <Link href={`..${props.href}/${props.prev.slug}`}>
                    <a
                      className="inline-flex items-center justify-center transition hover:scale-105 text-primary1 w-10 h-10 bg-primary1/10 hover:bg-primary1/20"
                      aria-label="Previous"
                      tabIndex={0}
                    >
                      <PiArrowLeftBold height={34} width={34} className="fill-primary1 w-full h-8" />
                    </a>
                  </Link>
                </li>
              )}
              {props.next?.[props.nameField] && (
                <li>
                  <Link href={`..${props.href}/${props.next.slug}`}>
                    <a
                      className="inline-flex items-center justify-center transition hover:scale-105 text-primary1 w-10 h-10 bg-primary1/10 hover:bg-primary1/20"
                      aria-label="Next"
                      tabIndex={0}
                    >
                      <PiArrowRightBold height={34} width={34} className="fill-primary1 w-full h-8" />
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Action Buttons */}
        {props.buttons?.length > 0 && (
          <nav className="w-full sm:w-auto">
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {props.buttons.map((button, index) => (
                <li key={index}>
                  {button.onClick ? (
                    <button
                      onClick={button.onClick}
                      className="inline-flex items-center gap-2 bg-primary1 text-secondary2 font-bold font-inter px-4 py-2 rounded hover:bg-primary2 transition"
                    >
                      {button.icon && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          className="w-[1.3em] h-[1.3em] fill-secondary2"
                        >
                          {button.icon}
                        </svg>
                      )}
                      {button.label}
                    </button>
                  ) : (
                    <a
                      href={button.href}
                      className="inline-flex items-center gap-2 bg-primary1 text-secondary2 font-bold font-inter px-4 py-2 rounded hover:bg-primary2 transition"
                    >
                      {button.icon && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          className="w-[1.3em] h-[1.3em] fill-secondary2"
                        >
                          {button.icon}
                        </svg>
                      )}
                      {button.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageTitle1;
