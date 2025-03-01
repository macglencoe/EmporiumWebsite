# King Street Emporium Website
This project is a website for the cigar lounge, [The King Street Emporium](https://maps.app.goo.gl/qeLvCgUimEyXBjwy9), in **Martinsburg, WV**.

Serving as an online catalog, this website provides patrons and prospective customers with up-to-date information on available products, store info, and community events while ensuring accessibility and ease of use.


[![wakatime](https://wakatime.com/badge/user/f2f0ec8a-184f-40d7-89ff-dcb3f8dd8e21/project/15c4a501-6e1a-462a-b755-3d8625578979.svg)](https://wakatime.com/badge/user/f2f0ec8a-184f-40d7-89ff-dcb3f8dd8e21/project/15c4a501-6e1a-462a-b755-3d8625578979)

## Description

### Catalog
This website will primarily be used as an online catalog, allowing patrons to find informationa about products that are available in-store. This includes cigars, tobacco pipes, pipe tobacco, coffee, and tea. The catalog is updated semi-regularly by staff.

### Store Profile
Secondarily, this website will provide basic, important information about the lounge itself. Operating hours, location, and contact information is easily available and up-to-date. Additionally, the business Facebook page is embedded on the home page, allowing users to see important updates such as store closing, upcoming events, and new arrivals

### Ease of use
Finally, the website will be straightforward and accessible. The intended audience for this website is not tech-savvy, so the website cannot be too complex. Elements are in predictable places, with bold easy-to-read fonts. Additionally, important navigation elements are easily accessible.

## Hosting
The site is hosted at www.kingstreetemporium.com, through [Vercel](https://www.vercel.com).

## Technology Stack
- This website is made with the [Next.js](https://nextjs.org) React framework, mostly for the routing, although many of its features come in handy.
- For the time being, the data is static, and updated periodically. This is the best option for the needs of this website.

## <\\> Code Showcase </>

[`directory.js`](components/directory.js)

The following demonstrates the styling for the top navigation items, using JSX to conditionally change the class of the element based on the current page, and a fancy animated gradient background upon hover

``` javaScript
<Link href={props.href}>
	<a tabIndex={0} className={router.pathname == props.href ? "active-page" : ""}>
		<div>
			<span>{props.children}</span>
			<div className='background-gradient'></div>
		</div>
	</a>
</Link>
```

``` css
a > div {
	position: relative;
	display: flex;
	padding: 0.5em;
	align-items: center;
	justify-content: center;
	width: 100%;
	overflow: hidden;
}
a .background-gradient {
	position: absolute;
	width: 100%;
	height: 100%;
	transform: translateY(100%);
	background-image: var(--directory-gradient);
	transition: 0.3s ease-in;
}
a {
	width: 100%;
}
a:hover span, a:focus span {
	text-decoration: var(--dl-color-theme-primary1) underline;
}
a:hover .background-gradient, a:focus .background-gradient {
	transform: translateY(0);
}
a.active-page span {
		color: var(--dl-color-theme-primary1);
}
```

