# DND-CAD

## What is DND-CAD?

DND-CAD stands for Dungeons and Dragons Character-a-Day. It started back during quarantine (ages ago) when I was trying to go "screen free" most of the day. I ended up making a **lot** Of D&D characters. It turned into doing at least one every day. Then it turned into a goal to make a character using every race and class combo in the Player's Handbook. That's 116 characters, and I lost momentum at around 90, but I figured I needed some kind of way to review what I have. So here we are.

DND-CAD was [built in Vite](https://vite.dev/) using the react-ts template -- so it's strictly typed with TypeScript. [It uses Firebase for authentication and data](https://firebase.google.com/).

## Make it work

Using your own firebase account, fill out the information in `src/utils/firebase.config.example.js` and rename the file to `src/utils/firebase.config.js`. This will make the authentication and database connection work.

Run `npm i` in the root, then start the app with `npm run dev`

## Features

Currently, there are two features.

### The Summary

When logged in (any user, the GET call is currently hardcoded to retrieve everything in the database that belongs to 'eje'), the home page shows the table of all characters belonging to that user. The table is sortable and filterable.

**How To See This In Action:** You're going to need some data. I have a way to do this. `dndcadjson.js` is a large chunk of data extracted from the PDFs I used, you can use the code `char-data.js` to format this data for forward compatibility with future features of DND-CAD. Put the formatted data into a Firestore collection called `characters` in the Firebase account you used in the firebase.config.

### Stat generating

The generation link creates a set of stats and proposes a random race/class combination.

## Future Features

This is just the start. My next step is unit tests for existing code, now that I have a minimum viable product. But I also have the following major features planned:

- Enter new characters through a form in the app
- Fix the default summary to pull characters owned by the current user
- An option to limit suggested race/class combinations to ones that dosn't exist in the user's existing list
- Detail view of the entire character (like a character sheet, but I doubt I will have it formatted in a way most people will find it a satisfactory replacement for their favored existing sheet format)
- Edit/delete existing characters
- Hide characters from other users

## I found a bug! I want to suggest a feature! I want to mock you!

[All of this is best handled in the app's GitHub repository.](https://github.com/BenReilly/dnd-cad)
