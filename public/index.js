const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");

dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    console.log("Worked!");
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }    
});

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");    
    const files = e.dataTransfer.files;
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
    
});

fileInput.addEventListener("change" , ()=>{
    uploadFile();
})

browseBtn.addEventListener("click",()=>{
    fileInput.click();
})

const uploadFile = ()=>{

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("uploadFile",file);
    
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response);            
        }        
    };

    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        let percent = Math.round((100 * event.loaded) / event.total);
        progressPercent.innerText = percent;
        const scaleX = `scaleX(${percent / 100})`;
        bgProgress.style.transform = scaleX;
        progressBar.style.transform = scaleX;
      };

    xhr.open("POST","http://localhost:4000/api/files");
    xhr.send(formData);

}

