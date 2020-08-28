# Angular HTML Table Challenge

Hey there! This is my submission for the ClickUp FE position Angular project.

There's a lot to cover so let's get straight to it.

## Overview

At it's most basic, this app is a data table generated from data at the [JSON Placeholder post endpoint](https://jsonplaceholder.typicode.com/posts) using Angular and some basic NgRx elements. On its first load, the app should present a largely blank screen and a "Load Posts" button. This button triggers the NgRx effect to fetch the HTTP data and populates the component store with that same data. It then automatically has the main component subscribe to the store state and populate its local state with the store info.

Once the info is loaded, the app should present its data table, as well as a button to clear the local storage object, and a filter input for searching the dataset.

As there are no credentials or token identifiers in the app, the local storage object is used to persist the app between refreshes and page closure; the app should retain table data, search queries, column order, and sorting state between reloads. The red "Clear Local Storage" button simply clears the entire local storage object and refreshes the page if the user wishes to revisit the initial state or essentially reset the app to its default configuration.

The filter input below the red button is an active event generator. On every key input (specifically keyup) an event is fired to search every cell for the included term. The actual "filtering" is done by applying a class which simply styles every non-header row with a "display:none" CSS property, and removes that class for rows with a cell containing the search query.

On the actual data table, several adjustments can be made with the header row:

 First, columns can be sorted in descending or ascending order by clicking on the header titles (indicated by a "cursor:pointer" styling). If an already sorted column is clicked, this toggles the sort order; if a new column is clicked, this sorts the table by that column in descending order.

 Second, columns can be "dragged" to rearrange their order. The drag area is a box just to the sides as well as above and below the header title (indicated by a "cursor:grab" styling). Clicking and holding this area lets the user drag a column to a new position and swap column positions.

 Third and lastly, columns can be resized to adjust their width. The resize area is the remaining header space not contained in the drag or sort events (indicated by a "cursor:col-resize" styling). The resizing logic is functional but admittedly quirky. Once clicked, dragging to the left will decrease the column width, while dragging right will increase the column width, regardless of the actual click's initial position or movement in relation to the column itself.

## Errors

While the table and its associated logic is largely functional as the project directions asked, I admit there are some lingering issues that I could not amend without devoting more time to the project, and I felt submitting the app as it currently is would be indicative of my work within a limited time span.

I already mentioned the unwieldy column resizing matter of dragging to the left always decreasing the width and vice versa. Another issue is with the table width not correctly adjusting to a smaller column width sum. Admittedly, the current app as a whole is not responsive and I would not suggest attempting to use it on mobile or otherwise smaller screens, however, the table width is one of the more overt examples of less-than-ideal sizing. Finally, there is an issue with the sorting indicator awkwardly moving if it is on a column between a moved column's initial and end positions. The Angular CDK drag implementation adjusts columns as the dragging event moves over them, so if the sorting indicator were on index 2, and the user moved the column in index 3 to index 0, the sorting indicator will now be on whatever column was shifted *into* index 2, rather than the column that was shifted *from* index 2. This is an artifact of the CDK pushing array items rather than allowing items to be simply swapped by default.

## Potential Improvements & Adjustments from Here

There are of course a lot of ways to optimize or future-proof any app, and while I can't pretend to know all of them, some of the ways this app could be improved with more time include:

### Modularizing

The current app is essentially 1 component with all of its logic, templating, and styling barring the NgRx store elements being associated with it. Many of these pieces could be abstracted to seperate files for better modularity down the line, allowing them to be reused elsewhere.

The actual JS logic for the columns and filtering can be abstracted to a seperate file to allow importing them as utility functions elsewhere.

The store state logic can be seperated from the presention layer to allow easier adjustments if in the future alternative presentation contexts are needed such as presenting a table in a dashboard, a modal window, or as an API return element.

### The NgRx store

The current Component Store(CS) is a slightly different NgRx implementation of its more traditional counterpart in the global store. While the CS does allow some interesting optimization potential, most notably the ability to defer initialization to the associated component's initialization rather than being instanced at app start, it's very likely that a larger app will need to actually set up a global store for more effective state sharing between components. Thankfully, the CS is not mutually exclusive with the global store and the two can be used together if the use case is deemed sufficent.

I only touched on some essential features of the component store like setting/retrieving state and using Effects to fetch HTTP requests, but the abilities can be expanded. The effects file can certainly be adapted to include more endpoints even with the JSON Placeholder site, such as pulling dummy users or nested queries like Users/Albums. The current app is only properly equipped to display single-level objects, but thankfully Effects allow a number of pipe operations that can transform data in all sorts of ways to make it more useful for component presentation. Setting up the proper reducers and selectors also allows for more robust state manipulation techniques like implementing paging.

### Paging

Even aside from the ease of using a paging implementation offered by the Angular CDK tables, setting up a custom solution shouldn't be too difficult. Throttling can occur at either the http request or the component state pull, although the later is probably more useful to limit potential http requests and allow filtering/transformations on data besides the currently displayed cells; either way, the user receives a limited portion of the data at any time, and then has the option to generate further rows of data at a time.

### Typing

While Typescript's typing functionality is a great tool for helping ensure team coordination and future legibility, I admit I often forgo taking the time to properly implement it when working alone on smaller projects like this. The current app wouldn't take too long to set up the proper types on its functions and parameters and I do believe setting it up properly pays in dividends down the line for larger projects.

### Functionality

The current app is fairly limited in its ability to manipulate data. Aside from rearranging the presentation, the user can't do much to the actual information itself. Future development would likely heavily involve editing ability and permisson management to set up a more comprehensive app.

## Closing Thoughts and Time Estimate

I had some fun working on this challenge. It's been a minute since I've done an Angular project and getting reacquainted with some of the idiosyncrasies was interesting (if a little frustrating at times). Personally I don't like to reinvent the wheel but I respect the ability for some programmers to develop custom functions on the fly. While my custom logic for the column events isn't perfect, I'm confident that I could get them nailed down with a some extra time to study them as necessary.

While I didn't keep strict time with this challenge, I'd estimate I spent somewhere in the realm of **20 hours** total working on the app's core functionality (templating, logic, store, etc) and another 5 or so hours with accessory work like styling, setting up the deployment, and writing this doc. If I were to estimate my time doing a similar app in a work environment where some of the parameters are adjusted, say being allowed to use existing libraries to handle more mundane functions like the column arrangement, as well as having existing stylesheets to work off of for design, I feel confident I could create a component of similar difficulty and scope in around 10 hours or less.

All that said, thanks for taking the time to read this. I hope we'll be in contact again to discuss the app and what we could adjust, or to chat about the relationship between myself and the company.

Hope you and your team are doing well,

Joshua Trevena