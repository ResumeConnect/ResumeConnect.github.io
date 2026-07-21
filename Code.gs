/* ==========================================
   ResumeConnect - Code.gs
========================================== */

const DRIVE_FOLDER_ID = "1Zs4flsGAumTVgw4NwsdDISGYQGzwyzgN";
const SHEET_NAME = "Applicants";

function doPost(e) {

  try {

    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

    const name = e.parameter.name || "";
    const whatsapp = e.parameter.whatsapp || "";

    // Example assumes the frontend sends Base64 data
    const base64 = e.parameter.fileData;
    const fileName = e.parameter.fileName || "Resume.pdf";
    const mimeType = e.parameter.mimeType || MimeType.PDF;

    const bytes = Utilities.base64Decode(base64);

    const blob = Utilities.newBlob(
      bytes,
      mimeType,
      fileName
    );

    const file = folder.createFile(blob);

    sheet.appendRow([
      new Date(),
      name,
      whatsapp,
      file.getName(),
      file.getUrl()
    ]);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          fileUrl: file.getUrl()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          message: err.toString()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  }

}
function doGet() {
  return ContentService
    .createTextOutput("ResumeConnect API is running");
}
