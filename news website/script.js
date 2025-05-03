const API_KEY = "pub_84178ef4abffc256eff7ea70f042e4819ca67";
const BASE_URL = "https://newsdata.io/api/1/news";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}&country=in`);
    const data = await res.json();
    if (data.results) {
      bindData(data.results);
    } else {
      console.error("No results found:", data);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.image_url) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.image_url || "https://placehold.co/400x200";
  newsTitle.innerHTML = article.title || "No Title Available";
  newsDesc.innerHTML = article.description || "No description available.";

  const date = new Date(article.pubDate).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
  });

  newsSource.innerHTML = `${article.source_id || "Unknown Source"} · ${date}`;
}

let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
