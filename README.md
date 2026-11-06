# SnapScape

SnapScape is a visual discovery app where people can search a topic and explore a responsive wall of images. Its warm sand, terracotta, and deep-green palette gives the app a calm editorial feel.

## Features

- Searches Wikimedia Commons for up to 12 images.
- Shows a loading message, spinner, and skeleton cards while fetching.
- Shows a friendly empty state when a search has no results.
- Catches network/API errors and displays a helpful error message.
- Displays a result count and animated image cards.
- Includes quick-pick topic chips and a responsive layout.
- Built with plain HTML, CSS, and JavaScript. No framework or API key is required.

## Run locally

Open `index.html` in a browser, enter a topic, and press Explore.

## Deploy

This project is a static website and can be hosted with GitHub Pages, Netlify, or Vercel.

For GitHub Pages:
1. Open the repository Settings.
2. Select Pages.
3. Under Build and deployment, choose Deploy from a branch.
4. Select the `main` branch and `/(root)`, then Save.
5. After the Part 3 pull request is reviewed and merged into `main`, the public site will be available at:
   https://shaistask05.github.io/SnapScape/

## Part 3 testing checklist

- Search a normal topic such as Nature and confirm images appear.
- Search a nonsense word such as zxqwlk and confirm the no-results message appears.
- Temporarily go offline or use an invalid API endpoint to confirm the friendly error state.
- Use browser DevTools network throttling to see the loading spinner and skeleton cards.
