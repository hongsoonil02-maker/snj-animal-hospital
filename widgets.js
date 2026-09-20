/**
 * =======================================================================
 * 에스앤제이 동물병원 (Dr. S & J Animal Hospital)
 * - 장애인 접근 편의 도구 (접근성 툴바)
 * - FAQ 자동응답 챗봇 위젯
 * 0-Server · 순수 순정 JS · 단독 정적 호스팅에서도 동작
 * =======================================================================
 */
(function () {
  'use strict';

  var DOC = document;
  var root = DOC.documentElement;
  var cfg = window.HOSPITAL_CONFIG || {};
  var PHONE = cfg.phone || '031-321-6562';
  var HOTLINE = cfg.hotline || '010-5407-5708';

  /* ------------------------------------------------------------------
   * 공통 유틸리티
   * ---------------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || DOC).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || DOC).querySelectorAll(sel)); }

  var toastTimer = null;
  function toast(msg) {
    var el = DOC.createElement('div');
    el.className = 'acc-toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    DOC.body.appendChild(el);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 2600);
  }

  /* ------------------------------------------------------------------
   * 장애인 접근 편의 상태 관리 (localStorage 영속)
   * ---------------------------------------------------------------- */
  var STORE_KEY = 'snj_acc_state_v1';
  var DEFAULTS = {
    zoom: 0,          // 0=100%, 1=110%, 2=120%, 3=135%
    contrast: false,
    invert: false,
    gray: false,
    cursor: false,
    letter: false,
    line: false,
    guide: false
  };

  function readState() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { s = {}; }
    var out = {};
    for (var k in DEFAULTS) {
      if (DEFAULTS.hasOwnProperty(k)) out[k] = (s[k] !== undefined) ? s[k] : DEFAULTS[k];
    }
    return out;
  }
  function saveState(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = readState();
  var accPanel = $('#accPanel');
  var accFab = $('#accFab');

  var TOGGLE_KEYS = ['contrast', 'invert', 'gray', 'cursor', 'letter', 'line'];

  function applyState() {
    for (var z = 0; z <= 3; z++) root.classList.toggle('acc-zoom-' + z, state.zoom === z);
    TOGGLE_KEYS.forEach(function (k) { root.classList.toggle('acc-' + k, !!state[k]); });
    renderGuide();
    $all('[data-acc]').forEach(function (btn) {
      var act = btn.getAttribute('data-acc');
      var on = false;
      if (TOGGLE_KEYS.indexOf(act) !== -1) on = !!state[act];
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setZoom(delta) {
    state.zoom = Math.max(0, Math.min(3, (state.zoom || 0) + delta));
    applyState(); saveState(state);
    if (state.zoom === 0) toast('글자 크기 초기화');
    else toast('글자 크기 ' + ['110%', '120%', '135%'][state.zoom - 1] + ' 적용');
  }

  function resetZoom() {
    state.zoom = 0;
    applyState(); saveState(state);
    toast('글자 크기 초기화');
  }

  function toggleFeature(key) {
    state[key] = !state[key];
    applyState(); saveState(state);
    toast(featureName(key) + (state[key] ? ' 켜짐' : ' 꺼짐'));
  }

  function toggleGuide() {
    state.guide = !state.guide;
    applyState(); saveState(state);
    toast('줄 가이드 ' + (state.guide ? '켜짐' : '꺼짐'));
  }

  function featureName(key) {
    var names = {
      contrast: '고대비 모드',
      invert: '색상 반전',
      gray: '흑백 모드',
      cursor: '큰 커서',
      letter: '글자 간격 확대',
      line: '줄 간격 확대'
    };
    return names[key] || key;
  }

  function resetAll() {
    stopReading();
    for (var k in DEFAULTS) state[k] = DEFAULTS[k];
    for (var z = 0; z <= 3; z++) root.classList.remove('acc-zoom-' + z);
    TOGGLE_KEYS.forEach(function (k) { root.classList.remove('acc-' + k); });
    hideGuide();
    applyState(); saveState(state);
    toast('접근 편의 설정 초기화 완료');
  }

  /* ------------------------------------------------------------------
   * 읽기 가이드 (줄 가이드)
   * ---------------------------------------------------------------- */
  var guideEl = $('#accGuide');
  function renderGuide() {
    if (!guideEl) return;
    guideEl.hidden = !state.guide;
    if (state.guide) root.style.setProperty('--acc-gy', '40px');
  }
  function hideGuide() {
    if (guideEl) guideEl.hidden = true;
  }
  if (guideEl) {
    DOC.addEventListener('mousemove', function (e) {
      if (!state.guide) return;
      root.style.setProperty('--acc-gy', (e.clientY - 24) + 'px');
    });
  }

  /* ------------------------------------------------------------------
   * 읽어주기 (TTS 음성 안내)
   * ---------------------------------------------------------------- */
  var synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  var reading = { on: false, paused: false, queue: [], idx: 0, current: null };
  var ttsStateEl = $('#accTtsState');

  function textCandidates() {
    var roots = [];
    var main = $('#main-content');
    if (main) roots.push(main);
    var foot = $('footer');
    if (foot) roots.push(foot);

    var parts = [];
    // 음성 엔진이 긴 문장을 잘라내는 브라우저가 있어 240자 단위로 청크 분리
    function chunk(el, txt) {
      while (txt.length > 240) {
        var cut = txt.lastIndexOf(' ', 240);
        var at = cut > 120 ? cut : 240;
        parts.push({ el: el, text: txt.slice(0, at).trim() });
        txt = txt.slice(at).trim();
      }
      if (txt) parts.push({ el: el, text: txt });
    }
    roots.forEach(function (r) {
      $all('h1, h2, h3, h4, h5, p, li, td, th, blockquote, dt, dd, figcaption, label', r).forEach(function (el) {
        if (el.getAttribute('aria-hidden') === 'true') return;
        if (el.closest('[data-acc-skip]')) return;
        var rect = el.getBoundingClientRect();
        if (!rect || (!rect.width && !rect.height)) return;
        var txt = (el.textContent || '').trim();
        if (txt.length < 2) return;
        chunk(el, txt);
      });
    });
    return parts;
  }

  function startReading() {
    if (reading.on) { stopReading(); return; }
    if (!synth) { toast('이 브라우저는 음성 읽기를 지원하지 않습니다.'); return; }

    var parts = textCandidates();
    if (!parts.length) { toast('읽을 내용이 없습니다.'); return; }

    var midY = window.innerHeight * 0.35;
    var start = 0;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].el.getBoundingClientRect().bottom >= midY) { start = i; break; }
    }

    reading.queue = parts;
    reading.idx = start;
    reading.on = true;
    reading.paused = false;
    if (ttsStateEl) ttsStateEl.hidden = false;
    setStateText('화면 내용을 차례로 읽어드립니다');
    syncTtsBtn(true);
    speakNext();
  }

  function speakNext() {
    if (!reading.on) return;
    if (reading.idx >= reading.queue.length) {
      stopReading(true);
      toast('전체 읽기를 마쳤습니다');
      return;
    }
    var item = reading.queue[reading.idx];
    var el = item.el;
    clearSpeaking();
    el.classList.add('acc-speaking');
    reading.current = el;
    var r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setStateText(('읽는 중: ' + el.textContent.trim()).slice(0, 40) + '…');

    var u = new SpeechSynthesisUtterance(item.text);
    u.lang = 'ko-KR';
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = function () { reading.idx++; speakNext(); };
    u.onerror = function () { reading.idx++; speakNext(); };
    synth.speak(u);
  }

  function clearSpeaking() {
    if (reading.current) {
      reading.current.classList.remove('acc-speaking');
      reading.current = null;
    }
  }

  function stopReading(quiet) {
    if (synth) synth.cancel();
    clearSpeaking();
    reading.on = false;
    reading.paused = false;
    reading.queue = [];
    reading.idx = 0;
    if (ttsStateEl) ttsStateEl.hidden = true;
    syncTtsBtn(false);
    if (!quiet) toast('읽어주기를 중지했습니다');
  }

  function togglePauseReading() {
    if (!reading.on || !synth) return;
    if (reading.paused) {
      synth.resume();
      reading.paused = false;
      setStateText('계속 읽기');
    } else {
      synth.pause();
      reading.paused = true;
      setStateText('일시정지됨 · 재생 버튼으로 계속');
    }
  }

  function setStateText(txt) {
    var t = $('#accTtsText');
    if (t) t.textContent = txt;
  }

  function syncTtsBtn(on) {
    var b = $('[data-acc="tts"]');
    if (!b) return;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  /* ------------------------------------------------------------------
   * 위젯 열기/닫기
   * ---------------------------------------------------------------- */
  function closePanel(panel, fab) {
    panel.hidden = true;
    if (fab) fab.setAttribute('aria-expanded', 'false');
  }
  function openPanel(panel, fab) {
    panel.hidden = false;
    if (fab) fab.setAttribute('aria-expanded', 'true');
  }
  function togglePanel(panel, fab) {
    if (panel.hidden) openPanel(panel, fab); else closePanel(panel, fab);
  }

  /* ------------------------------------------------------------------
   * 챗봇 (FAQ 자동응답)
   * ---------------------------------------------------------------- */
  var KB = [
    {
      id: 'hours',
      keys: ['진료시간', '진료 시간', '운영시간', '영업시간', '몇시', '몇 시', '몇점', '오픈', '마감', '예약', '휴진', '휴무', '공휴일', '일요일', '주말', '토요일', '일요', '일엔', '언제', '시간'],
      answer: '진료시간을 안내드릴게요.\n\n' +
        '· 평일(월~금): 09:30 ~ 19:00\n' +
        '· 토요일: 09:30 ~ 16:00\n' +
        '· 일요일·공휴일: 휴진 (온라인 스마트 문진은 24시간 연중무휴 운영)\n\n' +
        '⭐ 매주 수요일은 「용인 봄봄솔루션 경매장」 현장 집중 진료일입니다.\n현장 진료·예약은 전화 <a href="tel:' + PHONE + '">' + PHONE + '</a> 로 확인해 주세요.',
      chips: ['오시는 길 알려주세요', '전화 문의', '스마트 문진 사용법']
    },
    {
      id: 'location',
      keys: ['주소', '위치', '오시는 길', '가는길', '가는 길', '지도', '네비', '어디', '방문', '경매장', '봄봄', '선장', '98-8', '찾아'],
      answer: '오시는 길을 안내드릴게요.\n\n' +
        '· 주소: 경기도 용인시 처인구 포곡읍 선장1로 98-8\n' +
        '· 상세: 「용인 봄봄솔루션 경매장」 내 샵인샵 전문 진료센터\n\n' +
        '내비게이션에 "용인 봄봄솔루션" 또는 "선장1로 98-8"을 입력하시면 됩니다.',
      chips: ['진료시간 알려주세요', '파보겔 발주 상담']
    },
    {
      id: 'phone',
      keys: ['전화', '번호', '연락', '콜', '문의처', '전화번호', '상담'],
      answer: '전화·상담 연결을 안내드릴게요.\n\n' +
        '· 대표전화: <a href="tel:' + PHONE + '">' + PHONE + '</a>\n' +
        '· 긴급/상담: <a href="tel:' + HOTLINE + '">' + HOTLINE + '</a>\n\n' +
        '원내 데스크 연결이 어려우신 경우 긴급 번호로 연락 부탁드립니다.',
      chips: ['진료시간 알려주세요', '오시는 길 알려주세요']
    },
    {
      id: 'parvogel',
      keys: ['파보겔', 'parvogel', '파보', '500ml', '500', '대용량', '발주', '주문', '구매', '판매', '공급', '상비', '약', '처방', '가격', '비용', '얼마'],
      answer: '파보겔(Parvogel) 관련 안내드릴게요.\n\n' +
        '에스앤제이는 <strong>파보겔 공식 공급처</strong>로, <strong>500ml 대용량 겔</strong>(초미세 나노 몬모릴로나이트)을 현장 상비·공급합니다.\n\n' +
        '· 정식 급여·교부는 수의사 진료 또는 유선·온라인 사전 진료 확인 후 가능\n' +
        '· 재고·가격·발주는 전화 <a href="tel:' + PHONE + '">' + PHONE + '</a> 또는 B2B 파트너 발주 창구로 확인해 주세요',
      chips: ['B2B 파트너 문의', '전화 문의', '진단키트도 있나요?']
    },
    {
      id: 'triage',
      keys: ['문진', '트리아지', 'triage', '증상', '사용법', '사용', '어떻게', '질문', '체중', '무게', '계산', '요약서', '사전', '스마트', '입력'],
      answer: '스마트 문진 사용법을 안내드릴게요.\n\n' +
        '1️⃣ 상단 「스마트 문진」 탭으로 이동\n' +
        '2️⃣ 반려동물의 증상·정보를 선택하거나 직접 입력\n' +
        '3️⃣ 4단계 트리아지(응급도 판별)와 파보겔 용량 계산 결과 제공\n' +
        '4️⃣ 「진료실 한 장 요약서」 버튼으로 내원용 SOAP 차트 생성 → 출력·저장 가능\n\n' +
        '💡 산책 후 가벼운 조치법부터 즉시 내원이 필요한 응급 수준까지 단계별 행동 가이드를 안내드립니다.',
      chips: ['긴급 증상은 어떻게 하나요?', '파보겔 발주 상담']
    },
    {
      id: 'kit',
      keys: ['진단키트', '진단 키트', '코로나', '브루셀라', '키트', '판독', '검사'],
      answer: '진단키트(검사) 관련 안내드릴게요.\n\n' +
        '파보(CPV)·코로나·브루셀라 진단키트를 공급하며, 결과 <strong>판독 상담</strong>을 원내 수의사가 진행해 드립니다.\n\n' +
        '키트 재고·구매 및 판독 상담 예약은 전화 <a href="tel:' + PHONE + '">' + PHONE + '</a> 로 문의해 주세요.',
      chips: ['파보겔 발주 상담', '전화 문의']
    },
    {
      id: 'b2b',
      keys: ['b2b', '파트너', '번식', '농장', '펫샵', '브리더', '경매', '도매', '픽업', '정기', '단체'],
      answer: 'B2B 파트너 프로그램을 안내드릴게요.\n\n' +
        '번식농장·펫샵 파트너는 전용 발주 라운지에서 파보겔 500ml, 진단키트, 원내 처방약을 패키지로 사전 발주할 수 있습니다.\n\n' +
        '· 수요일 경매장 방문 픽업 연계\n' +
        '· 파트너 문의: 전화 <a href="tel:' + PHONE + '">' + PHONE + '</a> (B2B 담당)\n\n' +
        '파트너 전용 페이지는 B2B 파트너 라운지를 이용해 주세요.',
      chips: ['진료시간 알려주세요', '파보겔 발주 상담']
    },
    {
      id: 'emergency',
      keys: ['긴급', '응급', '경련', '호흡곤란', '호흡 곤란', '숨', '출혈', '많은 피', '쓰러', '위험', '사망', '의식'],
      answer: '⚠️ 긴급 상황입니다. 온라인 상담에 의존하지 마시고 즉시 조치해 주세요.\n\n' +
        '호흡곤란·경련·다량 출혈 등 위급 증상은 즉시 <strong>가까운 24시 동물병원</strong>으로 대면 내원해 주십시오.\n\n' +
        '이동 중 병원 안내가 필요하시면 긴급 상담 <a href="tel:' + HOTLINE + '">' + HOTLINE + '</a> 으로 연락해 주세요.',
      chips: ['오시는 길 알려주세요', '진료시간 알려주세요']
    },
    {
      id: 'vet',
      keys: ['원장', '수의사', '의사', '자격', '면허', '홍순일', '성하정', '진료과', '전문', '경력'],
      answer: '진료진 소개를 해드릴게요.\n\n' +
        '· 대표 원장: 홍순일 수의사 (면허 제5374호) — 소화기내과·외과 임상\n' +
        '· 진료수의사: 성하정 수의사 (면허 제5398호)\n\n' +
        '신생아·소화기 집중 치료 및 파보·코로나 감염 전문 센터로 운영 중입니다.',
      chips: ['진료시간 알려주세요', '파보겔 발주 상담']
    },
    {
      id: 'welcome',
      keys: ['안녕', '반가워', '하이', 'hi', 'hello', '반갑', '고마워'],
      answer: '안녕하세요! 🐾 에스앤제이 동물병원 도우미입니다.\n' +
        '반려동물 건강 관련 궁금하신 점을 편하게 물어봐 주세요.\n' +
        '(예: 진료시간, 오시는 길, 파보겔 발주, 스마트 문진 사용법)',
      chips: ['진료시간 알려주세요', '오시는 길 알려주세요', '파보겔 발주 상담', '스마트 문진 사용법']
    },
    {
      id: 'privacy',
      keys: ['개인정보', '약관', '이용약관', '방침', '정책'],
      answer: '개인정보·약관 안내입니다.\n\n' +
        '페이지 하단의 <a href="javascript:void(0)" onclick="openModal(\'privacyModal\')">개인정보처리방침</a> 및 <a href="javascript:void(0)" onclick="openModal(\'termsModal\')">이용약관</a>에서 전문을 확인하실 수 있습니다.',
      chips: ['진료시간 알려주세요', '전화 문의']
    }
  ];

  var FALLBACK = {
    id: 'fallback',
    answer: '죄송합니다. 자주 묻는 질문에 없는 내용이라 정확한 답변이 어렵습니다. 🙏\n\n' +
      '· 통화 상담: <a href="tel:' + PHONE + '">' + PHONE + '</a>\n' +
      '· 긴급/상담: <a href="tel:' + HOTLINE + '">' + HOTLINE + '</a>\n\n' +
      '직원이 빠르게 도와드릴 수 있도록 아래 버튼을 눌러주세요.',
    chips: ['진료시간 알려주세요', '오시는 길 알려주세요', '파보겔 발주 상담', '스마트 문진 사용법']
  };

  var QUICK_START = ['진료시간 알려주세요', '오시는 길 알려주세요', '파보겔 발주 상담', '스마트 문진 사용법', '전화 문의', '긴급 증상은 어떻게 하나요?'];

  function normalize(txt) {
    return String(txt || '').toLowerCase().replace(/[\s\u00a0]/g, '').replace(/[.,!?~·\-_+=:;'"()\[\]{}<>/\\@#$%^&*|]/g, '');
  }

  function kbMatch(input) {
    var ni = normalize(input);
    var best = null;
    var bestScore = 0;
    KB.forEach(function (entry) {
      var score = 0;
      entry.keys.forEach(function (kw) {
        var nk = normalize(kw);
        if (nk && ni.indexOf(nk) !== -1) score += nk.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    return bestScore > 0 ? best : null;
  }

  var chatPanel = $('#chatPanel');
  var chatFab = $('#chatFab');
  var chatBody = $('#chatMessages');
  var chatChips = $('#chatChips');
  var chatForm = $('#chatForm');
  var chatInput = $('#chatInput');
  var greeted = false;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function addMessage(html, who) {
    var wrap = DOC.createElement('div');
    wrap.className = 'chat-msg ' + who;
    wrap.innerHTML = html;
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
    return wrap;
  }

  function renderChips(list) {
    chatChips.innerHTML = '';
    (list || []).forEach(function (chip) {
      var b = DOC.createElement('button');
      b.type = 'button';
      b.className = 'chat-chip';
      b.textContent = chip;
      b.setAttribute('aria-label', '질문: ' + chip);
      b.addEventListener('click', function () { sendChat(chip); });
      chatChips.appendChild(b);
    });
  }

  function sendChat(text) {
    var t = (text || '').trim();
    if (!t) return;
    addMessage(escapeHtml(t), 'user');
    chatInput.value = '';
    renderChips([]);

    var typing = addMessage('답변 입력 중…', 'bot typing');

    setTimeout(function () {
      var target = kbMatch(text);
      typing.classList.remove('typing');
      typing.innerHTML = target ? target.answer : FALLBACK.answer;
      typing.classList.add('bot');
      renderChips(target ? target.chips : FALLBACK.chips);
    }, 520);
  }

  function openChat() {
    chatPanel.hidden = false;
    chatFab.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      addMessage('안녕하세요! 🐾 에스앤제이 동물병원 인공지능(Q&A) 도우미입니다.<div class="chat-mute-author">질문을 입력하거나 아래 버튼을 눌러주세요.</div>', 'bot');
      renderChips(QUICK_START);
    }
    setTimeout(function () { if (chatInput) chatInput.focus(); }, 60);
  }
  function closeChat() {
    chatPanel.hidden = true;
    chatFab.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------
   * 이벤트 바인딩
   * ---------------------------------------------------------------- */
  function bindAll() {
    if (!accPanel) return;

    accPanel.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-acc]') : null;
      if (!btn) return;
      var act = btn.getAttribute('data-acc');
      switch (act) {
        case 'text-up': setZoom(1); break;
        case 'text-down': setZoom(-1); break;
        case 'text-reset': resetZoom(); break;
        case 'tts': startReading(); break;
        case 'guide': toggleGuide(); break;
        case 'reset-all': resetAll(); break;
        default:
          if (TOGGLE_KEYS.indexOf(act) !== -1) toggleFeature(act);
      }
    });

    var cBtn = $('[data-acc-close]');
    if (cBtn) cBtn.addEventListener('click', function () { closePanel(accPanel, accFab); });

    if (accFab) {
      accFab.addEventListener('click', function () { togglePanel(accPanel, accFab); });
    }
    DOC.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && accPanel && !accPanel.hidden) closePanel(accPanel, accFab);
    });

    var pBtn = $('#accPauseBtn');
    var sBtn = $('#accStopBtn');
    if (pBtn) pBtn.addEventListener('click', togglePauseReading);
    if (sBtn) sBtn.addEventListener('click', function () { stopReading(); });

    if (chatFab) {
      chatFab.addEventListener('click', function () {
        if (chatPanel.hidden) openChat(); else closeChat();
      });
    }
    if (chatForm) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        sendChat(chatInput.value);
      });
    }
    var cClose = $('[data-chat-close]');
    if (cClose) cClose.addEventListener('click', closeChat);
    if (chatPanel) {
      chatPanel.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeChat(); }
      });
    }

    DOC.addEventListener('click', function (e) {
      var t = e.target;
      if (accPanel && !accPanel.hidden && accFab && !accPanel.contains(t) && !accFab.contains(t)) {
        closePanel(accPanel, accFab);
      }
      if (chatPanel && !chatPanel.hidden && chatFab && !chatPanel.contains(t) && !chatFab.contains(t)) {
        closeChat();
      }
    });
  }

  applyState();
  bindAll();
})();