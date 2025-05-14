import Link from 'next/link'
import styles from './footer.module.css'
export const Footer = () => {
    return (
            <footer className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <img src='/ksmantransparentbw-1500h.png' alt='King Street Emporium Logo'/>
                        <span className={styles.brandName}>The King Street Emporium</span>
                        <div className={styles.socials}>
                        <Link href="https://www.facebook.com/p/King-Street-Coffee-Tobacco-Emporium-100063496593967/">
                <a aria-label='Facebook Page' tabIndex={0}>
                  <svg
                    viewBox="0 0 877.7142857142857 1024"
                    className="thq-icon-small"
                  >
                    <path d="M713.143 73.143c90.857 0 164.571 73.714 164.571 164.571v548.571c0 90.857-73.714 164.571-164.571 164.571h-107.429v-340h113.714l17.143-132.571h-130.857v-84.571c0-38.286 10.286-64 65.714-64l69.714-0.571v-118.286c-12-1.714-53.714-5.143-101.714-5.143-101.143 0-170.857 61.714-170.857 174.857v97.714h-114.286v132.571h114.286v340h-304c-90.857 0-164.571-73.714-164.571-164.571v-548.571c0-90.857 73.714-164.571 164.571-164.571h548.571z"></path></svg>

                </a>
              </Link>

              <Link href="https://www.instagram.com/kingstreetcigarwv/">
                <a aria-label='Instagram Page' tabIndex={0}>
                  <svg
                    viewBox="0 0 877.7142857142857 1024"
                    className="thq-icon-small"
                  >
                    <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path></svg>

                </a>
              </Link>
                        </div>
                    </div>
                    <div className={styles.list}>
                        <h2>Quick Links</h2>
                        <ul>
                            <li><a href='/'>Home</a></li>
                            <li><a href='/about'>About</a></li>
                            <li><a href='/contact'>Contact</a></li>
                        </ul>
                    </div>
                    <div className={styles.list}>
                        <h2>Products</h2>
                        <ul>
                            <li><a href='/cigars'>Cigars</a></li>
                            <li><a href='/pipes'>Pipes</a></li>
                            <li><a href='/caffeine'>Coffee & Tea</a></li>
                            <li><a href='/tobacco'>Tobacco</a></li>
                        </ul>
                    </div>
                    <div className={styles.contact}>
                        <h2>Contact</h2>
                        <a href='tel:304-264-9130' className={styles.phone}>304-264-9130</a>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p>&copy; 2025 King Street Coffee & Tobacco Emporium</p>
                </div>
            </footer>
    )
}