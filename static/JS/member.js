document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("uploadForm");
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");

    // 檢查檔案是否為影片類型
    function isVideoFile(file) {
        return file && file.type.match("video.*");
    }

    // 檢查檔案大小，不超過 100 MB
    function checkFileSize(file) {
        const fileSizeInMB = file.size / 1024 / 1024; // 轉換為 MB
        if (fileSizeInMB > 100) {
            return false;
        }
        return true;
    }

    // 轉換檔案大小為可讀的格式
    function formatFileSize(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes == 0) return "0 Byte";
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    }

    // 更新拖曳區域的文本
    function updateDropAreaText(file) {
        if (!isVideoFile(file)) {
            dropArea.textContent = "請選擇一個影片檔案！";
            return false;
        }
        if (!checkFileSize(file)) {
            dropArea.textContent = "檔案太大, 請選擇小於 100 MB 的檔案!";
            return false;
        }
        const fileSizeFormatted = formatFileSize(file.size);
        dropArea.textContent = `檔案名稱: ${file.name}, 檔案大小: ${fileSizeFormatted}`;
        return true;
    }

    dropArea.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropArea.classList.add("active");
    });

    dropArea.addEventListener("dragleave", function (e) {
        e.preventDefault();
        dropArea.classList.remove("active");
    });

    dropArea.addEventListener("drop", function (e) {
        e.preventDefault();
        dropArea.classList.remove("active");
        let file = e.dataTransfer.files[0];
        if (updateDropAreaText(file)) {
            fileInput.files = e.dataTransfer.files;
        }
    });

    // 點擊區域選擇檔案
    dropArea.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        let file = fileInput.files[0];
        if (file && updateDropAreaText(file)) {

        }
    });

    // 處理表單提交
    uploadForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (fileInput.files.length === 0 || !updateDropAreaText(fileInput.files[0])) {
            alert("請選擇一個有效的檔案！");
            return;
        }
        let formData = new FormData(uploadForm);
        let token = sessionStorage.getItem("user_info");
        token = JSON.parse(token);
        let id = token.id;
        formData.append("id",id);

        document.getElementById("loadingOverlay").style.display = "block";
        
        fetch("https://leogcp.xyz/uploadvideo", {
            method: "PUT",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert(data.message);
                    addProcessingRow(fileInput.files[0]);
                }else{
                    alert(data.message);
                }
            })
            .catch(error => {
                alert("上傳失敗！");
            })
            .finally(() =>{
                document.getElementById("loadingOverlay").style.display = "none";
            });
    });
});

function addProcessingRow(file) {
    let file_table = document.querySelector(".file-table");
    let tbody;
    if (!file_table){
        let emptyContainer = document.querySelector("#empty-reminder");
        if (emptyContainer) {
            emptyContainer.remove();
        }
        let table = document.createElement("table");
        table.className = "file-table";

        // 創建表頭
        let thead = table.createTHead();
        let headerRow = thead.insertRow();
        let headers = ["檔案名稱", "檔案大小", "建立時間", "下載影片結果", "下載標籤檔"];
        headers.forEach(headerText => {
            let header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        tbody = table.createTBody();
        document.getElementById("table-container").appendChild(table);
    }else{
        tbody = file_table.querySelector("tbody");
    };

    let encodedFileName = encodeURIComponent(file.name); // 編碼文件名
    let row = tbody.insertRow();
    row.id = "loading-" + encodedFileName; // 使用編碼後的文件名作為 ID

    // 第一列：文件名
    row.insertCell().textContent = file.name;

    // 第 2 到 5 列：合併並顯示影片處理中
    let loadingCell = row.insertCell();
    loadingCell.colSpan = "4";
    loadingCell.innerHTML = `<div class='fs-4 bg-warning-subtle 
                            text-info-emphasis rounded d-flex
                            justify-content-center align-item-center'>
                            影片辨識中, 請稍等片刻。</div>`;
}
