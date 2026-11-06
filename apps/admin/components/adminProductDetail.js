import Link from 'next/link';
import { PiArrowLeftBold, PiNotePencilBold, PiTrashBold } from 'react-icons/pi';
import Layout from './layout';
import PageTitle1 from './pagetitle1';
import styles from './adminProductDetail.module.css';

const LABELS = {
  Flavor_Profile: 'Flavor profile', Strength_Profile: 'Strength', 'Sale Form': 'Sale form',
  'Date Added': 'Date added', Podcast_Link: 'Podcast link', featured_Eds_Pick: "Ed's Pick",
  featured_Teds_Pick: "Ted's Pick", featured_StickFigures: 'Stick Figures feature', slug: 'Page address', hidden: 'Visibility',
};

function DisplayValue({ value, field }) {
  if (value === null || value === undefined || value === '') return <span className={styles.empty}>Not set</span>;
  if (field === 'hidden') return value ? 'Hidden from public catalog' : 'Visible in public catalog';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (field === 'Podcast_Link' && typeof value === 'string' && !value.includes('<iframe')) return <a href={value} target="_blank" rel="noreferrer">Open podcast link</a>;
  return String(value);
}

function DetailList({ fields, product }) {
  return <dl className={styles.detailList}>{fields.map((field) => <div key={field}><dt>{LABELS[field] || field}</dt><dd><DisplayValue field={field} value={product[field]} /></dd></div>)}</dl>;
}

function Sizes({ sizes = [] }) {
  return <section className={styles.section} aria-labelledby="sizes-heading">
    <header><h2 id="sizes-heading">Sizes and pricing</h2><span>{sizes.length} size{sizes.length === 1 ? '' : 's'}</span></header>
    {!sizes.length ? <p className={styles.emptyBlock}>No sizes have been added.</p> : <div className={styles.tableWrap}><table><thead><tr><th>Size</th><th>Price</th><th>Availability</th><th>Barcode</th></tr></thead><tbody>{sizes.map((size, index) => <tr key={`${size.Size || 'size'}-${size.Barcode || index}`}><td><strong>{size.Size || 'Unnamed size'}</strong></td><td>{size.Price ? `$${size.Price}` : <span className={styles.empty}>Not set</span>}</td><td><span className={`${styles.stock} ${size.In_Stock ? styles.inStock : styles.outOfStock}`}>{size.In_Stock ? 'In stock' : 'Out of stock'}</span></td><td className={styles.mono}>{size.Barcode || <span className={styles.empty}>Not set</span>}</td></tr>)}</tbody></table></div>}
  </section>;
}

function Components({ components = [] }) {
  return <section className={styles.section} aria-labelledby="components-heading"><header><h2 id="components-heading">Components</h2><span>{components.length}</span></header>{components.length ? <div className={styles.chips}>{components.map((component) => <span key={component}>{component}</span>)}</div> : <p className={styles.emptyBlock}>No components have been added.</p>}</section>;
}

export default function AdminProductDetail({ record, type }) {
  const product = record.legacy;
  const isCigar = type === 'cigar';
  const route = isCigar ? 'cigars' : 'tobacco';
  const name = product[isCigar ? 'Cigar Name' : 'Tobacco Name'];
  const brand = product[isCigar ? 'Cigar Brand' : 'Tobacco Brand'];
  const detailFields = isCigar ? ['Cigar Brand', 'Wrapper', 'Binder', 'Filler', 'Flavor_Profile', 'Strength_Profile'] : ['Tobacco Brand', 'Family', 'Sale Form'];
  const adminFields = isCigar ? ['Date Added', 'hidden', 'featured_Eds_Pick', 'featured_Teds_Pick', 'featured_StickFigures', 'Podcast_Link', 'slug'] : ['slug'];

  return <Layout><div className={styles.page}>
    <PageTitle1 subtitle={brand || `${isCigar ? 'Cigar' : 'Tobacco'} product`}>{name}</PageTitle1>
    <div className={styles.workspace}>
      <nav className={styles.actions} aria-label="Product actions">
        <Link href={`/${route}`}><a className={styles.back}><PiArrowLeftBold aria-hidden="true" /> Back to catalog</a></Link>
        <div><Link href={`/${route}/${record.slug}/edit`}><a className={styles.edit}><PiNotePencilBold aria-hidden="true" /> Edit product</a></Link><Link href={`/${route}/${record.slug}/delete`}><a className={styles.delete}><PiTrashBold aria-hidden="true" /> Delete</a></Link></div>
      </nav>

      <div className={styles.primaryGrid}>
        <section className={styles.section} aria-labelledby="details-heading">
          <header><h2 id="details-heading">Product details</h2><span>{isCigar ? 'Cigar' : 'Pipe tobacco'}</span></header>
          {product.description ? <p className={styles.description}>{product.description}</p> : <p className={`${styles.description} ${styles.empty}`}>No description has been added.</p>}
          <DetailList fields={detailFields} product={product} />
        </section>
        <aside className={styles.imagePanel}>
          <h2>Product image</h2>
          {product.image ? <img src={product.image} alt={`${brand || ''} ${name}`.trim()} /> : <div className={styles.imagePlaceholder}>No image available</div>}
        </aside>
      </div>

      {isCigar ? <Sizes sizes={product.Sizes} /> : <Components components={product.Components} />}

      <section className={styles.section} aria-labelledby="admin-heading"><header><h2 id="admin-heading">Administration</h2></header><DetailList fields={adminFields} product={product} /></section>
      <details className={styles.technical}><summary>Technical details</summary><pre>{JSON.stringify(product, null, 2)}</pre></details>
    </div>
  </div></Layout>;
}
