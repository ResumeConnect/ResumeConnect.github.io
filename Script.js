/* ==========================================
   ResumeConnect - script.js (Part 4A)
========================================== */

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("resume");
const fileName = document.getElementById("fileName");
const uploadBtn = document.getElementById("uploadBtn");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");
const whatsapp = document.getElementById("whatsapp");
const fullName = document.getElementById("fullname");
const backToTop = document.getElementById("backToTop");

let selectedFile = null;

/* ------------------------------
   Loader
------------------------------ */


/* ------------------------------
   Drag & Drop
------------------------------ */

["dragenter", "dragover"].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.add("active");
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        dropArea.classList.remove("active");
    });
});

dropArea.addEventListener("drop", e => {

    const files = e.dataTransfer.files;

    if(files.length){

        fileInput.files = files;

        handleFile(files[0]);

    }

});

dropArea.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {

    if(fileInput.files.length){

        handleFile(fileInput.files[0]);

    }

});

/* ------------------------------
   Validate File
------------------------------ */

function handleFile(file){

    const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if(!allowed.includes(file.type)){

        alert("Only PDF, DOC and DOCX files are allowed.");

        return;

    }

    if(file.size > 10 * 1024 * 1024){

        alert("Maximum file size is 10 MB.");

        return;

    }

    selectedFile = file;

    fileName.textContent = file.name;

}

/* ------------------------------
   WhatsApp Validation
------------------------------ */

function validateWhatsapp(){

    const number = whatsapp.value.trim();

    const regex = /^[0-9]{10,15}$/;

    return regex.test(number);

}

/* ------------------------------
   Fake Upload Progress
   (Real upload comes in Part 4B)
------------------------------ */

uploadBtn.addEventListener("click", () => {

    if(!selectedFile){

        alert("Please choose your Resume.");

        return;

    }

    if(!validateWhatsapp()){

        alert("Enter a valid WhatsApp number.");

        whatsapp.focus();

        return;

    }

    progressBar.style.width = "0%";

    statusText.innerHTML = "Preparing upload...";

    let progress = 0;

    const timer = setInterval(() => {

        progress += 5;

        progressBar.style.width = progress + "%";

        statusText.innerHTML =

        "Uploading... " + progress + "%";

        if(progress >= 100){

            clearInterval(timer);

            statusText.innerHTML =

            "Ready to send to Google Drive...";

        }

    },120);

});

/* ------------------------------
   Back To Top
------------------------------ */

window.addEventListener("scroll",()=>{

    if(window.scrollY > 400){

        backToTop.style.display="flex";

    }else{

        backToTop.style.display="none";

    }

});

backToTop.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});
/* ==========================================
   ResumeConnect - script.js (Part 4B)
========================================== */

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwdH-Sdf9hpP9laGZGUDjCGXL-adP9V_MYkPyALv5kFXZd1NDP4b7bwfFwN6P9g1RB7/exec";

/* ------------------------------
   Real Upload
------------------------------ */

async function uploadResume(){

    if(!selectedFile){

        alert("Please select your resume.");

        return;

    }

    if(!validateWhatsapp()){

        alert("Enter a valid WhatsApp number.");

        whatsapp.focus();

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerHTML =
    "Uploading...";

    statusText.textContent =
    "Uploading resume...";

    progressBar.style.width="15%";

    const formData = new FormData();

    formData.append("resume",selectedFile);

    formData.append("name",fullName.value);

    formData.append("whatsapp",whatsapp.value);

    try{

        progressBar.style.width="40%";

        const response =
        await fetch(SCRIPT_URL,{
            method:"POST",
            body:formData
        });

        progressBar.style.width="80%";

        const result =
        await response.json();

        if(result.success){

            progressBar.style.width="100%";

            statusText.textContent =
            "Resume uploaded successfully.";

            alert(
            "✅ Resume uploaded successfully!");

            fileInput.value="";

            fileName.textContent=
            "No file selected";

            fullName.value="";

            whatsapp.value="";

            selectedFile=null;

        }else{

            throw new Error(
            result.message ||
            "Upload failed");

        }

    }catch(error){

        console.error(error);

        progressBar.style.width="0%";

        statusText.textContent=
        "Upload failed.";

        alert(
        "❌ Upload failed.\nPlease try again.");

    }

    uploadBtn.disabled=false;

    uploadBtn.innerHTML=
    '<i class="fa-solid fa-paper-plane"></i> Upload Resume';

}

/* ------------------------------
   Replace old upload click
------------------------------ */

uploadBtn.onclick = uploadResume;
