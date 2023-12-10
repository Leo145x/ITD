// 獲取模態窗口元素和觸發按鈕
const login_modal = document.getElementById("loginModal");
const signup_modal = document.querySelector("#signupModal");
const login_tag = document.getElementById("login");
const signin_form = document.querySelector("#signin_form");
const signup_form = document.querySelector("#signup_form");
const logout_tag = document.querySelector("#logout");

function validateEmail(email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return passwordRegex.test(password);
}

// 點擊按鈕時打開模態窗口
login_tag.addEventListener("click", function () {
    login_modal.style.display = "block";
})

// sign in submit
signin_form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let email = signin_form.elements["email"].value;
    let password = signin_form.elements["password"].value;

    if (!validateEmail(email)) {
        document.querySelector("#signin_remind").textContent = "無效的電子郵件地址";
        return;
    }

    if (!validatePassword(password)) {
        document.querySelector("#signin_remind").textContent = "密碼不符合規定";
        return;
    }

    let sign_in_data = new FormData(this);
    try {
        let response = await fetch("/api/signin", {
            method: "PUT",
            body: sign_in_data
        })
        let result = await response.json();
        if (!result.ok) {
            document.querySelector("#signin_remind").textContent = result.message;
        }else{
            localStorage.setItem("itd-token", result.itd_token);
            location.reload();
        }
    } catch (error) {
        console.error("Error:",error);
    }
})

// sign up submit
signup_form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let email = signup_form.elements["email"].value;
    let password = signup_form.elements["password"].value;

    if (!validateEmail(email)) {
        document.querySelector("#signup_remind").textContent = "無效的電子郵件地址";
        return;
    }

    if (!validatePassword(password)) {
        document.querySelector("#signup_remind").textContent = "密碼不符合規定";
        return;
    }

    let sign_up_data = new FormData(this);
    try {
        let response = await fetch("/api/signup", {
            method: "POST",
            body: sign_up_data
        })
        let result = await response.json();
        document.querySelector("#signup_remind").textContent = result.message;

    } catch (error) {
        console.error("Error:",error);        
    }
})

// log out
logout_tag.addEventListener("click", function () {
    let check = confirm("確定要登出嗎?");
    if (check) {
        localStorage.removeItem("itd-token");
        sessionStorage.removeItem("user_info");
        document.querySelectorAll(".login").forEach(i => {
            i.style.display = "none";
        })
        document.querySelector("#login").style.display = "block";
        alert("成功登出!");
        location.href = "/";
    }
})

// 點擊 x 關閉模態窗口
function close_pop_widnow() {
    login_modal.style.display = "none";
    signup_modal.style.display = "none";
}

// 彈跳視窗轉換
let signin = () => {
    login_modal.style.display = "block";
    signup_modal.style.display = "none";
}

let register = () => {
    signup_modal.style.display = "block";
    login_modal.style.display = "none";
}

// 點擊窗口外部時關閉模態窗口
// window.addEventListener("click", function (event) {
//     if (event.target == login_modal || event.target == signup_modal) {
//         login_modal.style.display = "none";
//     }
// })

