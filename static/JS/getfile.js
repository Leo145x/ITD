let userInfo = sessionStorage.getItem("user_info");

function fileElement(fileData) {
    // 創建一個表格
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

    let tbody = table.createTBody();
    Object.values(fileData).forEach(item => {
        let row = tbody.insertRow();
        row.insertCell().textContent = item.video_name;
        row.insertCell().textContent = item.video_size;
        row.insertCell().textContent = item.create_time;

        // 創建下載按鈕
        let downloadCell = row.insertCell();
        let downloadButton = document.createElement("a");
        downloadButton.href = item.video_link;
        downloadButton.textContent = "下載";
        downloadButton.className = "download-button";
        downloadButton.setAttribute("target", "_blank"); // 在新標籤頁中打開鏈接
        downloadCell.appendChild(downloadButton);

        let downloadLabel = row.insertCell();
        let labelButton = document.createElement("a");
        labelButton.href = item.video_label;
        labelButton.textContent = "下載";
        labelButton.className = "download-button";
        labelButton.setAttribute("target", "_blank");
        downloadLabel.appendChild(labelButton);
    });

    // 插入表格到頁面中
    document.getElementById("table-container").appendChild(table);
    // 確保有一個 id 為 "table-container" 的元素在您的 HTML 中
}

function emptyFile() {
    let div_container = document.createElement("div");
    div_container.className = "d-flex justify-content-center align-items-center";
    div_container.id = "empty-reminder";
    let div = document.createElement("div");
    div.className = "fs-5 text-secondary fw-bold";
    div.innerHTML = "您還沒有任何雲端檔案<br>趕快上傳檔案試試看吧!";
    div_container.appendChild(div);
    document.getElementById("table-container").appendChild(div_container);
}

if (userInfo !== null) {
    userInfo = JSON.parse(userInfo);
    fetch("/fileAdmin/fileSummary", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    )
    .then(data => {
        if (data.ok) {
            fileElement(data.data);
        } else {
            emptyFile();
        }
    })
    .catch(err => {
        console.error("Error: ", err);
    })
}
