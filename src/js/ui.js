import styles from "../styles/notification.module.css";
//when we import a css module inside a js file, css module will define an object making classnames from the file to dynamically scoped classname that can be used in js code as an object and properties of that object
// import jss from "jss";
// import preset from "jss-preset-default"; //provides quick setup with default settings and default plugins so you dont have to setup plugins manually
// //you can use jss with or without plugins if you dont want to worry about default plugins and their order, you just need to install those plugins using npm
// jss.setup(preset());
import { css } from "@emotion/css";
import CheckmarkImage from "../../images/checkmark.svg";
import { getMotivationalPictures } from "./api";

const checkboxSize = "30px";
const realcheckbox = css`
  width: ${checkboxSize};
  height: ${checkboxSize};
  cursor: pointer;
  opacity: 0;
  position: absolute;
  top: -3px;
  left: -5px;
`;

//jss will generate unique name for each class to avoid classname collisions
//const { classes } = jss.createStyleSheet(jssStyles).attach();

export function renderTodos(todos) {
  const renderedItemArray = todos.map(function (todo) {
    const className = todo.completed ? "completed" : "";
    const completionClass = todo.completed ? "checked" : "";
    return `
              <li data-id="${todo.id}" class="${className}">
                  <span class="custom-checkbox">
                      <img class="check" src="${CheckmarkImage}" width="22" height="22"></img>
                      <input class="${realcheckbox}" data-element="real-checkbox" type="checkbox" ${completionClass} />
                  </span>
                  <label>${todo.text}</label>
                  <span class="delete"></span>
              </li>
          `;
  });
  document.querySelector(".todo-list").innerHTML = renderedItemArray.join("");
  renderMotivationalPictures();
}

export function clearNewTodoInput() {
  document.querySelector(".new-todo").value = "";
  showNotification();
}

export function getTodoId(element) {
  return parseInt(
    element.dataset.id ||
      element.parentNode.dataset.id ||
      element.parentNode.parentNode.dataset.id,
    10
  );
}

function showNotification() {
  //after configuring css module this styles.notification will be dynamically generated during build process and it wont be showing as notification rather some hash will show
  // const notification = `<div class="${styles.notification}"> Todo item added </div>`;
  // document.body.innerHTML += notification;

  const notificationElement = document.createElement("div");
  notificationElement.classList.add(
    "alert",
    "alert-success",
    styles.notification
  );
  notificationElement.setAttribute("role", "alert");
  notificationElement.innerHTML = "Todo Item Added";
  document.body.appendChild(notificationElement);

  setTimeout(function () {
    const notificationElement = document.querySelector(
      `.${styles.notification}`
    );
    notificationElement.parentNode.removeChild(notificationElement);
  }, 2000);
}

function renderMotivationalPictures() {
  //there is no static refrence here for rendering the image, this is dynamically rendered. Earlier in svg example we imported checkmark image however this time we dont even know at compile time (vvvvvimp) which image will be returned by the backend
  //threfore webpack doesn't know which images it should process based on the source code so this time we need to use something different than standard assest module or webpackloader
  //luckily there is special webapck plugin that can take care of large amount of image files even if they are not refrenced statically in the source code ===> CopyWebpackPlugin and its basically copying files from one folder to another during the build process, those images can also be optimized during the process of copying
  getMotivationalPictures().then((pictures) => {
    const motivationalPictureHtml = `
            <div class="motivational-pictures">
                ${pictures
                  .map((picture) => {
                    return (
                      '<img class="header-image" src="' +
                      picture +
                      '" alt="Motivational picture" />'
                    );
                  })
                  .join("")}
            </div>
        `;
    const motivationalPictureContainer = document.querySelector(
      ".motivational-picture-container"
    );
    motivationalPictureContainer.innerHTML = motivationalPictureHtml;
  });
}
