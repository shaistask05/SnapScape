// SnapScape Part 3: loading, empty, and error states.

const form = document.getElementById("search-form");
const input = document.getElementById("topic-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const searchButton = document.getElementById("search-button");
const statusMessage = document.getElementById("status-message");

async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("The image service returned an error (" + response.status + ").");
  }

  const data = await response.json();
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages).filter((item) =>
    item.imageinfo && item.imageinfo[0] && (item.imageinfo[0].thumburl || item.imageinfo[0].url)
  );
}

function showLoading() {
  results.innerHTML = "";
  emptyState.hidden = true;
  resultCount.textContent = "Searching…";
  statusMessage.dataset.state = "loading";
  statusMessage.innerHTML = '<span class="spinner" aria-hidden="true"></span>Searching for images…';
  for (let i = 0; i < 6; i += 1) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";
    skeleton.setAttribute("aria-hidden", "true");
    skeleton.innerHTML = '<div class="skeleton-image"></div><div class="skeleton-caption"></div>';
    results.appendChild(skeleton);
  }
}

function showEmpty(query) {
  results.innerHTML = "";
  resultCount.textContent = "0 images found";
  statusMessage.dataset.state = "empty";
  statusMessage.textContent = "No results for “" + query + "”. Try another search.";
  emptyState.hidden = false;
  emptyState.querySelector("h3").textContent = "No images found this time.";
  emptyState.querySelector("p").textContent = "Try another word or a broader topic.";
}

function showError() {
  results.innerHTML = "";
  resultCount.textContent = "Search unavailable";
  statusMessage.dataset.state = "error";
  statusMessage.textContent = "Something went wrong. Please check your connection and try again.";
  emptyState.hidden = false;
  emptyState.querySelector("h3").textContent = "We couldn't load those images.";
  emptyState.querySelector("p").textContent = "Your search is safe. Please try again in a moment.";
}

function renderImages(items, query) {
  results.innerHTML = "";
  emptyState.hidden = true;
  resultCount.textContent = "Showing " + items.length + ' images for "' + query + '"';
  statusMessage.dataset.state = "success";
  statusMessage.textContent = "Your image collection is ready.";

  items.forEach((item) => {
    const imageInfo = item.imageinfo[0];
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

async function runSearch(query) {
  searchButton.disabled = true;
  searchButton.textContent = "Searching…";
  showLoading();

  try {
    const items = await searchImages(query);
    if (items.length === 0) {
      showEmpty(query);
    } else {
      renderImages(items, query);
    }
  } catch (error) {
    console.error("SnapScape search error:", error);
    showError();
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Explore <span aria-hidden="true">↗</span>';
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    statusMessage.dataset.state = "error";
    statusMessage.textContent = "Please enter a topic before searching.";
    input.focus();
    return;
  }
  runSearch(query);
});

// Quick-pick chips use the same search flow.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    form.requestSubmit();
  });
});
