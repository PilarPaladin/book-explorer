# Book Explorer - React Discovery App

This is a single-page React application built to query the Open Library Search API. *(Note: Pages outside the core search experience are currently UI mockups).*

---

## 📌 Note: Submission Branch & Scope

**Why is this submitted on a separate branch?**
This simple exercise quickly turned into a passion project lol. I am submitting this specific branch as a frozen release that I believe, fully satisfies the assignment requirements before the scope expands any further.

My ultimate vision for this app is to immediately move away from the Open Library API, integrate user-driven data with cloud storage, and build a personal reading tracker. 

I chose to isolate this assignment on its own branch so I could learn and experiment with branch-based hosting on Vercel. This also leaves me freedom with my main branch, as I plan to refactor the entire codebase to TypeScript for better maintainability and scaling. Im deciding that javascript suffices for the assignment.

If you're curious, you may check [myarkived.app](https://myarkived.app) for what I meant lol. It's still a work in progress though.

---

## ✅ Exercise Requirements

1. Search Input

    I integrated it into my Header Component, the logic is in the SearchBar component.

    The input's value is basically locked to that state, and an onChange handler updates the memory every time a user types a letter because I linked that input element directly to a React state variable.

2. Fetch Results

    The network request is abstracted in its own file at 'src/services/api.js' and the visual output is handled by 'src/components/BookCard.jsx'.

    When a search is submitted, an asynchronous function that calls the Open Library API is triggered. Once the API returns the data, it is saved into a books state array. A React component then maps over that array, passing the specific title, author, year, and cover image down to individual BookCard components using props.

3. Loading State

    I manage it using a state variable in my main app file, it is visually represented by 'src/components/LoadingGrid.jsx'.

    I use an isLoading boolean state, the moment the API fetch is triggered, this state is set to true. I use conditional rendering (a ternary operator) to say: If isLoading is true, render the LoadingGrid (the gray skeleton cards); otherwise, render the actual book results.

4. Empty State

    Unlike the others I put the logic for this in the main file 'src/App.jsx'.   

    I basically just chained another conditional check after the loading state. If the API finishes fetching but the 'books.length === 0' (meaning no matches were found), it skips the grid entirely and renders a specific UI div containing the text "No books found."

5. Book Details

    I put the detailed view into its own dedicated overlay component at 'src/components/BookModal.jsx'.

    I created a selectedBook state variable so that everytime a user clicks on a specific BookCard, it updates that state with the book's data. Since selectedBook is no longer null, React conditionally renders the BookModal on top of the same page, passing all the extended data (like tags, editions, and synopsis) into the modal as props.

---

## 🎨 UI/UX & Design

The primary layout takes heavy inspiration from Letterboxd, with specific button styles and interactions drawing from IMDb, Pinterest, and the Letterboxd mobile app. The brand logo is entirely hand-drawn.

### Color Palette

| Category | Color | Hex Code |
| --- | --- | --- |
| **Main** | Red | `#990000` |
| **Main** | White | `#FFFFFF` |
| **Main** | Dark | `#374151` |
| **Main** | Gray | `#d1d5db` |
| **Secondary** | Gold | `#d4af37` |
| **Secondary** | Green | `#3a9d46` |
| **Secondary** | Blue | `#3f7dbe` |
