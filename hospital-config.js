/**
 * =======================================================================
 * 🐾 VetLink AI - 전국 동물병원 전용 스마트 포털 마스터 환경 설정
 * =======================================================================
 * 이 파일 하나만 수정하면 웹사이트 전체(상호, 수의사, 진료과목, 연락처, 주소)와
 * 원내 비치용 A4 알림판/QR코드가 1초 만에 해당 동물병원 맞춤형으로 자동 완성됩니다.
 * 
 * [현장 특화 정책] 에스앤제이는 봄봄솔루션 경매장 내 샵인샵 특성상
 * 브리더·펫샵 상비 1순위인 파보겔(Parvogel) 단일 공급 체계로 운영
 * - 일반 동물병원 공식 세팅비: 50만 원
 * - 파보겔 공식 공급처 에스앤제이 제휴 동물병원: 25만 원 (50% 특별 지원)
 */

const HOSPITAL_CONFIG = {
  // 1. 병원 및 사업자 기본 정보 (공식 인허가 등록 정보)
  hospitalNameKo: "에스앤제이 동물병원",
  hospitalNameEn: "DR. S & J ANIMAL HOSPITAL",
  branchName: "용인 특화 진료센터",
  businessNumber: "792-66-00615", // 사업자등록번호
  licenseNumber: "제 5620000-010-2025-0002 호", // 동물병원 개설신고확인증 (용인시 처인구청)
  directorName: "홍순일 원장", // 대표 수의사
  vetLicense1: "면허 제 5374 호 (홍순일 수의사)",
  vetLicense2: "면허 제 5398 호 (성하정 수의사)",
  directorTitle: "면허 제5374호 수의사 / 소화기내과·외과 임상",
  
  // 2. 브랜딩 & 로고 이미지
  logoImage: "./sj_logo.png",
  qrImage: "./snj_qr_branded.png",
  portalUrl: "https://snj-vet.com",
  ogImage: "./og-image.png", // 1200x630 SNS 미리보기 전용 (216KB 최적화)
  // 주문 전송 엔드포인트 (선택): 비워두면 로컬 저장 + 클립보드 + 전화/문자 폴백으로 완전 동작
  // 설정 시: Google Apps Script / Formspree / Cloudflare Worker URL 입력 → 자동 POST + 성공 토스트
  // 예: "https://script.google.com/macros/s/AKfyc.../exec"
  // 가이드: https://github.com/hongsoonil02-maker/snj-animal-hospital#order-endpoint-설정
  // Google Apps Script 예제 코드는 ./order-endpoint-example.gs 참고
  orderEndpoint: "",

  // 3. 연락처 및 진료 시간
  phone: "031-321-6562",
  hotline: "010-5407-5708",
  address: "경기도 용인시 처인구 포곡읍 선장1로 98-8",
  hours: {
    regular: "월~금 09:30 ~ 19:00",
    saturday: "토요일 09:30 ~ 16:00",
    specialCare: "매주 수요일 소화기 특화 집중 진료 및 사전 예약 조제",
    closed: "일요일 및 공휴일 휴진 (온라인 스마트 문진 24시간 연중무휴)"
  },

  // 4. 파보겔 공식 공급처 인증 — 현장 샵인샵 특화 (브리더·펫샵 상비 1순위)
  parvogelPartnership: {
    isDistributor: true,
    partnerTier: "PARVOGEL OFFICIAL SUPPLY CENTER",
    partnerBadgeText: "파보겔(Parvogel) 공식 공급처 · 에스앤제이 동물병원",
    prescribedMeds: [
      "파보겔(Parvogel) 500ml 대용량 겔 (초미세 나노 몬모릴로나이트)",
      "진단키트 (파보·코로나·브루셀라)",
      "원내 처방약 (구충제, 항생제, 소염진통제, 점안액, 연고)"
    ]
  },
  // 하위 호환: 기존 코드가 참조하던 monsmectaPartnership 별칭 유지
  get monsmectaPartnership() { return this.parvogelPartnership; },

  // 5. 비즈니스 세팅 정보 (전국 동물병원 공급용)
  builderInfo: {
    engine: "VetLink AI Smart Hospital Engine v1.0",
    regularPrice: "500,000원",
    partnerPrice: "250,000원 (파보겔 공급처 제휴 50% DC)",
    inquiryTel: "031-321-6562 / 010-5407-5708",
    poweredBy: "에스앤제이 동물병원 디지털 헬스케어 사업부"
  }
};

// 브라우저 및 노드 환경 동시 지원
if (typeof window !== 'undefined') {
  window.HOSPITAL_CONFIG = HOSPITAL_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HOSPITAL_CONFIG;
}
