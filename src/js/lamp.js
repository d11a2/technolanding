const lampInner = document.querySelector(".lamp__inner");
lampInner.addEventListener("click", e => {
    e.currentTarget.classList.toggle("lamp__inner--opacity-changed");
})
