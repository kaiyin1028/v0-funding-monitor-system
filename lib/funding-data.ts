export interface FundingSource {
  id: string
  name: string
  nameEn: string
  organization: string
  url: string
  status: 'online' | 'offline' | 'checking'
  lastChecked: string
  category: 'government' | 'fund' | 'corporate' | 'other'
}

export interface FundingProgram {
  id: string
  name: string
  organization: string
  sourceId: string
  category: 'education' | 'innovation' | 'youth' | 'environment' | 'social' | 'culture'
  maxAmount: string
  deadline: string
  status: 'open' | 'upcoming' | 'closed'
  relevance: 'high' | 'medium' | 'low'
  description: string
  url: string
  requirements: string[]
  applicationPeriod: string
  priority: number
}

export const fundingSources: FundingSource[] = [
  {
    id: 'qef',
    name: '優質教育基金',
    nameEn: 'Quality Education Fund',
    organization: '教育局',
    url: 'https://www.qef.org.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'sie',
    name: '社會創新及創業發展基金',
    nameEn: 'SIE Fund',
    organization: '效率促進辦公室',
    url: 'https://www.sie.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  },
  {
    id: 'itf',
    name: '創新科技基金',
    nameEn: 'Innovation and Technology Fund',
    organization: '創新科技署',
    url: 'https://www.itf.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'pfd',
    name: '攜手扶弱基金',
    nameEn: 'Partnership Fund for the Disadvantaged',
    organization: '社會福利署',
    url: 'https://www.swd.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  },
  {
    id: 'ecf',
    name: '環境及自然保育基金',
    nameEn: 'Environment and Conservation Fund',
    organization: '環境及生態局',
    url: 'https://www.ecf.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  },
  {
    id: 'cpce',
    name: '公民教育活動資助計劃',
    nameEn: 'Civic Education Activity Grant',
    organization: '公民教育委員會',
    url: 'https://www.cpce.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'ydc',
    name: '青年發展基金',
    nameEn: 'Youth Development Fund',
    organization: '民政及青年事務局',
    url: 'https://www.ydc.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  },
  {
    id: 'hkjc',
    name: '香港賽馬會慈善信託基金',
    nameEn: 'HKJC Charities Trust',
    organization: '香港賽馬會',
    url: 'https://charities.hkjc.com',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'corporate'
  },
  {
    id: 'scolar',
    name: '語文教育及研究常務委員會',
    nameEn: 'SCOLAR',
    organization: '教育局',
    url: 'https://scolarhk.edb.hkedcity.net',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'cyberport',
    name: '數碼港',
    nameEn: 'Cyberport',
    organization: '數碼港管理有限公司',
    url: 'https://www.cyberport.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'corporate'
  },
  {
    id: 'hkstp',
    name: '香港科技園',
    nameEn: 'HKSTP',
    organization: '香港科技園公司',
    url: 'https://www.hkstp.org',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'corporate'
  },
  {
    id: 'hkadc',
    name: '藝術發展局',
    nameEn: 'Hong Kong Arts Development Council',
    organization: '香港藝術發展局',
    url: 'https://www.hkadc.org.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'coc',
    name: '兒童事務委員會',
    nameEn: 'Commission on Children',
    organization: '勞工及福利局',
    url: 'https://www.coc.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'bdf',
    name: '禁毒基金',
    nameEn: 'Beat Drugs Fund',
    organization: '禁毒處',
    url: 'https://www.nd.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  },
  {
    id: 'had',
    name: '民政事務總署社區資助',
    nameEn: 'HAD Community Funding',
    organization: '民政事務總署',
    url: 'https://www.had.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'ctc',
    name: '華人廟宇委員會',
    nameEn: 'Chinese Temples Committee',
    organization: '華人廟宇委員會',
    url: 'https://www.ctc.org.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'other'
  },
  {
    id: 'news',
    name: '政府新聞網',
    nameEn: 'Government News',
    organization: '政府新聞處',
    url: 'https://www.news.gov.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'government'
  },
  {
    id: 'hkif',
    name: '香港創新基金',
    nameEn: 'Hong Kong Innovation Foundation',
    organization: '香港創新基金',
    url: 'https://hkif.org.hk',
    status: 'online',
    lastChecked: new Date().toISOString(),
    category: 'fund'
  }
]

export const fundingPrograms: FundingProgram[] = [
  {
    id: 'qef-ai',
    name: '「智」為學理 AI 教育撥款計劃',
    organization: '優質教育基金',
    sourceId: 'qef',
    category: 'education',
    maxAmount: '不設上限',
    deadline: '2026-07-31',
    status: 'open',
    relevance: 'high',
    description: '20億港元專項撥款，支援學校及非牟利機構推行AI教學項目，提升學生人工智能素養。',
    url: 'https://www.qef.org.hk',
    requirements: ['註冊非牟利機構', '具備教育相關經驗', '項目須涉及AI/創科教育'],
    applicationPeriod: '第16期: 2026年4月-7月',
    priority: 1
  },
  {
    id: 'qef-priority',
    name: '優先主題計劃 - STEAM教育',
    organization: '優質教育基金',
    sourceId: 'qef',
    category: 'education',
    maxAmount: '$200,000',
    deadline: '2026-07-31',
    status: 'open',
    relevance: 'high',
    description: '資助推廣STEAM教育、創科教育及跨學科學習的創新項目。',
    url: 'https://www.qef.org.hk',
    requirements: ['學校或非牟利機構', '項目須配合優先主題', '具備執行能力'],
    applicationPeriod: '第16期: 2026年4月-7月',
    priority: 1
  },
  {
    id: 'pfd-main',
    name: '攜手扶弱基金 - 教育支援項目',
    organization: '社會福利署',
    sourceId: 'pfd',
    category: 'social',
    maxAmount: '配對基金形式',
    deadline: '2026-10-30',
    status: 'open',
    relevance: 'high',
    description: '以配對基金形式資助為基層學生提供課後學習支援、創科教育體驗等服務。',
    url: 'https://www.swd.gov.hk',
    requirements: ['非牟利機構', '需獲企業捐款配對', '服務對象為弱勢社群'],
    applicationPeriod: '2025年12月18日 - 2026年10月30日',
    priority: 2
  },
  {
    id: 'itf-gsp',
    name: '一般支援計劃 (GSP)',
    organization: '創新科技署',
    sourceId: 'itf',
    category: 'innovation',
    maxAmount: '視項目規模而定',
    deadline: '全年接受申請',
    status: 'open',
    relevance: 'high',
    description: '資助非研發項目，包括會議、展覽、研討會、工作坊、青年創科活動等。',
    url: 'https://www.itf.gov.hk',
    requirements: ['指定機構類別', '推廣創新科技', '活動須在香港舉行'],
    applicationPeriod: '全年接受申請',
    priority: 2
  },
  {
    id: 'sie-capacity',
    name: '能力提升計劃',
    organization: '社會創新及創業發展基金',
    sourceId: 'sie',
    category: 'social',
    maxAmount: '視項目規模而定',
    deadline: '2026-06-30',
    status: 'open',
    relevance: 'high',
    description: '支援機構提升營運能力，發展創新的社會服務模式。',
    url: 'https://www.sie.gov.hk',
    requirements: ['非牟利機構', '具創新元素', '能產生社會影響'],
    applicationPeriod: '2026年上半年',
    priority: 2
  },
  {
    id: 'cpce-grant',
    name: '公民教育活動資助計劃 2026-27',
    organization: '公民教育委員會',
    sourceId: 'cpce',
    category: 'education',
    maxAmount: '$150,000',
    deadline: '2026-10-31',
    status: 'upcoming',
    relevance: 'high',
    description: '資助推廣愛國主義教育、中華文化、憲法基本法及核心價值的活動。',
    url: 'https://www.cpce.gov.hk',
    requirements: ['非牟利機構', '活動須具公民教育元素', '惠及青年及學生'],
    applicationPeriod: '預計2026年9-10月接受申請',
    priority: 3
  },
  {
    id: 'ecf-education',
    name: '環保教育和社區參與項目',
    organization: '環境及自然保育基金',
    sourceId: 'ecf',
    category: 'environment',
    maxAmount: '$200,000',
    deadline: '2026-08-31',
    status: 'upcoming',
    relevance: 'medium',
    description: '資助環保教育活動，可結合創科元素推廣綠色科技及可持續發展。',
    url: 'https://www.ecf.gov.hk',
    requirements: ['非牟利機構', '環保教育主題', '具社區參與元素'],
    applicationPeriod: '2026年下半年',
    priority: 3
  },
  {
    id: 'ydf-exchange',
    name: '青年交流資助計劃',
    organization: '青年發展委員會',
    sourceId: 'ydc',
    category: 'youth',
    maxAmount: '視項目規模而定',
    deadline: '2026-05-31',
    status: 'upcoming',
    relevance: 'medium',
    description: '資助青年參與國際及內地交流活動，可結合創科主題。',
    url: 'https://www.ydc.gov.hk',
    requirements: ['非牟利機構', '服務對象為青年', '具交流元素'],
    applicationPeriod: '2026年上半年',
    priority: 3
  },
  {
    id: 'scolar-grant',
    name: '語文教育支援資助計劃',
    organization: '語常會',
    sourceId: 'scolar',
    category: 'education',
    maxAmount: '$500,000',
    deadline: '2026-01-05',
    status: 'closed',
    relevance: 'medium',
    description: '資助創新語文教育計劃，可結合科技元素提升語文學習效能。',
    url: 'https://scolarhk.edb.hkedcity.net',
    requirements: ['學校或非牟利機構', '語文教育相關', '具創新元素'],
    applicationPeriod: '2025/26-2026/27學年',
    priority: 4
  },
  {
    id: 'hkjc-stem',
    name: '賽馬會創科教育計劃',
    organization: '香港賽馬會慈善信託基金',
    sourceId: 'hkjc',
    category: 'education',
    maxAmount: '視項目規模而定',
    deadline: '全年接受建議書',
    status: 'open',
    relevance: 'high',
    description: '大型創科教育慈善項目，如CoolThink編程教育計劃。需主動提案。',
    url: 'https://charities.hkjc.com',
    requirements: ['具規模的非牟利機構', '大型教育項目', '需提交詳細建議書'],
    applicationPeriod: '全年接受建議書',
    priority: 2
  },
  {
    id: 'hkif-stem',
    name: '創科教育推廣計劃',
    organization: '香港創新基金',
    sourceId: 'hkif',
    category: 'education',
    maxAmount: '視合作模式而定',
    deadline: '全年接受',
    status: 'open',
    relevance: 'high',
    description: '為基層學生提供免費STEAM課程及創科體驗活動。',
    url: 'https://hkif.org.hk',
    requirements: ['非牟利機構', '服務基層學生', '創科教育相關'],
    applicationPeriod: '全年接受合作申請',
    priority: 2
  },
  {
    id: 'cyberport-edu',
    name: '數碼港教育合作計劃',
    organization: '數碼港',
    sourceId: 'cyberport',
    category: 'innovation',
    maxAmount: '視項目而定',
    deadline: '全年接受',
    status: 'open',
    relevance: 'medium',
    description: '與學校及機構合作推廣數碼科技教育及創業培訓。',
    url: 'https://www.cyberport.hk',
    requirements: ['具創科教育經驗', '可合作推廣活動'],
    applicationPeriod: '全年',
    priority: 3
  },
  {
    id: 'bdf-prevention',
    name: '禁毒教育資助計劃',
    organization: '禁毒基金',
    sourceId: 'bdf',
    category: 'youth',
    maxAmount: '$300,000',
    deadline: '2026-09-30',
    status: 'upcoming',
    relevance: 'low',
    description: '資助針對青年的禁毒教育及預防活動，可結合創新教育模式。',
    url: 'https://www.nd.gov.hk',
    requirements: ['非牟利機構', '禁毒教育主題', '服務青年'],
    applicationPeriod: '2026年下半年',
    priority: 4
  },
  {
    id: 'coc-children',
    name: '兒童福祉及發展資助計劃',
    organization: '兒童事務委員會',
    sourceId: 'coc',
    category: 'social',
    maxAmount: '$100,000',
    deadline: '2026-07-31',
    status: 'upcoming',
    relevance: 'medium',
    description: '資助促進兒童身心發展的活動，包括創科教育體驗。',
    url: 'https://www.coc.gov.hk',
    requirements: ['非牟利機構', '服務兒童', '具創新元素'],
    applicationPeriod: '2026年',
    priority: 3
  }
]

export const categoryLabels: Record<FundingProgram['category'], string> = {
  education: '教育',
  innovation: '創新科技',
  youth: '青年發展',
  environment: '環境保育',
  social: '社會服務',
  culture: '文化藝術'
}

export const statusLabels: Record<FundingProgram['status'], string> = {
  open: '正在接受申請',
  upcoming: '即將開放',
  closed: '已截止'
}

export const relevanceLabels: Record<FundingProgram['relevance'], string> = {
  high: '高度相關',
  medium: '中度相關',
  low: '低度相關'
}

export const sourceCategories: Record<FundingSource['category'], string> = {
  government: '政府部門',
  fund: '專項基金',
  corporate: '企業機構',
  other: '其他來源'
}
