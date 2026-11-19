export interface TrustMetric {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface ComparisonRow {
  criterion: string;
  standardPc: string;
  ictech: string;
}

export interface ApplicationIndustry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  recommendedModels: string[];
  keySpecs: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface HistoryItem {
  year: string;
  events: string[];
}

export const COMPANY_INFO = {
  name: "(주)아이씨테크",
  shortName: "아이씨테크",
  englishName: "ICTech Co., Ltd. (Industrial Computer Technology)",
  tagline: "산업용 컴퓨터 · 산업용 메인보드 · IEI 전문 · 맞춤형 임베디드 솔루션",
  homepage: "http://www.ictech.co.kr/",
  phone: "02-2081-1200",
  fax: "02-2081-1210",
  email: "ICTY@ICTECH.CO.KR",
  salesEmail: "ICTY@ICTECH.CO.KR",
  supportEmail: "ICTY@ICTECH.CO.KR",
  address: "서울 구로구 디지털로30길 31 코오롱빌란트2차 1210호",
  naverMapUrl: "https://naver.me/5dhFtOp5",
  businessHours: "평일 09:00 ~ 18:00 (점심시간 12:30 ~ 13:30)",
  ceo: "강한진",
  logoPath: "/images/ICT_CI_NV_W2.png",
  symbolLogoPath: "/images/ICT_CI_NV_symbol1.png",
  verticalLogoPath: "/images/ICT_CI_NV_H.png",
};

export const COMPANY_HISTORY: HistoryItem[] = [
  {
    year: "2014 ~ 현재",
    events: [
      "(주)아이씨테크 법인 설립 — 고객중심의 신뢰경영 및 산업용 컴퓨팅 전문 공급",
      "IEI(Integration Corp.) 공식 파트너로서 R680E/Q670E 최신 산업용 보드 및 AI 엣지 시스템 공급",
      "스마트팩토리·반도체 광학검사·의료·국방·도로공사 전광판 등 산업 전반 맞춤형 IPC 납품",
    ],
  },
  {
    year: "2007 ~ 2013",
    events: [
      "구로 디지털단지(코오롱빌란트 2차) 본사 사옥 이전",
      "AIMEX(국제 자동화 종합전) 다회 참가 및 임베디드 패널PC·팬리스 솔루션 확대",
    ],
  },
  {
    year: "2000 ~ 2004",
    events: [
      "대만 IEI 한국 공식 수입원 등록 및 국내 유일 Master Distributor 계약 체결",
      "KOFA SHOW · KES SHOW 대만 IEI 공동 참가",
    ],
  },
  {
    year: "1997 ~ 1999",
    events: [
      "1997년 07월 '산업컴퓨터' 설립 및 산업용 보드·시스템 사업 개시",
      "1999년 03월 (주)산업컴퓨터기술 법인 설립 및 SCADA/자동화 제어 솔루션 공급",
    ],
  },
];

export const DELIVERY_REFERENCES: string[] = [
  "반도체 광학 검사장비",
  "현대자동차 · 기아자동차 자동화 설비",
  "포스코(POSCO) 자동화 설비",
  "한국도로공사 전광판 SYSTEM",
  "한국전력 CCTV 망 제어 시스템",
  "의료용 정밀 진단 및 계측 장비",
  "해군 RADAR 및 육군 보안장비 설비",
  "경수·폐수 SCADA 및 하수종말처리장 설비",
  "소방 관제용 SYSTEM 및 전화국 시험장비",
  "대학 · 연구소 및 미디어센터(EBS/메가TV 등)",
];

export const TRUST_METRICS: TrustMetric[] = [
  {
    id: "heritage",
    label: "1997년부터 축적된 노하우",
    value: "28년+ 산업용 전문",
    description: "대만 IEI 공식 파트너십과 수많은 현장 납품 경험으로 최적의 사양을 제안합니다.",
  },
  {
    id: "lifecycle",
    label: "장기 공급 보장",
    value: "최대 7년 EOL 관리",
    description: "산업용 칩셋 로드맵 기반 장기 공급으로 설비 유지보수 리스크를 최소화합니다.",
  },
  {
    id: "custom",
    label: "1:1 맞춤 사양 설계",
    value: "OEM · ODM 커스텀",
    description: "SBC, 백플레인, I/O 포트, 외함 및 BIOS/OS 이미지까지 현장 규격에 맞춥니다.",
  },
  {
    id: "support",
    label: "전담 엔지니어 지원",
    value: "국내 직영 기술지원",
    description: "도입 전 스펙 선정부터 도입 후 트러블슈팅까지 본사 엔지니어가 직접 대응합니다.",
  },
];

export const WHY_ICTECH_COMPARISON: ComparisonRow[] = [
  {
    criterion: "동작 온도 & 방열",
    standardPc: "0~35°C 제한, 쿨링팬 먼지 유입 및 고장 위험",
    ictech: "-20~60°C (최대 -40~85°C) 팬리스 알루미늄 히트싱크 설계",
  },
  {
    criterion: "제품 공급 수명(EOL)",
    standardPc: "6개월~1년 주기 부품 단종, 잦은 사양 변경",
    ictech: "산업용 칩셋 기반 5~7년 장기 동일 사양 공급 보장",
  },
  {
    criterion: "산업용 I/O & 확장성",
    standardPc: "USB/HDMI 위주, 레거시 설비 연동 불가",
    ictech: "RS-232/422/485 다중 포트, PICMG 1.3 백플레인, 다중 2.5GbE, PCI 슬롯 지원",
  },
  {
    criterion: "전원 보호 & 안정성",
    standardPc: "단일 AC 입력, 서지/정전 시 OS 손상 위험",
    ictech: "9~36V DC 광입력, 역전압·서지 보호, Watchdog Timer 기본 탑재",
  },
  {
    criterion: "사후 기술지원",
    standardPc: "단순 부품 교체 위주, 현장 환경 분석 불가",
    ictech: "BIOS 튜닝, UWF 전원보호 세팅, 드라이버 및 현장 트러블슈팅 지원",
  },
];

export const APPLICATION_INDUSTRIES: ApplicationIndustry[] = [
  {
    id: "smart-factory",
    title: "스마트팩토리 & 공정 자동화(FA)",
    subtitle: "PLC 연동 · 설비 제어 · SCADA 터미널",
    description:
      "분진과 진동이 잦은 생산 라인에서 24시간 중단 없이 PLC, 바코드 스캐너, 센서 데이터를 수집·제어합니다.",
    recommendedModels: ["TANK-XM811", "DRPC-240-TGL"],
    keySpecs: ["다중 RS-232/485", "팬리스 방진 설계", "DIN-Rail / 벽면 마운트"],
  },
  {
    id: "machine-vision",
    title: "머신비전 & 반도체 광학 검사",
    subtitle: "고속 카메라 · 다중 PCIe · 프레임 그래버",
    description:
      "고해상도 비전 카메라와 다수의 캡처/모션 보드, GPU 가속 카드를 안정적으로 수용하는 고성능 산업용 플랫폼입니다.",
    recommendedModels: ["IMBA-R680", "PCIE-RPL-Q670"],
    keySpecs: ["LGA1700 12~14세대", "PICMG 1.3 / ATX 확장", "Dual 2.5GbE LAN"],
  },
  {
    id: "kiosk-retail",
    title: "무인 키오스크 & 전광판 제어",
    subtitle: "24시간 연속 구동 · 콤팩트 팬리스",
    description:
      "좁은 내부 공간에서도 발열을 효율적으로 제어하며, 정전 후 자동 복구 기능으로 무인 운영 안정성을 높입니다.",
    recommendedModels: ["KINO-RPL-Q670", "PPC-F15C-RPL"],
    keySpecs: ["초박형 Mini-ITX", "다중 디스플레이 출력", "Auto Power-On"],
  },
  {
    id: "medical-defense",
    title: "의료 · 국방 · 계측 장비",
    subtitle: "저소음 · 전기적 안정성 · 장기 부품 유지",
    description:
      "의료 및 정밀 계측, 보안/관제 장비 규격에 맞춰 전자파 내성을 확보하고 장기간 동일 스펙 보드를 안정 공급합니다.",
    recommendedModels: ["WAFER-EHL", "IPC-4U-R680"],
    keySpecs: ["7년 장기 공급", "ECC 메모리 지원", "레거시 PCI/백플레인 호환"],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "요구 사양 상담",
    description: "설비 환경(온도·진동), 필요 I/O 포트, 백플레인/메인보드 규격 및 예상 수량을 파악합니다.",
    deliverable: "현장 요구사항 체크리스트",
  },
  {
    step: "02",
    title: "최적 모델 · 커스텀 제안",
    description: "IEI 기성 라인업 추천 또는 외함·백플레인·BIOS 커스터마이징이 포함된 최적 견적을 제안합니다.",
    deliverable: "상세 스펙시트 & 견적서",
  },
  {
    step: "03",
    title: "샘플 테스트 및 검증",
    description: "실제 현장 설비 및 고객사 소프트웨어와의 호환성 테스트, 48시간 에이징 검증을 진행합니다.",
    deliverable: "테스트 리포트 & 샘플 장비",
  },
  {
    step: "04",
    title: "양산 납품 & 기술지원",
    description: "동일 리비전(Revision) 관리 하에 안정적으로 양산 납품하며 전담 엔지니어가 사후 지원합니다.",
    deliverable: "OS 이미지 복구 · 기술 매뉴얼",
  },
];

export const CERTIFICATIONS = [
  { code: "IEI Partner", name: "IEI 공식 파트너십", desc: "2000년부터 이어진 IEI 산업용 보드·시스템 전문 공급" },
  { code: "ISO 9001", name: "품질경영시스템 기준", desc: "설계부터 출고 에이징까지 표준 품질 관리 체계 운영" },
  { code: "KC / FCC / CE", name: "국내외 전자파 적합 인증", desc: "산업 환경 전자파 내성(EMS) 및 방사(EMI) 규격 준수" },
  { code: "RoHS / IP65", name: "친환경 및 방진·방수 규격", desc: "유해물질 제한 준수 및 현장형 IP65 패널·인클로저" },
];
