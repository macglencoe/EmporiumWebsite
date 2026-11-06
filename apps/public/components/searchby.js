import Link from 'next/link';
import { useRouter } from 'next/router';
import PageTitle1 from './pagetitle1';

const SearchBy = (props) => {
  const router = useRouter();

  if (!props.data) {
    return (
      <div className="p-6">
        <PageTitle1>Data not found</PageTitle1>
        <p className="text-sm text-secondary2 mt-2">This likely means that the <code className="bg-gray-200 px-1 py-0.5 rounded">data</code> prop in <code className="bg-gray-200 px-1 py-0.5 rounded">SearchBy</code> is unset.</p>
        <pre className="mt-4 bg-primary2 text-secondary2 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  }

  const extractValues = () => {
    if (props.method === 'flatmap' && props.flatmap) {
      return [...new Set(
        props.data.flatMap(item =>
          item[props.flatmap]
            ? item[props.flatmap]
                .map(size => size?.Size?.trim())
                .filter(Boolean)
            : []
        )
      )];
    } else if (props.method === 'list') {
      return [...new Set(
        props.data.flatMap(item =>
          item[props.field]
            ? item[props.field].map(v => v.trim())
            : []
        )
      )];
    } else {
      return [...new Set(
        props.data
          .map(item => item[props.field]?.trim())
          .filter(Boolean)
      )];
    }
  };

  const sortedValues = extractValues().sort((a, b) => a.localeCompare(b));

  const groupedByLetter = sortedValues.reduce((groups, value) => {
    const letter = value[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(value);
    return groups;
  }, {});

  return (
    <div className="px-4 py-12 max-w-6xl mx-auto">
      {/* Divider */}
      <div className="h-2 bg-secondary2 w-full mb-12" />

      {/* Title */}
      <h1 className="text-center text-4xl md:text-5xl font-bold text-secondary2 mb-12 font-serif tracking-wide">
        {props.title}
      </h1>

      {/* Alphabet Groups */}
      {Object.keys(groupedByLetter).sort().map(letter => (
        <div key={letter} className="mb-12">
          <h2 className="text-2xl font-bold text-secondary2 mb-4 border-b-2 border-secondary2 inline-block font-serif tracking-wide">
            {letter}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {groupedByLetter[letter].map((brand, index) => (
              <Link
                key={index}
                href={`/${props.catalogPath}?${props.field}=${encodeURIComponent(brand)}`}
              >
                <a className="block border-b-2 border-primary1 hover:border-secondary2 transition-all duration-200 text-secondary2 hover:text-secondary1 text-sm font-semibold uppercase px-2 py-1 tracking-wide focus:outline-none focus:ring-2 focus:ring-secondary2 bg-primary2/10 hover:bg-primary2/20 font-['Inter']">
                  {brand}
                </a>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchBy;
