const btn = document.querySelector('.btn.form');
console.log(btn)
const validate = (target) => {
  console.log(target.value, target.value.length)
  btn.disabled = !target.value.length
}