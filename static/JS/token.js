const token = localStorage.getItem("itd-token");
function change_top_banner() {
    document.querySelector("#login").style.display = "none";
    document.querySelectorAll(".login").forEach(i =>{
            i.style.display = "block";
        }
    )
}

if (token) {
    fetch("/api/verify", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                change_top_banner();
                sessionStorage.setItem("user_info", JSON.stringify(data.data));
            } else {
                localStorage.removeItem("itd-token");
                sessionStorage.removeItem("user_info");
                location.href = "/";
            }
        })
        .catch(err => {
            localStorage.removeItem("itd-token");
            sessionStorage.removeItem("user_info");
            console.error(err);
            if (location.pathname !== "/") {
                location.href = "/";
            }
        })
}else{
    if(location.pathname !== "/"){
        location.href = "/";
    }
}
