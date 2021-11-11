const btn = document.querySelector('.btn.form');

const inputField = document.querySelector('.field');

const validate = (target) => {
  btn.disabled = !target.value.length
}

inputField.focus();

function toggle() {
  if (inputField.type === "password") {
    inputField.type = "text";
  } else {
    inputField.type = "password";
  }
}