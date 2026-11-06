
import { useEffect } from 'react'
import Link from 'next/link'

const Ksman = () => {

    useEffect(() => {
        // Add cursor pointer for better UX
        const element = document.querySelector('.cigar-page-image1');
        if (element) {
          element.style.cursor = 'pointer';
        }
      }, []);

    return (
        <>
        <div className="cigar-page-container13">
            <Link href="/">
                    <a tabIndex={0} aria-label='Go to Homepage'>
                      <img
                          alt="image"
                          src="/ksmantransparentbw-1500h.png"
                          className="cigar-page-image1"
                      />
                    </a>
            </Link>
        </div>
        <style jsx>{`
        .cigar-page-container13 {
            flex: 1 0 auto;
            display: flex;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary1);
            align-items: center;
        }
        .cigar-page-image1 {
            width: 90px;
            padding: 0.5em;
            aspect-ratio: 1;
            object-fit: cover;
          }
        `}</style>
        </>
    )
}

export default Ksman