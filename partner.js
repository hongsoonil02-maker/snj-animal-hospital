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
  const comp = document.getElementById('orderCompany').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const memo = document.getElementById('orderMemo').value.trim();
  if (!comp || !phone) { alert('상호명과 연락처를 입력해주세요.'); return; }
  let items = [];
  if (document.getElementById('itemParvogel').checked) items.push(`파보겔 ${document.getElementById('qtyParvogel').value}개`);
  if (document.getElementById('itemParvoKit').checked) items.push(`파보키트 ${document.getElementById('qtyParvoKit').value}박스`);
  if (document.getElementById('itemCoronaKit').checked) items.push(`코로나(단독)키트 ${document.getElementById('qtyCoronaKit').value}박스`);
  if (document.getElementById('itemComboKit').checked) items.push(`파보+코로나콤보 ${document.getElementById('qtyComboKit').value}박스`);
  if (document.getElementById('itemBrucellaKit').checked) items.push(`브루셀라키트 ${document.getElementById('qtyBrucellaKit').value}박스`);
  if (document.getElementById('itemRxMeds').checked) items.push(`수의사 처방약 사전조제`);
  if (items.length === 0) { alert('주문할 품목을 1개 이상 선택해주세요.'); return; }
  const orderText = `[에스앤제이 수요일 현장수령 사전발주]\n· 상호명: ${comp}\n· 연락처: ${phone}\n· 신청품목: ${items.join(', ')}\n· 메모: ${memo}\n· 접수시간: ${new Date().toLocaleString('ko-KR')}`;
  try { const hist = JSON.parse(localStorage.getItem('snj_orders')||'[]'); hist.push({comp, phone, items: items.join(', '), memo, at: new Date().toISOString()}); localStorage.setItem('snj_orders', JSON.stringify(hist.slice(-20))); } catch(err){}
  navigator.clipboard.writeText(orderText).catch(()=>{});
  try { const ep=(window.HOSPITAL_CONFIG&&window.HOSPITAL_CONFIG.orderEndpoint)||''; if(ep) fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({comp,phone,items,memo,orderText})}).catch(()=>{}); } catch(err){}
  closeModal('orderModal');
  const goCall = confirm(`사전 발주 내용이 클립보드에 복사되었습니다.\n\n${orderText}\n\n[확인] 전화 연결(031-321-6562), [취소] 문자 전송`);
  if (goCall) location.href='tel:031-321-6562'; else { location.href=`sms:010-5407-5708?body=${encodeURIComponent(orderText)}`; setTimeout(()=>alert('문자 앱이 열리지 않으면 복사된 내용을 붙여넣어 전송해주세요. (010-5407-5708)'),1500); }
  if (navigator.share) navigator.share({title:'에스앤제이 사전발주', text: orderText}).catch(()=>{});
}

window.onclick = function(e) {
  if (e.target.classList.contains('modal-backdrop')) e.target.style.display = 'none';
};