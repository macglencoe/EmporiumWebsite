import { use, useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CatalogFilter = (props) => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const router = useRouter();

    useEffect(() => {
        const queryValue = router.query[props.name];
        if (queryValue) {
            setSelectedFilter(queryValue);
        } else {
            setSelectedFilter('');
        }
    }, [router.query, props.name]);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
        props.handleFilterChange(event);
    }

    return (
        <>

            <div className="select-wrap">
                <label>{props.label}</label>
                <select name={props.name} onChange={handleFilterChange} value={selectedFilter}>
                    <option value="">{props.defaultValue}</option>
                    {props.values.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>
            <style jsx>
                {
                    `

        .select-wrap {
  padding: 0 5px;
  width:100%;
  background-color: var(--dl-color-theme-primary1);
  position:relative;
}
.select-wrap label{
  font-size:10px;
  text-transform: uppercase;
  color: var(--dl-color-theme-secondary1);
  padding: 0 5px;  
  position: absolute;
  top:5px;
  font-weight: 600;
}

.select-wrap select{
  background-color: var(--dl-color-theme-primary1);
  border:0px;
  height:50px;
  font-size: 16px;
  width:100%;
}
        .catalog-accordion2 {
            width: 100%;
            display: flex;
            max-height: 230px;
            flex-direction: column;
            flex: 1;
          }
          .catalog-trigger2 {
            cursor: pointer;
            padding-top: var(--dl-space-space-halfunit);
            padding-left: var(--dl-space-space-oneandhalfunits);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-halfunit);
            background-color: var(--dl-color-theme-primary1);
          }
        .catalog-summary2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .catalog-icon-container2 {
            transition: transform 0.3s ease-in-out;
          }
          .catalog-content3 {
            background-color: var(--dl-color-theme-primary2);
          } 
                    `
                }
            </style>
        </>
    )
}

const Filters = (props) => {

    const handleFilterChange = (event) => {
        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                [event.target.name]: event.target.value,
                page: 1
            }
        });
    };

    const router = useRouter();

    return (
        <>
            <div data-thq="accordion-content" className="filters-containers">
                <div className="catalog-container32">

                    {props.filters &&
                        props.filters.map((filter) => (
                            <CatalogFilter
                                name={filter.name}
                                label={filter.label}
                                values={filter.values}
                                defaultValue={filter.defaultValue}
                                handleFilterChange={handleFilterChange}
                            />
                        ))
                    }

                </div>
            </div>
            <style jsx>
                {`
.filters-containers {
    width: 100%;
    display: flex;
}
.catalog-container32 {
            gap: 8px;
            width: 100%;
            height: auto;
            display: flex;
            padding: var(--dl-space-space-halfunit);
            align-items: flex-start;
            flex-direction: column;
            background-color: var(--dl-color-theme-secondary2);
          }
            
                `}
            </style>
        </>
    )
}

export default Filters