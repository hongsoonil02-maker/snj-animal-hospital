/**
 * =======================================================================
 * 🐾 VetLink AI - 전국 동물병원 전용 스마트 포털 마스터 환경 설정
 * =======================================================================
 * 이 파일 하나만 수정하면 웹사이트 전체(상호, 수의사, 진료과목, 연락처, 주소)와
 * 원내 비치용 A4 알림판/QR코드가 1초 만에 해당 동물병원 맞춤형으로 자동 완성됩니다.
 * 
 * [공급 정책]
 * - 일반 동물병원 공식 세팅비: 50만 원
 * - (주)한국아그로 '몬스멕타' 파트너 동물병원: 25만 원 (50% 특별 지원)
 */

const HOSPITAL_CONFIG = {
  // 1. 병원 기본 정보
  hospitalNameKo: "에스앤제이 동물병원",
  hospitalNameEn: "DR. S & J ANIMAL HOSPITAL",
  branchName: "용인 특화 진료센터",
  directorName: "홍수의사 원장",
  directorTitle: "수의학 박사 / 외과·소화기내과 전문",
  
  // 2. 브랜딩 & 로고 이미지
  logoImage: "./sj_logo.png",
  qrImage: "./snj_qr_branded.png",
  portalUrl: "https://hongsoonil02-maker.github.io/snj-animal-hospital/",

  // 3. 연락처 및 진료 시간
  phone: "031-321-6562",
  hotline: "010-5407-5708",
  address: "경기도 용인시 처인구 포곡읍 선장1로 98-8",
  hours: {
    regular: "월~금 09:30 ~ 19:00",
    saturday: "토요일 09:30 ~ 16:00",
    specialCare: "매주 수요일 전문 B2B 파트너 정기 진료 및 사전 예약 조제",
    closed: "일요일 및 공휴일 휴진 (온라인 AI 문진 24시간 연중무휴)"
  },

  // 4. (주)한국아그로 파트너스 공식 인증
  agroPartnership: {
    isPartner: true,
    partnerTier: "MONSMECTA CERTIFIED CLINIC",
    partnerBadgeText: "한국아그로 몬스멕타 공식 인증 동물병원",
    prescribedMeds: [
      "몬스멕타 (수의사 처방 장 점막 보호제)",
      "파보겔 (신생아 설사 케어 보조제)",
      "신속 진단키트 (파보·코로나·브루셀라)",
      "원내 처방약 (구충제, 항생제, 소염진통제, 점안액, 연고)"
    ]
  },

  // 5. 비즈니스 세팅 정보 (전국 동물병원 공급용)
  builderInfo: {
    engine: "VetLink AI Smart Hospital Engine v1.0",
    regularPrice: "500,000원",
    partnerPrice: "250,000원 (몬스멕타 가맹 50% DC)",
    inquiryTel: "02-6949-5708 / 010-5407-5708",
    poweredBy: "(주)한국아그로 디지털 헬스케어 사업본부"
  }
};

// 브라우저 및 노드 환경 동시 지원
if (typeof window !== 'undefined') {
  window.HOSPITAL_CONFIG = HOSPITAL_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HOSPITAL_CONFIG;
}
