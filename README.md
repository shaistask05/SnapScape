# SnapScape

SnapScape is a visual discovery app where people can search a topic and explore a responsive wall of images. Its warm sand, terracotta, and deep-green palette gives the app a calm editorial feel. The large serif headline makes the page feel like a visual magazine, while quick-pick topic chips make it easy to start exploring.

## Part 2: Fetch and render

- Submitting the search form (with Enter or the Explore button) prevents a page reload and reads the search term.
- The app requests up to 12 matching files from the Wikimedia Commons API.
- It checks the response, parses the JSON, clears previous cards, and renders each image with a caption.
- The result count shows how many images were found.
- Quick-pick chips launch searches, and clicking an image opens its Commons page in a new tab.

## Run locally

Open `index.html` in a browser. No framework, build tool, or API key is required.
