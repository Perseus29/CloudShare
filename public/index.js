const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent")
const progressBar = document.querySelector(".progress-bar");
const processContainer = document.querySelector(".progress-container")
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");
const sharingContainer = document.querySelector(".sharing-container");
const emailForm = document.querySelector("#emailForm");
const maxAllowedSize = 100*1024*1024;

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("Worked!");
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }

});

fileInput.addEventListener("change", () => {
    uploadFile();
})

browseBtn.addEventListener("click", () => {
    fileInput.click();
})

copyBtn.addEventListener("click", () => {
    fileURLInput.select();
    document.execCommand("copy");
})

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        recieverEmail: emailForm.elements["to-email"].value,
        senderEmail: emailForm.elements["from-email"].value
    }
    // console.log(formData);   

    emailForm[2].setAttribute("disabled" , "true");

    fetch("http://localhost:4000/api/files/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json())
      .then(({ success }) => {
        if(success){
            sharingContainer.style.display = "none";
        }
    });
});

const uploadFile = () => {
    if(fileInput.files.length>1){
        fileInput.value = "";
        alert("Upload only 1 file!")
        return;
    }
    const file = fileInput.files[0];
    if(file.size > maxAllowedSize){
        fileInput.value = "";
        alert("Can't upload more than 100MB!")
        return;
    }
    processContainer.style.display = "block";
    const formData = new FormData();
    formData.append("uploadFile", file);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        let percent = Math.round((100 * event.loaded) / event.total);
        percentDiv.innerText = percent;
        const scaleX = `scaleX(${percent / 100})`;
        bgProgress.style.width = `${percent}%`;
        progressBar.style.transform = scaleX;
    };

    xhr.open("POST", "http://localhost:4000/api/files");
    xhr.send(formData);

}

const onUploadSuccess = ({ file: url }) => {
    console.log(url);
    fileInput.value = "";
    emailForm[2].removeAttribute("disabled");
    processContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
}

