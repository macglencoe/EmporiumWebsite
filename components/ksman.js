
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
        <div className="cigar-page-container13" tabIndex={0}>
            <Link href="/">
                <img
                    alt="image"
                    src="/ksmantransparentbw-1500h.png"
                    className="cigar-page-image1"
                />
            </Link>
        </div>
        <style jsx>{`
        .cigar-page-container13 {
            flex: 0 0 auto;
            width: 99%;
            display: flex;
            align-items: flex-start;
            background-color: var(--dl-color-theme-secondary2);
        }
        .cigar-page-image1 {
            width: 100%;
            object-fit: cover;
          }
        `}</style>
        </>
    )
}

export default Ksman