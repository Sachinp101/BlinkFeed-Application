document.getElementById("ann").addEventListener("click", () => {
  fetchNews("https://consumet8.vercel.app/news/ann/recent-feeds", "ann");
});

document.getElementById("inshorts").addEventListener("click", () => {
  fetchNews("https://inshorts.vercel.app/news/top?offset=0&limit=10", "inshorts");
});

document.getElementById("searchButton").addEventListener("click", function () {
  const query = document.getElementById("searchBar").value;
  fetchNews(`https://inshorts.vercel.app/news/search?query=${query}&offset=0&limit=10`, "newsapi");
});

function fetchNews(url, source) {
  const newsFeed = document.getElementById("newsFeed");
  newsFeed.innerHTML = "";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let articles = [];

      if (source === "inshorts" || source === "newsapi") {
        articles = data.data.articles;
      } else {
        articles = data;
      }

      articles.forEach((item) => {
        const newsDiv = document.createElement("div");
        newsDiv.className = "col mb-4";

        const card = document.createElement("div");
        card.className = "card h-100";

        const thumbnail = document.createElement("img");
        let imgSrc = (source === "ann") ? item.thumbnail : item.imageUrl;
        thumbnail.src = imgSrc || "https://www.afidium.com/wp-content/themes/evolve/library/media/images/no-thumbnail.jpg";
        thumbnail.className = "card-img-top";
        thumbnail.loading = "lazy";
        card.appendChild(thumbnail);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.textContent = item.title;
        title.className = "card-title";
        cardBody.appendChild(title);

        const preview = document.createElement("p");
        preview.textContent = source === "ann" ? `Preview: ${item.preview.intro}` : `Preview: ${item.subtitle}`;
        preview.className = "card-text";
        cardBody.appendChild(preview);

        const btn = document.createElement("button");
        btn.textContent = "Read Full Preview";
        btn.className = "btn btn-primary";
        btn.setAttribute("data-toggle", "modal");
        btn.setAttribute("data-target", "#previewModal");
        btn.onclick = function () {
          if (source === "ann") {
            document.getElementById("modalBody").innerText = item.preview.full;
            document.getElementById("modalReadMore").href = item.url;
          } else {
            document.getElementById("modalBody").innerText = item.content;
            document.getElementById("modalReadMore").href = item.sourceUrl;
          }
        };

        cardBody.appendChild(btn);
        card.appendChild(cardBody);
        newsDiv.appendChild(card);
        newsFeed.appendChild(newsDiv);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Load default news
fetchNews("https://inshorts.vercel.app/news/top?offset=0&limit=10", "inshorts");
