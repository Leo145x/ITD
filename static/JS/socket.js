const socket = io();
socket.on("file_processed", function (data) {
    let user_info = JSON.parse(sessionStorage.getItem("user_info"));
    if (data.user_id == user_info.id) {
        // removeLoadingAnimation(data.file_name);
        alert("影片辨識完成!");
        location.reload();
    }
})

// let removeLoadingAnimation = (file_name) => {
//     let encodedFileName = encodeURIComponent(file_name);
//     let loadingRows = document.getElementById("loading-" + encodedFileName);
//     if (loadingRows){
//         loadingRows.remove();
//     }
// }