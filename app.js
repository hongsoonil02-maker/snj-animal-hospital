// 1. 스마트 트리아지 빠른 칩 적용
    function applyChip(text) {
      const textarea = document.getElementById('symptomText');
      textarea.value = text;
      textarea.focus();
    }

    function focusTriageInput() {
      const area = document.getElementById('triage');
      area.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('symptomText').focus();
    }

    // 2. 스마트 문진 보조 분류 알고리즘 (키워드 기반, 수의사 진단 대체 아님)
    function runSmartTriage() {
      const text = document.getElementById('symptomText').value.trim();
      const resultArea = document.getElementById('triageResultArea');
      const pill = document.getElementById('resultStatusPill');
      const heading = document.getElementById('resultHeading');
      const guide = document.getElementById('resultActionGuide');

      if (!text) {
        alert('증상을 간략하게 입력해 주시거나 추천 칩을 클릭해 주세요.');
        return;
      }

      resultArea.style.display = 'block';

      // 키워드 기반 보조 분류 (질병 사전 진단 아님, 참고용 행동 가이드)
      const t = text.toLowerCase();

      // (1) 위급 응급 (RED) : 생명 위험, 즉각적인 수액 및 내원
      if (t.includes('혈변') || t.includes('피똥') || t.includes('경련') || t.includes('발작') || t.includes('호흡') || t.includes('숨') || t.includes('헐떡') || t.includes('의식') || t.includes('쓰러') || t.includes('체온') || t.includes('저체온')) {
        pill.className = 'triage-status-pill status-red';
        pill.innerHTML = '<span>🔴 RED : 즉시 응급 내원 필요 (골든타임)</span>';
        heading.innerText = '파보바이러스 장염, 패혈증 또는 급성 저혈당 쇼크 위험이 높습니다.';
        guide.innerHTML = '· <strong>즉각 조치:</strong> 추가 사료 및 약물 강제 급여를 즉시 중단하시고, 보온을 유지하며 즉시 에스앤제이 동물병원 또는 인근 24시 응급센터로 내원하십시오.<br />· <strong>진단 프로토콜:</strong> CPV 파보 진단키트 검사 및 정맥 수액 처치가 시급합니다.';
      } 
      // (2) 소화기 집중 관리 (ORANGE) : 구토, 설사, 장염, 파보 의심
      else if (t.includes('구토') || t.includes('토') || t.includes('설사') || t.includes('물변') || t.includes('점액') || t.includes('처져') || t.includes('무기력') || t.includes('탈수')) {
        pill.className = 'triage-status-pill status-orange';
        pill.innerHTML = '<span>🟠 ORANGE : 오늘 중 동물병원 방문 권고</span>';
        heading.innerText = '급성 장염 또는 바이러스성 소화기 감염증 의심';
        guide.innerHTML = '· <strong>임상 조치:</strong> 자견의 경우 2~3회 설사만으로도 급속한 전해질 불균형과 탈수가 발생합니다. 물을 미온수로 조금씩 축여주시고 원내로 내원하십시오.<br />· <strong>권장 처방:</strong> <strong>파보겔</strong> 또는 <strong>몬스멕타(Monsmecta)</strong> 장 점막 도포제 및 지사제 처방, 파보·코로나 진단키트 검사가 권장됩니다.';
      } 
      // (3) 호흡기 및 감기 증상 (ORANGE/YELLOW) : 켄넬코프, 기침, 콧물
      else if (t.includes('기침') || t.includes('켁켁') || t.includes('가래') || t.includes('콧물') || t.includes('재채기') || t.includes('눈곱')) {
        pill.className = 'triage-status-pill status-orange';
        pill.innerHTML = '<span>🟠 ORANGE : 전염성 호흡기(켄넬코프) 의심</span>';
        heading.innerText = '전염성 기관지염(켄넬코프) 또는 호흡기 바이러스 감염 주의';
        guide.innerHTML = '· <strong>집단 격리:</strong> 다른 자견들과 즉시 격리하고 실내 습도를 50~60%로 유지하십시오.<br />· <strong>권장 처방:</strong> 호흡기 2차 세균감염 방지를 위한 원내 소염진통제 및 항생제 네뷸라이저 처방이 필요합니다.';
      }
      // (4) 피부/기생충/식이 이상 (YELLOW) : 가려움, 귀, 곰팡이, 벼룩
      else if (t.includes('가려') || t.includes('귀') || t.includes('털') || t.includes('비듬') || t.includes('각질') || t.includes('원형') || t.includes('기생충')) {
        pill.className = 'triage-status-pill status-yellow';
        pill.innerHTML = '<span>🟡 YELLOW : 외래 진료 및 외용제 처방</span>';
        heading.innerText = '피부사상균증(링웜), 외부 기생충 또는 외이염 의심';
        guide.innerHTML = '· <strong>위생 관리:</strong> 축사 및 환경 소독을 시행하시고 자견 피부를 긁지 못하게 넥카라를 권장합니다.<br />· <strong>권장 처방:</strong> 피부 전용 연고, 약용 샴푸 및 구충제 처방을 위해 수요일 현장 진료실을 방문해 주세요.';
      }
      // (5) 단순 식욕부진 및 경증 관찰 (YELLOW/GREEN)
      else if (t.includes('안 먹') || t.includes('식욕') || t.includes('기운') || t.includes('사료 거부')) {
        pill.className = 'triage-status-pill status-yellow';
        pill.innerHTML = '<span>🟡 YELLOW : 수의사 유선 상담 및 12시간 경과 관찰</span>';
        heading.innerText = '환경 스트레스 또는 초기 소화기 불편 신호';
        guide.innerHTML = '· <strong>모니터링:</strong> 사료를 미온수에 살짝 불려 급여해 보시고, 12시간 이상 전량 거부 시 당 수액 보충이 필요할 수 있으니 진료실로 문의하십시오.';
      } else {
        pill.className = 'triage-status-pill status-green';
        pill.innerHTML = '<span>🟢 GREEN : 자택 내 안정 및 일상 관찰 가능</span>';
        heading.innerText = '현재 즉각적인 급성 위험 신호는 감지되지 않았습니다.';
        guide.innerHTML = '아이의 활력과 음수량을 평소대로 유지해 주시고, 이상 증상이 발생할 경우 언제든 증상을 재입력해 주세요.';
      }

      // 작성된 증상을 모바일 요약서에도 자동 반영
      document.getElementById('summarySymptoms').value = text;
    }

    // 2-1. 파보겔 체중별 투약량 실시간 자동 계산 함수
    function calculateDosage() {
      const weightInput = document.getElementById('petWeight');
      const calcResult = document.getElementById('calcResult');
      if (!weightInput || !calcResult) return;

      const weight = parseFloat(weightInput.value);
      if (isNaN(weight) || weight <= 0) {
        calcResult.innerText = '체중을 올바르게 입력해 주세요';
        return;
      }

      // 임상 복약 가이드: kg당 1.0 ~ 1.5 ml (1회 권장량)
      const minDose = (weight * 1.0).toFixed(1);
      const maxDose = (weight * 1.5).toFixed(1);
      calcResult.innerText = `약 ${minDose} ~ ${maxDose} ml (눈금 주사기 또는 펌핑)`;
    }

    // 2-2. 수요일 현장 수령 사전 발주 처리 함수 (백엔드 연동: localStorage + 클립보드 + Web Share + 선택적 fetch)
    function handlePreOrderSubmit(e) {
      e.preventDefault();
      const compEl = document.getElementById('orderCompany');
      const phoneEl = document.getElementById('orderPhone');
      const memoEl = document.getElementById('orderMemo');
      const comp = compEl.value.trim();
      const phone = phoneEl.value.trim();
      const memo = memoEl.value.trim();
      if (!comp || !phone) {
        alert('상호명과 연락처를 입력해주세요.');
        return;
      }
      const phonePat = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phonePat.test(phone.replace(/\s/g,''))) {
        if (!confirm('연락처 형식이 올바르지 않을 수 있습니다. 그대로 접수할까요?\n입력값: ' + phone)) return;
      }
      
      let items = [];
      if (document.getElementById('itemParvogel').checked) items.push(`파보겔 ${document.getElementById('qtyParvogel').value}개`);
      if (document.getElementById('itemParvoKit').checked) items.push(`파보키트 ${document.getElementById('qtyParvoKit').value}박스`);
      if (document.getElementById('itemCoronaKit').checked) items.push(`코로나키트 ${document.getElementById('qtyCoronaKit').value}박스`);
      if (document.getElementById('itemComboKit').checked) items.push(`파보+코로나콤보 ${document.getElementById('qtyComboKit').value}박스`);
      if (document.getElementById('itemBrucellaKit').checked) items.push(`브루셀라키트 ${document.getElementById('qtyBrucellaKit').value}박스`);
      if (document.getElementById('itemRxMeds').checked) items.push(`원내 처방약(몬스멕타·소화기점막보호제·호흡기)`);
      if (items.length === 0) {
        alert('주문할 품목을 1개 이상 선택해주세요.');
        return;
      }

      const orderText = `[에스앤제이 수요일 현장수령 사전발주]\n· 상호명: ${comp}\n· 연락처: ${phone}\n· 신청품목: ${items.join(', ')}\n· 메모: ${memo}\n· 접수시간: ${new Date().toLocaleString('ko-KR')}`;
      // 1) 로컬 저장 (주문 이력)
      try {
        const hist = JSON.parse(localStorage.getItem('snj_orders') || '[]');
        hist.push({ comp, phone, items: items.join(', '), memo, at: new Date().toISOString(), orderText });
        localStorage.setItem('snj_orders', JSON.stringify(hist.slice(-20)));
      } catch(err) {}
      // 2) 클립보드 복사
      navigator.clipboard.writeText(orderText).catch(()=>{});
      // 3) 선택적 서버 전송 (hospital-config에 orderEndpoint 설정 시)
      try {
        const endpoint = (window.HOSPITAL_CONFIG && window.HOSPITAL_CONFIG.orderEndpoint) || '';
        if (endpoint) {
          fetch(endpoint, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ comp, phone, items, memo, orderText }) }).catch(()=>{});
        }
      } catch(err) {}
      // 4) 사용자 피드백 - 복사 완료 + 전화/문자 액션 제공
      closeModal('orderModal');
      const goCall = confirm(`사전 발주 내용이 클립보드에 복사되었습니다.\n\n${orderText}\n\n[확인]을 누르면 병원(031-321-6562)으로 전화 연결합니다.\n[취소]를 누르면 문자 전송 화면으로 이동합니다.`);
      if (goCall) {
        location.href = 'tel:031-321-6562';
      } else {
        // SMS intent (안드로이드/iOS 호환)
        const smsBody = encodeURIComponent(orderText);
        location.href = `sms:010-5407-5708?body=${smsBody}`;
        // Fallback: 1.5초 후 안내
        setTimeout(()=> alert('문자 앱이 열리지 않으면, 복사된 내용을 카카오톡/문자로 붙여넣어 전송해주세요.\n병원: 010-5407-5708'), 1500);
      }
      // 추가: Web Share API 지원 시 공유 시트 제공 (비차단)
      if (navigator.share) {
        navigator.share({ title: '에스앤제이 사전발주', text: orderText }).catch(()=>{});
      }
    }

    // 3. 모달 제어 (접근성: 포커스 트랩 및 Escape 키 지원)
    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'flex';
      // 모달 내 첫 번째 포커스 가능 요소로 포커스 이동
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
      document.body.style.overflow = 'hidden';
    }
    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
      document.body.style.overflow = '';
    }
    // 배경 클릭으로 모달 닫기
    window.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal-backdrop')) {
        event.target.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
    // Escape 키로 열려 있는 모달 닫기 + 모바일 메뉴 닫기
    window.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(function(modal) {
          if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }
        });
        closeMobileMenu();
      }
    });
    // 모바일 햄버거 메뉴 (접근성: aria-expanded, 포커스 관리)
    function toggleMobileMenu() {
      const btn = document.getElementById('mobileMenuBtn');
      const nav = document.getElementById('mobileNav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.setAttribute('aria-label', !expanded ? '메뉴 닫기' : '메뉴 열기');
      if (expanded) {
        nav.hidden = true;
        document.body.style.overflow = '';
      } else {
        nav.hidden = false;
        nav.querySelector('a').focus();
        document.body.style.overflow = 'hidden';
      }
    }
    function closeMobileMenu() {
      const btn = document.getElementById('mobileMenuBtn');
      const nav = document.getElementById('mobileNav');
      if (!btn || !nav || nav.hidden) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', '메뉴 열기');
      nav.hidden = true;
      document.body.style.overflow = '';
      btn.focus();
    }
    // 햄버거 버튼 이벤트 바인딩 (DOMContentLoaded 후)
    document.addEventListener('DOMContentLoaded', function() {
      const btn = document.getElementById('mobileMenuBtn');
      if (btn) btn.addEventListener('click', toggleMobileMenu);
      // 모바일 nav 링크에서 포커스 아웃 시 자동 닫기 (선택)
      document.addEventListener('click', function(e) {
        const nav = document.getElementById('mobileNav');
        const btnEl = document.getElementById('mobileMenuBtn');
        if (!nav || nav.hidden) return;
        if (!nav.contains(e.target) && e.target !== btnEl && !btnEl.contains(e.target)) {
          // 바깥 클릭 시 닫기 (단, 모달 백드롭 클릭 핸들러와 충돌 방지)
          if (!e.target.classList.contains('modal-backdrop')) closeMobileMenu();
        }
      });
    });
    // runSmartTriage 후 결과 영역으로 포커스 이동 (스크린리더용)
    const _origRunSmartTriage = runSmartTriage;
    runSmartTriage = function() {
      _origRunSmartTriage();
      const area = document.getElementById('triageResultArea');
      if (area && area.style.display === 'block') {
        area.setAttribute('tabindex', '-1');
        area.focus({ preventScroll: true });
        area.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // 4. 진료실 요약서 인쇄 및 복사 (전체 사이트 9페이지 인쇄 방지 -> 깔끔한 A4 1장 전용 인쇄창)
    function escHtml(str) {
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }
    function printSummary() {
      const petRaw = document.getElementById('summaryPetName').value || '미입력';
      const infoRaw = document.getElementById('summaryPetInfo').value || '미입력';
      const symRaw = document.getElementById('summarySymptoms').value || '특이사항 없음';
      const qRaw = document.getElementById('summaryQuestion').value || '특이사항 없음';
      const todayRaw = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
      const pet = escHtml(petRaw);
      const info = escHtml(infoRaw);
      const sym = escHtml(symRaw);
      const q = escHtml(qRaw);
      const today = escHtml(todayRaw);

      const printHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>에스앤제이 동물병원 - 진료실 모바일 사전 문진표</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif; }
    body { background: #fff; color: #0f172a; padding: 20px; }
    .sheet { max-width: 680px; margin: 0 auto; border: 2px solid #0d9488; border-radius: 14px; padding: 28px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d9488; padding-bottom: 14px; margin-bottom: 20px; }
    .h-title { font-size: 22px; font-weight: 900; color: #132e47; }
    .h-sub { font-size: 13px; color: #0d9488; font-weight: 700; margin-top: 4px; }
    .h-right { text-align: right; font-size: 12px; color: #64748b; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
    .field-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
    .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 700; color: #0f172a; }
    .block-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; }
    .value-area { font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin-top: 4px; }
    .footer { margin-top: 24px; padding-top: 14px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b; }
    .stamp { font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <div class="h-title">📋 진료실 모바일 사전 문진표</div>
        <div class="h-sub">DR. S & J ANIMAL HOSPITAL · 전문 진료센터</div>
      </div>
      <div class="h-right">
        <div>접수일자: ${today}</div>
        <div style="font-weight:700; color:#132e47; margin-top:2px;">원내 진료용 원본</div>
      </div>
    </div>

    <div class="grid">
      <div class="field-box">
        <div class="label">반려동물 이름</div>
        <div class="value">${pet}</div>
      </div>
      <div class="field-box">
        <div class="label">견종 / 나이 / 체중</div>
        <div class="value">${info}</div>
      </div>
    </div>

    <div class="block-box">
      <div class="label">주요 증상 및 발생 시점</div>
      <div class="value-area">${sym}</div>
    </div>

    <div class="block-box">
      <div class="label">수의사 문진 핵심 질의사항</div>
      <div class="value-area" style="font-weight: 700; color: #0d9488;">${q}</div>
    </div>

    <div style="background:#fefce8; border:1px solid #fef08a; border-radius:8px; padding:12px; font-size:12px; color:#854d0e; line-height:1.5;">
      💡 <strong>진료실 알림:</strong> 본 문진표는 보호자가 내원 전 온라인 스마트 문진을 통해 사전 작성한 정보입니다. 수의사 진료 시 대기 시간 단축 및 정밀 처방에 활용됩니다.
    </div>

    <div class="footer">
      <div>에스앤제이 동물병원 (경기도 용인시 처인구 포곡읍 선장1로 98-8)</div>
      <div class="stamp">상담·예약: 031-321-6562</div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  <\/script>
</body>
</html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 브라우저 팝업 차단을 해제 후 다시 시도해주세요.\n대신 요약서 텍스트 복사 기능을 이용해주세요.');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
    }
    function copySummaryText() {
      const pet = document.getElementById('summaryPetName').value;
      const info = document.getElementById('summaryPetInfo').value;
      const sym = document.getElementById('summarySymptoms').value;
      const q = document.getElementById('summaryQuestion').value;

      const summaryText = `[에스앤제이 동물병원 사전 문진표]\n· 아이: ${pet} (${info})\n· 증상: ${sym}\n· 질문: ${q}\n· 내원 상담 예약: 031-321-6562`;
      navigator.clipboard.writeText(summaryText).then(() => {
        alert('진료실 요약서가 클립보드에 복사되었습니다!\n카카오톡이나 문자 메시지로 바로 전송하실 수 있습니다.');
      }).catch(() => {
        alert('복사에 실패했습니다. 직접 복사해 주세요.');
      });
    }