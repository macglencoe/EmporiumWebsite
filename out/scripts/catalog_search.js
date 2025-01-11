

// JSON data
const cigarData = [
    {
        Barcode: 7427030000000,
        In_Stock: "TRUE",
        "Cigar Brand": "Oliva",
        "Cigar Name": "Oliva Serie V",
        Size: "Toro",
        Price: "$9.50",
        Wrapper: "Sun-Grown Habano",
        Binder: "Nicaraguan",
        Filler: "Corojo,  Criollo",
        Flavor_Profile: "Nutty, Pepper, Spicy, Creamy",
        Strength_Profile: "Medium-Full",
        "Future Inventory": "",
        "Future Inventory 1": ""
    },
];

//let allCigarData = []; // To store fetched data for sorting and filtering

function createFilters() {
    
}

// Function to generate HTML for each cigar
function createCigarCard(cigar) {
    const card = document.createElement("div");
    card.className = "catalogCard";

    // Product Image
    const productImage = document.createElement("div");
    productImage.className = "catalog-product-image7";
    card.appendChild(productImage);

    // Product Name
    const nameContainer = document.createElement("div");
    nameContainer.className = "catalog-container65";
    const nameSpan = document.createElement("span");
    nameSpan.className = "catalog-text216";
    nameSpan.textContent = cigar["Cigar Brand"]+" "+cigar["Cigar Name"];
    nameContainer.appendChild(nameSpan);
    card.appendChild(nameContainer);

    // Strength
    if (cigar.Strength_Profile != "") {
        const strengthContainer = document.createElement("div");
        strengthContainer.className = "catalogCardField";
        const strengthLabel = document.createElement("span");
        strengthLabel.className = "catalogCardLabel";
        strengthLabel.innerHTML = "<span>Strength:</span><br />";
        const strengthValue = document.createElement("span");
        strengthValue.className = "catalogCardValue";
        strengthValue.innerHTML = `<span>${cigar.Strength_Profile}</span><br />`;
        strengthContainer.appendChild(strengthLabel);
        strengthContainer.appendChild(strengthValue);
        card.appendChild(strengthContainer);
    }

    // Wrapper
    if (cigar.Wrapper != "") {
        const wrapperContainer = document.createElement("div");
        wrapperContainer.className = "catalogCardField";
        const wrapperLabel = document.createElement("span");
        wrapperLabel.className = "catalogCardLabel";
        wrapperLabel.textContent = "Wrapper:";
        wrapperContainer.appendChild(wrapperLabel);
        const wrapperSpan = document.createElement("span");
        wrapperSpan.className = "catalogCardValue";
        wrapperSpan.textContent = cigar.Wrapper;
        wrapperContainer.appendChild(wrapperSpan);
        card.appendChild(wrapperContainer);
    }

    // Button
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "catalogCardButton";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-button7 button";
    if (cigar.Sizes.length > 1) {
        button.textContent = cigar.Sizes.length+" Sizes Available";
    } else if (cigar.Sizes.length < 1) {
        button.textContent = "Size Unavailable"
    } else
    {
        if (cigar.Sizes[0] != "") {
            button.textContent = cigar.Sizes[0];
        } else button.textContent = "Size Unvailable"

    }
    
    const buttonButt = document.createElement("div");
    buttonButt.className = "cigarButtonButt";
    buttonContainer.appendChild(buttonButt);
    buttonContainer.appendChild(button);
    const buttonAsh = document.createElement("div");
    buttonAsh.className = "cigarButtonAsh";
    buttonContainer.appendChild(buttonAsh);
    card.appendChild(buttonContainer);

    return card;
}

// Function to populate the catalog
function populateCatalog(data) {
    const catalog = document.querySelector("#catalog"); // Assuming there's a container with ID 'catalog'
    catalog.innerHTML = ""; // Clear existing cards
    data.forEach(cigar => {
        const cigarCard = createCigarCard(cigar);
        catalog.appendChild(cigarCard);
    });
}

// Fetch JSON data from a file
/* function fetchCigarData() {
    fetch("/data/consolidated_cigars.json") // Replace 'data.json' with the path to your JSON file
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch JSON data");
        }
        return response.json();
      })
      .then(data => {
        allCigarData = data; // Store data for sorting and filtering
        populateCatalog(allCigarData); // Initial population
      })
      .catch(error => {
        console.error("Error loading JSON:", error);
      });
  } */

  // Sort function
function sortCatalog(criteria, data) {
    const sortedData = [...data];
    
    if (criteria === "Alphabetical") {
        sortedData.sort((a,b) => {
            if(a["Cigar Brand"] + a["Cigar Name"] > b["Cigar Brand"] + b["Cigar Name"]) {return 1}
            else return -1
        })
        return sortedData;
    }

    if (criteria === "Size") {
        sortedData.sort((a,b) => {
            if(a["Sizes"][0] > b["Sizes"][0]) {return 1}
            else return -1
        })
    }

    return sortedData;
  }
  
// Filter function
function filterCatalog(filterKey, filterValue, data) {
    const filteredData = [...data]
    filteredData.filter(cigar => cigar[filterKey] === filterValue);
    filteredData.filter(cigar )
    //populateCatalog(filteredData);
}

let sortCriteria = "Alphabetical";
let filters = {
    "Cigar Brand": "Arturo Fuente.",
    "Sizes":[
        "Toro"
    ]
};

function searchCatalog() {
    let searchData = sortCatalog(sortCriteria, allCigarData);
    let excludedFilters = {...filters};
    delete excludedFilters.Sizes;
   searchData =  searchData.filter(function(item) {
    for (var key in excludedFilters) {
        if (item[key] === undefined || item[key] != excludedFilters[key])
            return false;
        }
        return true;
   })

   if ("Sizes" in filters) {
   searchData = searchData.filter(function(item) {
    for(var key in filters.Sizes) {
        if (item.Sizes[key] === undefined || item.Sizes[key] != filters.Sizes[key])
            return false;
        }
        return true;
   })}
   
    

   console.debug(searchData);
   return searchData;
}

// Fetch JSON and populate the catalog
document.addEventListener("DOMContentLoaded", () => {
    //fetchCigarData();
    populateCatalog(allCigarData);
    //searchCatalog();
});

document.addEventListener("input", () => {
    sortCriteria = document.getElementById("sort-select").value;
    //populateCatalog(allCigarData);
    populateCatalog(searchCatalog());
});