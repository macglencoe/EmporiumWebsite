import Link from "next/link";


const PageTitle1 = (props) => {
  return (
    <>
      <div className="page-title-container">
        <div>
          <h1 className="cigar-page-text116">{props.children}</h1>
          <div className="cigar-page-container32"></div>
          
        </div>
        <div>
          {props.subtitle && <h2>{props.subtitle}</h2>}
        {(props.next || props.prev) && props.href && props.nameField &&
            <nav>
              <ul>
                {props.prev && props.prev[props.nameField] &&
                  <li>
                    <Link href={".." + props.href + "/" + props.prev.slug}>
                      <a className="prev" aria-label='Previous' tabIndex={0}>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" width="2em" ><path d="M560-208 288-480l272-272 88 88-184 184 184 184-88 88Z" /></svg>
                        </div>
                      </a>
                    </Link>

                  </li>
                }
                {props.next && props.next[props.nameField] &&
                  <li>
                    <Link href={".." + props.href + "/" + props.next.slug}>
                      <a className="next" aria-label='Next' tabIndex={0}>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 -960 960 960" width="2em" ><path d="M472-480 288-664l88-88 272 272-272 272-88-88 184-184Z" /></svg>
                        </div>
                      </a>
                    </Link>
                  </li>
                }
              </ul>
            </nav>
          }
        </div>
      </div>
      <style jsx>
        {`
            nav {
              align-self: flex-end;
            }
            nav a {
              outline: none;
            }
            nav ul {
              display: flex;
              align-items: center;
              list-style-type: none;
            }
            nav li {
              padding: 0 2px;
              width: max-content;
              transition: border-radius 0.2s ease-in-out;
            }
            
            nav li:hover, nav li:focus-within {
              outline: none;
            }
            nav li:active div{
              transform: scale(0.9);
            }
            nav svg {
              fill: var(--dl-color-theme-primary1);
            }
            nav li:first-child {
              border-right: 2px solid var(--dl-color-theme-primary1);
            }
            nav li:last-child {
              border-left: 2px solid var(--dl-color-theme-primary1);
            }

            nav li svg {
              transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.575);
            }

            nav li:first-child:hover svg, nav li:first-child:focus-within svg {
              transform: translate(-8px, 0);
            }

            nav li:last-child:hover svg, nav li:last-child:focus-within svg {
              transform: translate(8px, 0);
            }
        
        .page-title-container {
          background-color: var(--dl-color-theme-secondary2);
          display: flex;
          flex-direction: column;
          padding: 10px;


        }
        .page-title-container h2 {
          color: var(--dl-color-theme-primary1);
          font-weight: 600;
          font-size: 1em;
          margin-top: 10px;
        }
        .page-title-container > div:first-child {
            gap: var(--dl-space-space-unit);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .page-title-container > div:last-child {
          margin-left: 10px;
            gap: var(--dl-space-space-unit);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .page-title-container  h1 {
            fill: var(--dl-color-theme-primary1);
            color: var(--dl-color-theme-primary1);
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
          }
        .cigar-page-container32 {
            flex: 1;
            width: 100%;
            height: 10px;
            display: flex;
            align-items: center;
            background-color: var(--dl-color-theme-primary1);
          }
            
            `}
      </style>
    </>
  )
}

export default PageTitle1;