
/* ==========================================
   ResumeConnect - script.js (Part 4B)
========================================== */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdH-Sdf9hpP9laGZGUDjCGXL-adP9V_MYkPyALv5kFXZd1NDP4b7bwfFwN6P9g1RB7/exec";

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
