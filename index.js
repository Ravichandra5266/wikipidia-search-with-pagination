const searchInputEl = document.getElementById("searchInput");
const displayresultsEl = document.getElementById("displayresults");
const spinnerEl = document.getElementById("spinner");

let currentPage = 1;
let limitPages = 5;
let totalPages = null;
let data = null;

function displayFetchData(eachData) {
  const { title, link, description } = eachData;

  const liEl = document.createElement("li");
  liEl.classList.add("each-data");

  const titleEl = document.createElement("h1");
  titleEl.textContent = title;
  titleEl.classList.add("heading");
  liEl.appendChild(titleEl);

  const linkEl = document.createElement("a");
  linkEl.href = link;
  linkEl.target = "_blank";
  linkEl.textContent = link;
  linkEl.classList.add("link");
  liEl.appendChild(linkEl);

  const paraEl = document.createElement("p");
  paraEl.textContent = description;
  paraEl.classList.add("para");
  liEl.appendChild(paraEl);

  displayresultsEl.appendChild(liEl);
}

function pagination() {
  totalPages = Math.ceil(data.length / limitPages);

  const divEl = document.createElement("div");
  divEl.classList.add("page-btn");

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.classList.add("prev");
  divEl.appendChild(prevBtn);
  prevBtn.addEventListener("click", function changeNxtPage() {
    if (currentPage > 1) {
      currentPage -= 1;
      displayresultsEl.textContent = "";

      displayData();
    }
  });

  const pageNo = document.createElement("p");
  pageNo.classList.add("pageno");
  pageNo.textContent = `${currentPage} - ${totalPages}`;
  divEl.appendChild(pageNo);

  const nxtBtn = document.createElement("button");
  nxtBtn.textContent = "Next";
  nxtBtn.classList.add("next");

  divEl.appendChild(nxtBtn);
  nxtBtn.addEventListener("click", function changeNxtPage() {
    if (currentPage < totalPages) {
      currentPage += 1;
      displayresultsEl.textContent = "";

      displayData();
    }
  });

  displayresultsEl.appendChild(divEl);
}

function displayData() {
  const startIndex = (currentPage - 1) * limitPages;
  const endIndex = startIndex + limitPages;
  const slicedData = data.slice(startIndex, endIndex);
  spinnerEl.classList.add("d-none");

  if (data.length > 0) {
    for (let each of slicedData) {
      displayFetchData(each);
    }
    pagination();
  } else {
    const emptyData = document.createElement("p");
    emptyData.textContent =
      "Search Results Are Not Found Pls Try Different Key Word";
    emptyData.classList.add("empty");
    displayresultsEl.appendChild(emptyData);
  }
}

function wikipediaSearch(event) {
  const searchInputValue = searchInputEl.value;

  if (searchInputValue === "" && event.key === "Enter") {
    alert("Please Enter Valid Search Input");
  } else if (event.key === "Enter") {
    displayresultsEl.textContent = "";
    currentPage = 1;
    const url = `https://apis.ccbp.in/wiki-search?search=${searchInputValue}`;
    const options = {
      method: "get",
    };
    spinnerEl.classList.remove("d-none");
    fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        let { search_results } = responseData;
        data = search_results;

        console.log(responseData);

        displayData();
      })
      .catch(() => {
        console.log("hello");
      });
  }
}

searchInputEl.addEventListener("keydown", wikipediaSearch);
