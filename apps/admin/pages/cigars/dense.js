import { useState, useEffect, useMemo } from "react";
import Layout from "../../components/layout";
import PageTitle1 from "../../components/pagetitle1";
import { PiArrowDownBold, PiArrowUpBold, PiMagnifyingGlassBold } from "react-icons/pi";

export const getStaticProps = async () => {
    const data = await import('../../public/data/consolidated_cigars.json');
    return {
        props: {
            data: data.default
        },
    };
};

export default function DenseCatalog({ data }) {
    const [search, setSearch] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [sortKey, setSortKey] = useState('Cigar Name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Flatten cigars → individual rows with sizes
    const flatData = useMemo(() => {
        return data.flatMap(cigar =>
            cigar.Sizes.map(size => ({
                name: cigar["Cigar Name"],
                brand: cigar["Cigar Brand"],
                wrapper: cigar.Wrapper,
                dateAdded: cigar["Date Added"],
                size: size.Size,
                price: size.Price,
                barcode: size.Barcode,
                slug: cigar.slug
            }))
        );
    }, [data]);

    // Unique brands for filter
    const allBrands = [...new Set(flatData.map(d => d.brand))];

    // Filtering + sorting logic
    const filtered = useMemo(() => {
        let rows = [...flatData];

        if (brandFilter) {
            rows = rows.filter(d => d.brand === brandFilter);
        }

        if (search) {
            const lower = search.toLowerCase();
            rows = rows.filter(d =>
                d.name?.toLowerCase().includes(lower) ||
                d.brand?.toLowerCase().includes(lower) ||
                d.size?.toLowerCase().includes(lower)
            );
        }

        rows.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (sortKey === "price") {
                const parsePrice = str => parseFloat(str?.replace(/[^0-9.]/g, '') || 0);
                valA = parsePrice(valA);
                valB = parsePrice(valB);
            } else if (sortKey === "dateAdded") {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA === undefined) return 1;
            if (valB === undefined) return -1;

            return sortDirection === 'asc'
                ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
                : String(valB).localeCompare(String(valA), undefined, { numeric: true });
        });

        return rows;
    }, [flatData, search, brandFilter, sortKey, sortDirection]);

    return (
        <Layout>
            <PageTitle1>Dense Catalog</PageTitle1>

            <div className="controls">
                <input
                    type="search"
                    placeholder="Search cigars..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
                    <option value="">All Brands</option>
                    {allBrands.map(b => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
            </div>

            <div className="help">
                <span><b>Tip: </b>Click on any column header to sort by that column</span>
            </div>

            <table className="dense-table">
                <thead>
                    <tr>
                        {[
                            { key: 'name', label: 'Name' },
                            { key: 'brand', label: 'Brand' },
                            { key: 'size', label: 'Size' },
                            { key: 'price', label: 'Price' },
                            { key: 'dateAdded', label: 'Date Added' },
                            { key: 'barcode', label: 'Barcode' },
                        ].map(({ key, label }) => (
                            <th
                                key={key}
                                onClick={() => {
                                    if (sortKey === key) {
                                        setSortDirection(dir => dir === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortKey(key);
                                        setSortDirection('asc');
                                    }
                                }}
                                className="sortable"
                            >
                                <div className="sort-container">
                                    {label}
                                    {sortKey === key && (
                                        <span className="arrow">{sortDirection === 'asc' ? <PiArrowUpBold size={16}/> : <PiArrowDownBold size={16}/>}</span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {filtered.map((row, idx) => (
                        <tr key={idx}>
                            <td><a href={`/cigars/${row.slug}`}>{row.name}</a></td>
                            <td>{row.brand}</td>
                            <td>{row.size}</td>
                            <td className="price">{row.price}</td>
                            <td>{row.dateAdded || <i>N/A</i>}</td>
                            <td>{row.barcode || <i>None</i>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .controls {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1em;
                    margin: 1em 0;
                }

                input[type="search"], select {
                    padding: 0.5em;
                    background-color: var(--dl-color-theme-primary2);
                    color: var(--dl-color-theme-secondary1);
                }

                table.dense-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--dl-color-theme-primary2);
                }

                th, td {
                    border: 1px solid var(--dl-color-theme-primary1);
                    padding: 0.5em;
                    font-size: 0.9em;
                    
                }

                th {
                    background-color: var(--dl-color-theme-secondary2);
                    color: var(--dl-color-theme-primary2);
                }
                th .sort-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }

                td.price {
                    font-weight: bold;
                    color: var(--dl-color-theme-secondary2);
                }
                td a {
                    color: var(--dl-color-theme-secondary2);
                    border-bottom: 1px solid var(--dl-color-theme-secondary2);
                }
                    th.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
}

th.sortable:hover {
    background-color: var(--dl-color-theme-secondary1);
}

.arrow {
    margin-left: 0.3em;
    font-size: 0.8em;
}

            `}</style>
        </Layout>
    );
}
