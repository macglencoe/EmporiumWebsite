# King Street Emporium Website
This project is a website for the cigar lounge, The King Street Emporium, in Martinsburg, WV. Its purpose is to provide basic information about the store, as well as the products.

## Features
- **Dynamic Catalogs**:
	- Includes catalogs for cigars, pipes, tobacco, coffee, tea, and accessories.
	- Basic search engine with sorting, filters, and a manual search bar.
- **Sidebar**:
	- Displays the current weekday, with closed days darkened out.
	- Shows store hours (10am-6pm) and current time.
	- Indicates "Open Now" or "Closed" based on the current time.
	- Embedded Facebook page of the store.
## Hosting
The site will be hosted at www.kingstreetemporium.com. No installation is needed.

## Usage Instructions
- **Navigation**: Use the navigation bar at the top to access any of the four catalogs.
- **Homepage**: The homepage includes "Search By" suggestions. Clicking on them will take you to a list of options for the selected filter. Clicking on an option will take you to the cigar catalog with that filter activated.
- **Catalogs**: In the catalog, there are drop-down menus for activating and deactivating filters. Next to the filters, there is a "Sort By" drop-down and a search bar. Clicking on any of the results will take you to that product's info page.

## Technology Stack
- This website is made with the [Next.js](https://nextjs.org) React framework, mostly for the routing, although many of its features come in handy.
- For the time being, the data is static, and updated periodically. This is the best option for the needs of this website.
- [+] *In the future (after initial release), [Sanity](https://www.sanity.io) will be integrated to allow for the site to be more independent.*

## Project Structure
**This project follows the structure of any Nextjs project**
- `/components`:
This is where various components used throughout the site are defined, making things much easier through *modularization*
- `/node_modules`
All external modules necessary to make this project happen may be found here
- `/pages`:
This contains the structure of the website as it appears on the browser.
- `/project`:
Some miscellaneous files for the dev to keep track of what they're doing. Don't look at this, they hardly use it.
- `/public`:
This is where static files are stored, including pictures and data
	- `/data`:
	As the name suggests, this is where the .json files for the catalogs can be found.
	- `/scripts`:
	Mostly deprecated miscellaneous scripts. [+] *Will definitely clean these up at some point*
   
