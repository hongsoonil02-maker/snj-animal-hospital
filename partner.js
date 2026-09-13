function calculateDosage() {
  const weightInput = document.getElementById('petWeight');
  const res = document.getElementById('calcResult');
  if (!weightInput || !res) return;
  const weight = parseFloat(weightInput.value);
  if (isNaN(weight) || weight <= 0) {
    res.innerText = '올바른 체중을 입력하세요';
    return;
  }
  const minDose = (weight * 1.0).toFixed(1);
  const maxDose = (weight * 1.5).toFixed(1);
  res.innerText = `약 ${minDose} ~ ${maxDose} ml (주사기/펌핑)`;
}

function selectWeightChip(val) {
  const weightInput = document.getElementById('petWeight');
  if (weightInput) {
    weightInput.value = val;
    calculateDosage();
  }
  document.querySelectorAll('.weight-chip-btn').forEach(btn => {
    if (parseFloat(btn.innerText) === val) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function selectPackage(pkg) {
  const pv = document.getElementById('itemParvogel');
  const qPv = document.getElementById('qtyParvogel');
  const pKit = document.getElementById('itemParvoKit');
  const qPKit = document.getElementById('qtyParvoKit');
  const cKit = document.getElementById('itemCoronaKit');
  const qCKit = document.getElementById('qtyCoronaKit');
  const cbKit = document.getElementById('itemComboKit');
  const qCbKit = document.getElementById('qtyComboKit');
  const bKit = document.getElementById('itemBrucellaKit');
  const qBKit = document.getElementById('qtyBrucellaKit');
  const rx = document.getElementById('itemRxMeds');
  const memo = document.getElementById('orderMemo');

  if (pv) pv.checked = false;
  if (pKit) pKit.checked = false;
  if (cKit) cKit.checked = false;
  if (cbKit) cbKit.checked = false;
  if (bKit) bKit.checked = false;
  if (rx) rx.checked = false;

  if (pkg === 1) {
    if (pv) { pv.checked = true; if (qPv) qPv.value = 5; }
    if (cbKit) { cbKit.checked = true; if (qCbKit) qCbKit.value = 1; }
    if (rx) rx.checked = true;
    if (memo) memo.value = '[SET 1 분양안심 기본 세트] 이번 주 수요일 현장 픽업 희망합니다.';
  } else if (pkg === 2) {
    if (pv) { pv.checked = true; if (qPv) qPv.value = 10; }
    if (pKit) { pKit.checked = true; if (qPKit) qPKit.value = 2; }
    if (cKit) { cKit.checked = true; if (qCKit) qCKit.value = 1; }
    if (rx) rx.checked = true;
    if (memo) memo.value = '[SET 2 집중 안심 케어 세트] 이번 주 수요일 현장 픽업 희망합니다.';
  } else if (pkg === 3) {
    if (pv) { pv.checked = true; if (qPv) qPv.value = 20; }
    if (cbKit) { cbKit.checked = true; if (qCbKit) qCbKit.value = 3; }
    if (bKit) { bKit.checked = true; if (qBKit) qBKit.value = 1; }
    if (rx) rx.checked = true;
    if (memo) memo.value = '[SET 3 켄넬·브리더 대용량 세트] 이번 주 수요일 현장 픽업 희망합니다.';
  }
  openOrderModal();
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
function openOrderModal() { openModal('orderModal'); }

function handlePreOrderSubmit(e) {
  e.preventDefault();
  const compEl=document.getElementById('orderCompany'), phoneEl=document.getElementById('orderPhone'), memoEl=document.getElementById('orderMemo');
  const comp=compEl?compEl.value.trim():''; const phone=phoneEl?phoneEl.value.trim():''; const memo=memoEl?memoEl.value.trim():'';
  if (!comp || !phone) { alert('상호명과 연락처를 입력해주세요.'); return; }
  const phonePat=/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/; if(!phonePat.test(phone.replace(/\s/g,''))){ if(!confirm('연락처 형식이 올바르지 않을 수 있습니다. 그대로 접수할까요?\n입력값: '+phone)) return; }
  let items=[];
  if(document.getElementById('itemParvogel')&&document.getElementById('itemParvogel').checked) items.push(`파보겔 ${document.getElementById('qtyParvogel').value}개`);
  if(document.getElementById('itemParvoKit')&&document.getElementById('itemParvoKit').checked) items.push(`파보키트 ${document.getElementById('qtyParvoKit').value}박스`);
  if(document.getElementById('itemCoronaKit')&&document.getElementById('itemCoronaKit').checked) items.push(`코로나키트 ${document.getElementById('qtyCoronaKit').value}박스`);
  if(document.getElementById('itemComboKit')&&document.getElementById('itemComboKit').checked) items.push(`파보+코로나콤보 ${document.getElementById('qtyComboKit').value}박스`);
  if(document.getElementById('itemBrucellaKit')&&document.getElementById('itemBrucellaKit').checked) items.push(`브루셀라키트 ${document.getElementById('qtyBrucellaKit').value}박스`);
  if(document.getElementById('itemRxMeds')&&document.getElementById('itemRxMeds').checked) items.push(`수의사 처방약 사전조제`);
  if (items.length === 0) { alert('주문할 품목을 1개 이상 선택해주세요.'); return; }
  const orderText = `[에스앤제이 수요일 현장수령 사전발주]\n· 상호명: ${comp}\n· 연락처: ${phone}\n· 신청품목: ${items.join(', ')}\n· 메모: ${memo}\n· 접수시간: ${new Date().toLocaleString('ko-KR')}`;
  try { const hist=JSON.parse(localStorage.getItem('snj_orders')||'[]'); hist.push({comp, phone, items:items.join(', '), memo, at:new Date().toISOString(), orderText}); localStorage.setItem('snj_orders', JSON.stringify(hist.slice(-20))); } catch(err){}
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(orderText).catch(()=>{});
  const endpoint=(window.HOSPITAL_CONFIG&&window.HOSPITAL_CONFIG.orderEndpoint)||'';
  let p=Promise.resolve('local');
  if(endpoint) p=fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({comp, phone, items, memo, orderText})}).then(r=>r.ok?'server-ok':'server-fail').catch(()=>'server-fail');
  closeModal('orderModal');
  p.then(status=>{
    // 간단 폴백: partner 페이지는 성공 모달 없으므로 alert + 선택형
    const badge = status==='server-ok'?'✅ 서버 전송 완료': status==='server-fail'?'⚠️ 서버 실패·로컬 저장됨':'📋 로컬 저장 + 복사 완료';
    const msg = `${badge}\n\n${orderText}\n\n전화(031-321-6562) 또는 문자(010-5407-5708)로 전송해 주세요.`;
    if(confirm(msg + '\n\n[확인] 전화 연결  [취소] 문자 전송')) location.href='tel:031-321-6562';
    else location.href='sms:010-5407-5708?body='+encodeURIComponent(orderText);
  });
}

window.onclick = function(e) {
  if (e.target.classList.contains('modal-backdrop')) e.target.style.display = 'none';
};