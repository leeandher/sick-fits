# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## What is Next.js?

**_Next.js_** is actually what I like to call, a super framework. It takes _React.js_ the already powerful front-end framework, and adds a structure to it, which is helpful for setting up applications. Think of it like React is every word in the world, and Next is just your notebook, providing you a clean simple interface, to apply those words.

With that comes some handy helpers, including _Server-side Rendering_, _Routing Structure_, _Simple Page Creation_, and _State-Page Management_ all setup out of the box with the install. That is why when using Next.js, you'll find a lot of your basic imports coming from `next/$MODULE_NAME` rather than the normal module itself. Next has added it's own flavor to it to help you adhere to their application structure.

## Folder Structure in Next

Most simply React apps start with creating your DOM element to host the app, something like `<div id="root"></div>` or `<div id="app"></div>`, then creating a large HOC inevitably called `App.js` or `Main.js`, and admitedly, even CRA starts you down this path, but next has all of that setup out of the box.

Since you're developing an application in the 21st Century, you should use a proper folder structure.
