export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  callout?: {
    title: string;
    items: string[];
  };
  codeBlock?: {
    caption: string;
    code: string;
  };
}

export interface BlogPost {
  slug: string;
  category: "선정 가이드" | "메인보드 · I/O" | "트러블슈팅";
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  author: string;
  authorRole: string;
  tags: string[];
  relatedProductSlugs: string[];
  sections: BlogSection[];
}

export const BLOG_CATEGORIES = ["전체", "선정 가이드", "메인보드 · I/O", "트러블슈팅"] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-fanless-ipc-for-smart-factory",
    category: "선정 가이드",
    title: "공장 자동화 설비에 팬리스(Fanless) 산업용 PC를 도입해야 하는 4가지 이유",
    excerpt:
      "일반 쿨링팬 PC가 생산 라인에서 1년 내 고장 나는 원인을 분석하고, 알루미늄 히트싱크 기반 팬리스 IPC의 총소유비용(TCO) 절감 효과를 정리했습니다.",
    publishedAt: "2026-10-28",
    readTime: "5분",
    author: "김도현 수석 엔지니어",
    authorRole: "아이씨테크 하드웨어 설계팀",
    tags: ["팬리스 PC", "스마트팩토리", "유지보수", "방진설계"],
    relatedProductSlugs: ["tank-xm811", "drpc-240-tgl"],
    sections: [
      {
        id: "failure-cause",
        heading: "1. 현장 고장의 60% 이상은 '쿨링팬과 먼지'에서 시작됩니다",
        paragraphs: [
          "가공 라인, 물류 창고, 포장 공정에는 미세 분진과 오일 미스트가 상시 존재합니다. 일반 PC는 내부 열기를 식히기 위해 외부 공기를 강제로 흡입하므로, 수개월 만에 방열핀이 먼지로 막히고 팬 베어링이 마모됩니다.",
          "쿨링팬이 멈추면 CPU 쓰로틀링(성능 저하)이 발생하거나 시스템이 갑자기 꺼져 생산 라인 전체가 정지하는 큰 손실로 이어집니다.",
        ],
      },
      {
        id: "heatsink-structure",
        heading: "2. 전도(Conduction) 기반 알루미늄 케이스 방열 원리",
        paragraphs: [
          "팬리스 산업용 컴퓨터는 내부 팬 대신 구리 히트파이프와 알루미늄 외함(Chassis) 전체를 거대한 방열판으로 활용합니다. 회전하는 구동부가 없기 때문에 기계적 마모 요소가 0에 가깝습니다.",
        ],
        callout: {
          title: "팬리스 IPC 도입 시 핵심 체크리스트",
          items: [
            "CPU TDP가 팬리스 섀시 방열 한계(보통 15W~35W)에 최적화되어 있는지 확인",
            "제어반 내부에 설치할 경우 주변 온도(+50°C 이상 상승 가능)를 고려한 광온도 모델 선정",
            "산업용 Wide-Temp SSD 및 산업용 등급 메모리 탑재 여부 확인",
          ],
        },
      },
      {
        id: "tco-benefit",
        heading: "3. 초기 도입비보다 유지보수 비용(TCO)이 결정적입니다",
        paragraphs: [
          "일반 PC를 저렴하게 도입하더라도 1년에 1~2회 라인이 멈추고 엔지니어가 출동하는 인건비와 기회비용을 합산하면, 3년 기준 총소유비용은 산업용 팬리스 PC 대비 2.5배 이상 높아집니다.",
        ],
      },
    ],
  },
  {
    slug: "industrial-serial-rs232-rs422-rs485-guide",
    category: "메인보드 · I/O",
    title: "산업용 시리얼 통신(RS-232/422/485) 포트 구성 시 주의사항과 핀맵 정리",
    excerpt:
      "PLC, 인버터, 바코드 리더 연동 시 가장 많이 발생하는 통신 노이즈와 배선 오류를 막기 위한 규격별 차이점 및 BIOS 설정 가이드를 안내합니다.",
    publishedAt: "2026-10-15",
    readTime: "7분",
    author: "박지훈 선임 연구원",
    authorRole: "아이씨테크 기술지원팀",
    tags: ["RS-232", "RS-485", "PLC 연동", "시리얼 핀맵"],
    relatedProductSlugs: ["kino-rpl-q670", "ict-pcie-ser8"],
    sections: [
      {
        id: "protocol-diff",
        heading: "1. RS-232 vs RS-422 vs RS-485 한눈에 비교하기",
        paragraphs: [
          "현장 장비가 요구하는 통신 거리와 연결 대수(1:1 vs 1:N)에 따라 시리얼 규격을 정확히 선택해야 합니다. 특히 15m 이상 장거리 구간이나 모터 인접 구간에서는 차동 신호 방식을 쓰는 RS-422/485가 필수적입니다.",
        ],
        callout: {
          title: "규격별 실무 적용 기준",
          items: [
            "RS-232: 최대 15m, 1:1 통신 — 바코드 스캐너, 전자저울, 단거리 계측기",
            "RS-422: 최대 1,200m, 전이중(Full-Duplex) 1:N — 고속 장거리 PLC 및 서보 제어",
            "RS-485: 최대 1,200m, 반이중(Half-Duplex) 최대 32대 멀티드롭 — Modbus RTU, 전력/온습도 센서망",
          ],
        },
      },
      {
        id: "db9-pinout",
        heading: "2. 아이씨테크 산업용 메인보드 DB9 표준 핀맵",
        paragraphs: [
          "제조사마다 RS-422/485 핀 배치(특히 TX+/TX- 극성)가 달라 현장에서 통신이 안 되는 경우가 많습니다. 아이씨테크 산업용 PC 및 메인보드는 BIOS에서 모드를 전환할 수 있으며 아래 핀맵을 따릅니다.",
        ],
        codeBlock: {
          caption: "DB9 Male 표준 핀맵 (BIOS RS-232 / RS-422 / RS-485 선택)",
          code: `Pin | RS-232  | RS-422 (Full) | RS-485 (Half)
----+---------+---------------+--------------
 1  | DCD     | TXD-          | DATA- (B)
 2  | RXD     | TXD+          | DATA+ (A)
 3  | TXD     | RXD+          | -
 4  | DTR     | RXD-          | -
 5  | GND     | GND           | GND`,
        },
      },
      {
        id: "termination-resistor",
        heading: "3. 종단 저항(120Ω)과 광절연(Isolation)이 필요한 순간",
        paragraphs: [
          "RS-485 통신 거리가 100m를 넘거나 고속 보레이트(115,200bps 이상)를 사용할 때는 라인 양끝 단말에 120Ω 종단 저항을 연결해야 신호 반사를 막을 수 있습니다. 또한 대형 모터·용접기 주변이라면 메인보드 손상을 방지하기 위해 2.5kV 절연형 시리얼 확장 카드 사용을 권장합니다.",
        ],
      },
    ],
  },
  {
    slug: "windows-iot-ltsc-uwf-power-protection",
    category: "트러블슈팅",
    title: "산업용 PC 윈도우 임베디드(LTSC) 환경에서 전원 차단 보호(UWF) 설정하기",
    excerpt:
      "설비 메인 차단기를 바로 내리는 현장 환경에서 OS 파일 손상 및 부팅 불량을 막는 Windows 10/11 IoT Enterprise LTSC의 UWF(Unified Write Filter) 실전 설정법입니다.",
    publishedAt: "2026-09-29",
    readTime: "6분",
    author: "이서준 매니저",
    authorRole: "아이씨테크 OS/소프트웨어 지원팀",
    tags: ["Windows IoT", "UWF", "전원차단보호", "OS 최적화"],
    relatedProductSlugs: ["tank-xm811", "ppc-f15c-rpl"],
    sections: [
      {
        id: "why-uwf",
        heading: "1. 정상 종료 없이 전원을 꺼도 OS가 망가지지 않게 하려면?",
        paragraphs: [
          "자동화 설비나 키오스크 현장에서는 PC의 '시스템 종료' 버튼을 누르지 않고 분전반 메인 스위치를 바로 차단하는 경우가 매우 흔합니다. 이때 디스크에 쓰기 작업이 진행 중이었다면 블루스크린이나 파일 시스템 손상이 발생할 수 있습니다.",
          "Windows IoT Enterprise LTSC에 기본 내장된 UWF(통합 쓰기 필터)를 활성화하면, C: 드라이브로 가는 모든 쓰기 요청을 RAM 오버레이로 우회시켜 전원 차단 시에도 SSD 원본 상태를 100% 보호합니다.",
        ],
      },
      {
        id: "uwf-command",
        heading: "2. PowerShell/명령 프롬프트로 UWF 활성화 및 예외 폴더 지정",
        paragraphs: [
          "설비 로그나 생산 데이터(예: D:\\Logs 또는 C:\\AppData)는 재부팅 후에도 남아야 하므로, C: 드라이브 전체를 보호하되 특정 폴더나 레지스트리는 예외(Exclusion) 처리하는 것이 실무 표준입니다.",
        ],
        codeBlock: {
          caption: "관리자 권한 CMD에서 UWF 설정 예시",
          code: `# 1. UWF 필터 활성화
uwfmgr filter enable

# 2. C: 드라이브 쓰기 보호 적용
uwfmgr volume protect C:

# 3. 생산 로그 저장 폴더 예외 추가 (영구 저장)
uwfmgr file add-exclusion C:\\ICTech_Logs

# 4. RAM 오버레이 최대 크기 2048MB 설정 및 재부팅
uwfmgr overlay set-size 2048
shutdown /r /t 0`,
        },
      },
      {
        id: "support-tip",
        heading: "3. 아이씨테크 출고 전 OS 이미지 세팅 서비스",
        paragraphs: [
          "고객사 양산 장비의 경우 아이씨테크에서 UWF, Auto-Login, 방화벽, 불필요한 윈도우 업데이트 차단까지 완료된 골든 이미지(Golden Image)를 복제하여 즉시 가동 상태로 납품해 드립니다.",
        ],
      },
    ],
  },
  {
    slug: "industrial-motherboard-lifecycle-and-eol",
    category: "선정 가이드",
    title: "일반 메인보드 vs 산업용 메인보드: 7년 장기 공급(EOL 관리)이 중요한 이유",
    excerpt:
      "장비 개발 후 1년 만에 메인보드가 단종되어 기구 설계와 인증을 다시 받아야 했던 사례를 통해 산업용 임베디드 보드의 선택 기준을 짚어봅니다.",
    publishedAt: "2026-09-12",
    readTime: "4분",
    author: "김도현 수석 엔지니어",
    authorRole: "아이씨테크 하드웨어 설계팀",
    tags: ["산업용 메인보드", "EOL 관리", "장기공급", "OEM 설계"],
    relatedProductSlugs: ["imba-r680", "pcie-rpl-q670", "wafer-ehl"],
    sections: [
      {
        id: "consumer-risk",
        heading: "1. 상용 메인보드의 잦은 리비전 변경이 부르는 재인증 비용",
        paragraphs: [
          "일반 PC용 메인보드는 1년 남짓한 주기로 단종(EOL)되며, 같은 모델명이라도 원가 절감을 위해 LAN 칩셋이나 사운드 코덱, 백패널 위치가 예고 없이 변경되곤 합니다.",
          "의료·계측·방산·반도체 장비처럼 한 번 KC/CE/UL 인증을 받고 5~10년간 동일 사양으로 양산해야 하는 B2B 고객사에게는 치명적인 공급망 리스크가 됩니다.",
        ],
      },
      {
        id: "embedded-roadmap",
        heading: "2. Intel Embedded 로드맵과 사전 단종 예고(PCN/EOL)",
        paragraphs: [
          "아이씨테크가 공급하는 모든 산업용 메인보드는 Intel 임베디드 로드맵 프로세서 및 칩셋을 채택하여 최소 5년에서 7년 이상 동일 리비전(BOM Fixed) 공급을 보장합니다.",
        ],
        callout: {
          title: "아이씨테크 장기 공급 관리 프로세스",
          items: [
            "부품 변경 시 최소 6개월 전 PCN(제품 변경 통지서) 사전 발송",
            "단종(EOL) 예정 시 12개월 전 Last-Time Buy(최종 물량 확보) 안내",
            "후속 세대 모델 1:1 핀 호환 및 OS 마이그레이션 기술지원",
          ],
        },
      },
    ],
  },
];

