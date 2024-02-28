import "../styles/vendors.scss";
import "../styles/index.scss"; // we imported css file but webpack doesnt understand it, it understands import of only js and json files.
// in case you want webpack to teach it to import different kind of file you need to teach it how to import that file, surprisingly it is very easy to do
// webpack allows you to import all kinds of things into your js code ==> and this is possible by using one or more loaders
//loader is basically a js library that knows how to import a specific file type into webpack ==> there are 100s of webapack loaders available out there e.g. xml loader knows how to load xml files, csv loader knows how to load csv files
// here we will use two loaders at once css loader and styles loader
// css loader: knows how to load css files from disk
// and styles loader: knows how to inject that css right into the Document object model(DOM).
// we will go to webpack.common.config.js and create a new rule that will tell webpack to use css loader and style loader when importing css files.
import {
  onLoadEventHandler,
  newTodoEventHandler,
  removeTodoEventHandler,
  toggleTodoEventListener,
  confirmRemoveEventHandler,
} from "./event-handlers";

//we made index.dev.js which is using hot-middleware to detect changes and then are invokinf this function
export function renderApp() {
  onLoadEventHandler();
}

//after the page finishes loading we are an adding eventlistner to do something ==> we will use this function invoke it whenever there is change in code base as part hot module reloading integration with dev server
window.addEventListener("load", onLoadEventHandler);
document.addEventListener("change", function (event) {
  if (event.target.classList.contains("new-todo")) {
    newTodoEventHandler(event);
  }
});
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete")) {
    removeTodoEventHandler(event);
  }
  if (event.target.dataset.element === "real-checkbox") {
    toggleTodoEventListener(event);
  }
  if (event.target.id === "modal-delete-button") {
    confirmRemoveEventHandler(event);
  }
});
