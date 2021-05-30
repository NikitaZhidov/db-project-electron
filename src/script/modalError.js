const ANIMATION_TIME = 300;
const SHOW_TIME = 3500;

function showError(message) {
  let errorElemements = document.querySelectorAll(".modal-error");
  if (errorElemements) {
    errorElemements.forEach((elem) => {
      const elemStyle = window.getComputedStyle(elem);
      const newTop =
        +elemStyle.top.slice(0, -2) + +elem.offsetHeight * 1.1 + "px";
      elem.style.top = newTop;
    });
  }

  let errorElem = document.createElement("div");
  errorElem.classList.add("modal-error");
  errorElem.innerText = message;

  document.body.prepend(errorElem);
  setTimeout(() => {
    errorElem.classList.add("active");
  }, 10);

  setTimeout(() => {
    errorElem.classList.remove("active");
    setTimeout(() => {
      errorElem.remove();
    }, ANIMATION_TIME);
  }, SHOW_TIME);
}

function clearErrors() {
  let errorElemements = document.querySelectorAll(".modal-error");
  if (errorElemements) {
    errorElemements.forEach((elem) => {
      elem.remove();
    });
  }
}
