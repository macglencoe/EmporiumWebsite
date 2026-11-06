import Head from 'next/head';
import Link from 'next/link';
import {
  PiArrowRightBold,
  PiCheckCircleFill,
  PiDatabaseBold,
  PiEnvelopeSimpleBold,
  PiExportBold,
  PiInfoBold,
  PiPhoneBold,
  PiWarningCircleFill,
} from 'react-icons/pi';

import Layout from '../components/layout';
import PageTitle1 from '../components/pagetitle1';
import styles from './help.module.css';

const StepList = ({ children }) => <ol className={styles.steps}>{children}</ol>;

export default function HelpPage() {
  return (
    <Layout>
      <Head>
        <title>Help & Documentation | King Street Emporium Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className={styles.helpPage}>
        <PageTitle1 subtitle="Instructions for managing and publishing the store catalog">
          Help & Documentation
        </PageTitle1>

        <main className={styles.content}>
          <section className={styles.welcome} aria-labelledby="welcome-heading">
            <div>
              <span className={styles.eyebrow}>Start here</span>
              <h2 id="welcome-heading">The three things to remember</h2>
              <p>
                Work in the admin site, save your work as a draft, and publish only after reviewing it.
                Customers cannot see a draft until it is published.
              </p>
            </div>
            <div className={styles.reminders}>
              <div><strong>1</strong><span>Make the change</span></div>
              <PiArrowRightBold aria-hidden="true" />
              <div><strong>2</strong><span>Save the draft</span></div>
              <PiArrowRightBold aria-hidden="true" />
              <div><strong>3</strong><span>Review and publish</span></div>
            </div>
          </section>

          <nav className={styles.contents} aria-label="Help page contents">
            <strong>On this page</strong>
            <div>
              <a href="#quick-reference">Quick reference</a>
              <a href="#sign-in">Signing in</a>
              <a href="#find-products">Finding products</a>
              <a href="#edit-products">Adding and editing</a>
              <a href="#images">Product images</a>
              <a href="#visibility">Hiding and deleting</a>
              <a href="#publish">Publishing</a>
              <a href="#troubleshooting">Troubleshooting</a>
              <a href="#exports">Data exports</a>
              <a href="#new-system">What changed</a>
              <a href="#support">Contact Liam</a>
            </div>
          </nav>

          <section id="quick-reference" className={styles.section}>
            <header><span>Everyday use</span><h2>Quick reference</h2></header>
            <div className={styles.cardGrid}>
              <article><h3>Add a cigar</h3><p>Choose <b>Add New Cigar</b>, complete the form, and select <b>Save draft</b>.</p><Link href="/cigars/add"><a>Open form <PiArrowRightBold /></a></Link></article>
              <article><h3>Edit a product</h3><p>Open Cigars or Pipe Tobacco, choose the product, then select <b>Edit product</b>.</p></article>
              <article><h3>Check a price</h3><p>Choose <b>Price Lookup</b>, click the search box, and scan or enter the barcode.</p><Link href="/cigars/barcodeSearch"><a>Open price lookup <PiArrowRightBold /></a></Link></article>
              <article><h3>Publish work</h3><p>Choose <b>Manage Changes</b>, review every change, add a short note, and publish.</p><Link href="/submit"><a>Manage changes <PiArrowRightBold /></a></Link></article>
            </div>
            <div className={styles.note}><PiInfoBold aria-hidden="true" /><p><strong>Drafts are shared.</strong> A draft saved on the store tablet can also be reviewed from another signed-in device. Before publishing, check whether someone else has added work to the same draft.</p></div>
          </section>

          <section id="sign-in" className={styles.section}>
            <header><span>Access</span><h2>Signing in and out</h2></header>
            <div className={styles.prose}>
              <p>Go to <a href="https://admin.kingstreetemporium.com">admin.kingstreetemporium.com</a>. The username is always <b>store-admin</b>. Approved staff share the store password; ask the owner where it is kept.</p>
              <p>Do not photograph, text, email, or reuse the password on another account. Select <b>Log out</b> when using a device that is not the designated store tablet.</p>
              <div className={styles.warning}><PiWarningCircleFill aria-hidden="true" /><p>Five incorrect attempts temporarily lock sign-in for 15 minutes. Wait for the lock to expire rather than continuing to guess. If the password is lost or a signed-in device is missing, contact Liam.</p></div>
            </div>
          </section>

          <section id="find-products" className={styles.section}>
            <header><span>Catalog</span><h2>Finding products and checking prices</h2></header>
            <div className={styles.twoColumns}>
              <div>
                <h3>Browse the catalog</h3>
                <StepList>
                  <li>Choose <b>Cigars</b> or <b>Pipe Tobacco</b>.</li>
                  <li>Use the search box, filters, or sorting controls to narrow the list.</li>
                  <li>Select a product to see its details, sizes, prices, stock status, and barcode information.</li>
                </StepList>
              </div>
              <div>
                <h3>Use Price Lookup</h3>
                <StepList>
                  <li>Choose <b>Price Lookup</b> from the side menu.</li>
                  <li>Click inside the search box, then scan the cigar barcode. You can also type the number.</li>
                  <li>Check the matching size, price, and stock information.</li>
                </StepList>
              </div>
            </div>
          </section>

          <section id="edit-products" className={styles.section}>
            <header><span>Product changes</span><h2>Adding and editing products</h2></header>
            <div className={styles.twoColumns}>
              <div>
                <h3>Add a product</h3>
                <StepList>
                  <li>Choose <b>Add New Cigar</b>, or open Pipe Tobacco and choose its add option.</li>
                  <li>Complete each section of the form. Fields marked with an asterisk are required.</li>
                  <li>For cigars, add each sold size with its price, stock setting, and barcode.</li>
                  <li>Check the proposed page address shown near the form.</li>
                  <li>Select <b>Save draft</b>. This does not make the product public yet.</li>
                </StepList>
              </div>
              <div>
                <h3>Edit a product</h3>
                <StepList>
                  <li>Find and open the existing product.</li>
                  <li>Select <b>Edit product</b>.</li>
                  <li>Change only the necessary fields.</li>
                  <li>Select <b>Save draft</b>, then review the before-and-after values on Manage Changes.</li>
                </StepList>
              </div>
            </div>
            <div className={styles.note}><PiCheckCircleFill aria-hidden="true" /><p>If the page says a field needs attention, return to that field and correct it before saving. If the proposed page address is already in use, check the product name or ask Liam for help.</p></div>
          </section>

          <section id="images" className={styles.section}>
            <header><span>Product changes</span><h2>Uploading or replacing an image</h2></header>
            <div className={styles.prose}>
              <StepList>
                <li>Open the product editor and go to the image section.</li>
                <li>Choose a JPEG, PNG, WebP, or GIF image no larger than 5 MB.</li>
                <li>Select <b>Upload image</b> or <b>Replace image</b> and wait for the upload to finish.</li>
                <li>Save the product draft, review the image change, and publish it with the other changes.</li>
              </StepList>
              <p>If an upload fails, the currently published image stays in place. Replacing or removing an image is not visible to customers until the draft publishes successfully.</p>
            </div>
          </section>

          <section id="visibility" className={styles.section}>
            <header><span>Product changes</span><h2>Hiding and deleting products</h2></header>
            <div className={styles.compare}>
              <article><h3>Hide</h3><p>Use this when a product should temporarily disappear from the customer website but may return later. Its information remains in the catalog.</p></article>
              <article className={styles.dangerCard}><h3>Delete</h3><p>Use this only when the product record should be permanently removed. The deletion remains reversible until the draft is published.</p></article>
            </div>
            <p className={styles.sectionCopy}>Both actions must be saved as a draft and published before customers see the result. Read the confirmation carefully and verify the product name before staging a deletion.</p>
          </section>

          <section id="publish" className={styles.section}>
            <header><span>Most important</span><h2>Reviewing and publishing changes</h2></header>
            <div className={styles.prose}>
              <StepList>
                <li>Choose <b>Manage Changes</b>. Check the total number of new, updated, and deleted products.</li>
                <li>Review every card. Updated products show the value before the edit and the value after it.</li>
                <li>If one item is wrong, select <b>Remove from draft</b>. To abandon everything, select <b>Discard entire draft</b>.</li>
                <li>Enter a short publication note, such as “Updated October cigar prices.”</li>
                <li>Select <b>Publish changes</b> and confirm. All reviewed changes publish together.</li>
                <li>Wait for the success message, then check the public website.</li>
              </StepList>
              <div className={styles.warning}><PiWarningCircleFill aria-hidden="true" /><p><strong>Always review the entire draft.</strong> Because drafts are shared, it may contain work saved by another employee.</p></div>
            </div>
          </section>

          <section id="troubleshooting" className={styles.section}>
            <header><span>When something goes wrong</span><h2>Troubleshooting</h2></header>
            <div className={styles.faq}>
              <details open><summary>Publication stopped because of a conflict</summary><div><p>This usually means the product changed after the draft was started.</p><ol><li>Write down the product named in the conflict.</li><li>Remove that product from the draft.</li><li>Open the current product again and repeat the edit using its newest information.</li><li>Return to Manage Changes and try publishing again.</li></ol><p>If the conflict returns or the correct choice is unclear, contact Liam before discarding other work.</p></div></details>
              <details><summary>The change published, but the public site still looks old</summary><div><p>Refresh the public page once and wait a few minutes. The database may already contain the new information while the public page finishes refreshing. If it is still wrong after five minutes, contact Liam. Do not repeat the edit.</p></div></details>
              <details><summary>An image upload failed</summary><div><p>The old public image should still be safe. Confirm that the file is JPEG, PNG, WebP, or GIF and is under 5 MB, then try once more. Contact Liam if it fails again.</p></div></details>
              <details><summary>I saved the wrong information</summary><div><p>If it has not been published, remove that item from the draft and redo it. If it has already been published, edit the product again to correct it, then publish the correction.</p></div></details>
              <details><summary>I cannot sign in</summary><div><p>Check the shared password carefully. After several failed attempts, stop and wait 15 minutes. Contact Liam if the password is missing, the lockout continues, or a store device has been lost.</p></div></details>
            </div>
          </section>

          <section id="exports" className={styles.section}>
            <header><span>Backup maintainers only</span><h2>Exporting catalog data</h2></header>
            <div className={styles.maintainer}>
              <PiExportBold aria-hidden="true" />
              <div>
                <StepList>
                  <li>Choose <b>Export Data</b> from the side menu.</li>
                  <li>Select Cigars or Pipe Tobacco.</li>
                  <li>Use <b>Download CSV</b> for spreadsheet work.</li>
                  <li>Use <b>Download backup JSON</b> for a complete recovery copy.</li>
                  <li>Confirm the file downloaded, then store it in the agreed backup location with its original dated filename.</li>
                </StepList>
              </div>
            </div>
            <div className={styles.technicalLink}><div><strong>Need terminal commands?</strong><p>The password, database, import, export, test, and deployment-support commands are documented separately for Liam.</p></div><Link href="/help/technical"><a>Open technical reference <PiArrowRightBold /></a></Link></div>
          </section>

          <section id="new-system" className={styles.section}>
            <header><span>Background</span><h2>What changed about the system</h2></header>
            <div className={styles.systemGrid}>
              <article><PiDatabaseBold aria-hidden="true" /><h3>The Database</h3><p>The catalog and shared drafts now live in a database instead of being saved as website data files or only inside one browser.</p></article>
              <article><span className={styles.wordIcon}>V</span><h3>Vercel</h3><p>The public site and admin site are separate Vercel projects on different addresses, while both are maintained together from the same codebase.</p></article>
              <article><span className={styles.wordIcon}>{'</>'}</span><h3>The Codebase</h3><p>The public and admin applications used to live on separate branches. They are now organized together, making future maintenance safer and more consistent.</p></article>
            </div>
            <div className={styles.beforeAfter}>
              <div><span>Previously</span><p>Drafts stayed in one browser. Publishing changed catalog files through GitHub and waited for a website deployment. Admin access also depended on Vercel authentication.</p></div>
              <PiArrowRightBold aria-hidden="true" />
              <div><span>Now</span><p>Drafts are shared in the database. The admin has its own sign-in, and publishing updates the catalog directly without requiring a normal full-site deployment.</p></div>
            </div>
          </section>

          <section id="support" className={styles.support}>
            <div><span className={styles.eyebrow}>Support</span><h2>Contact Liam McDonald</h2><p>Try the relevant troubleshooting steps first. If the problem continues, if information may have been lost, or if a device is missing, contact Liam.</p></div>
            <div className={styles.supportLinks}>
              <a href="tel:+13042406828"><PiPhoneBold aria-hidden="true" /><span><small>Call or text</small>(304) 240-6828</span></a>
              <a href="mailto:me@macglencoe.com"><PiEnvelopeSimpleBold aria-hidden="true" /><span><small>Email</small>me@macglencoe.com</span></a>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
