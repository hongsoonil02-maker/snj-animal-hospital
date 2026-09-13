/**
 * Google Apps Script 예제: 에스앤제이 사전 발주 → 구글 시트 저장 + 이메일 알림
 * 1) https://script.google.com 에서 새 프로젝트 생성
 * 2) 아래 코드 붙여넣기 → 배포(웹앱) → 액세스: Anyone
 * 3) 배포 URL을 hospital-config.js orderEndpoint 에 입력
 * 시트 헤더: 접수시간 | 상호명 | 연락처 | 신청품목 | 메모 | 원문
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetId = 'YOUR_SHEET_ID_HERE'; // 구글 시트 ID로 교체
    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    sheet.appendRow([
      data.orderText.split('접수시간: ')[1] || new Date().toLocaleString('ko-KR'),
      data.comp,
      data.phone,
      Array.isArray(data.items) ? data.items.join(', ') : data.items,
      data.memo,
      data.orderText
    ]);
    // 선택: 이메일 알림
    // MailApp.sendEmail('hongsoonil02@gmail.com', '[SNJ 사전발주] ' + data.comp, data.orderText);
    return ContentService.createTextOutput(JSON.stringify({ok: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet() { return ContentService.createTextOutput('SNJ order endpoint OK'); }
