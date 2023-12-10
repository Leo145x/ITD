const login = document.querySelector("#login");
const ob_icon = document.querySelector("#icon-ob");

ob_icon.addEventListener("mouseover", function () {
    ob_icon.src = "/icon/ob_hover.svg";
})
ob_icon.addEventListener("mouseout", function () {
    ob_icon.src = "/icon/ob.svg";
})

