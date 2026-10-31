// SnapScape Part 2: search Wikimedia Commons and render image cards.

const form = document.getElementById("search-form");
const input = document.getElementById("topic-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const searchButton = document.getElementById("search-button");

async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image search failed. Please try again.");
  }

  const data = await response.json();
  return data.query ? Object.values(data.query.pages) : [];
}

function renderImages(items, query) {
  results.innerHTML = "";

  if (items.length === 0) {
    resultCount.textContent = 'No images found for "' + query + '"';
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = "No images found this time.";
    emptyState.querySelector("p").textContent = "Try another word or a broader topic.";
    return;
  }

  emptyState.hidden = true;
  resultCount.textContent = "Showing " + items.length + ' images for "' + query + '"';

  items.forEach((item) => {
    const imageInfo = item.imageinfo && item.imageinfo[0];
    if (!imageInfo) return;

    const card = document.createElement("article");
    card.className = "image-card";

    const link = document.createElement("a");
    link.className = "image-link";
    link.href = imageInfo.descriptionurl || imageInfo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Open full image: " + item.title);

    const img = document.createElement("img");
    img.src = imageInfo.thumburl || imageInfo.url;
    img.alt = item.title.replace(/^File:/, "").replace(/\.[^.]+$/, "");
    img.loading = "lazy";

    const caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = item.title.replace(/^File:/, "").replace(/_/g, " ");

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(caption);
    results.appendChild(card);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  searchButton.disabled = true;
  searchButton.textContent = "Searching…";
  resultCount.textContent = "Finding images…";

  try {
    const items = await searchImages(query);
    renderImages(items, query);
  } catch (error) {
    resultCount.textContent = error.message;
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Explore <span aria-hidden="true">↗</span>';
  }
});

// Quick-pick chips run the same search as the form.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    form.requestSubmit();
  });
});
