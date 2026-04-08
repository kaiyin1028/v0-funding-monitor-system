# Hong Kong Education Funding Monitor System
# 香港教育資助監測系統

A comprehensive monitoring dashboard for tracking government and foundation funding opportunities for non-profit education organizations in Hong Kong.

專為香港非牟利教育機構設計的資助監測系統，用於追蹤政府及基金會的資助機會。

## Features 功能

- **Real-time Monitoring Dashboard** - Track 18+ funding sources including government departments and foundations
- **Funding Programs Database** - Complete database with filtering, sorting, and favorites
- **Deadline Timeline** - Visual timeline of upcoming application deadlines
- **Excel Export** - Export funding data to CSV format with Chinese character support
- **Calendar Reminders** - Export deadline reminders to ICS calendar format

## Tech Stack 技術架構

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React

## Getting Started 開始使用

### Prerequisites 先決條件

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Ubuntu Setup Ubuntu 安裝

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone the repository
git clone https://github.com/kaiyin1028/v0-funding-monitor-system.git
cd v0-funding-monitor-system

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Development Commands 開發命令

```bash
# Start development server
pnpm dev

# Start with Turbopack (faster)
pnpm dev:turbo

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Project Structure 項目結構

```
├── app/
│   ├── page.tsx              # Main dashboard page 主儀表板頁面
│   ├── database/page.tsx     # Funding programs database 資助計劃數據庫
│   ├── layout.tsx            # Root layout 根佈局
│   └── globals.css           # Global styles & theme 全局樣式
├── components/
│   ├── ui/                   # shadcn/ui components UI組件
│   ├── status-card.tsx       # Statistics cards 統計卡片
│   ├── source-monitor.tsx    # Funding source monitor 資助來源監測
│   ├── funding-table.tsx     # Programs table 計劃表格
│   ├── deadline-timeline.tsx # Deadline timeline 截止日期時間線
│   ├── hero-banner.tsx       # Hero section 主橫幅
│   └── feature-cards.tsx     # Feature showcase 功能展示
├── lib/
│   ├── funding-data.ts       # Funding programs data 資助計劃數據
│   ├── export-utils.ts       # CSV/ICS export utilities 匯出工具
│   └── utils.ts              # Helper utilities 輔助工具
└── public/
    └── images/               # Generated images 生成圖片
```

## Monitoring Sources 監測來源 (18個)

### Government Departments 政府部門
| # | Source 來源 | URL |
|---|-------------|-----|
| 1 | Quality Education Fund (QEF) 優質教育基金 | https://www.qef.org.hk |
| 2 | Innovation and Technology Fund (ITF) 創新科技基金 | https://www.itf.gov.hk |
| 3 | SIE Fund 社會創新及創業發展基金 | https://www.sie.gov.hk |
| 4 | CPCE 公民教育委員會 | https://www.cpce.gov.hk |
| 5 | ECF 環境及自然保育基金 | https://www.ecf.gov.hk |
| 6 | YDF 青年發展基金 | https://www.ydc.gov.hk |
| 7 | SCOLAR 語常會 | https://scolarhk.edb.hkedcity.net |
| 8 | ADC 藝術發展局 | https://www.hkadc.org.hk |
| 9 | CoC 兒童事務委員會 | https://www.coc.gov.hk |
| 10 | HAD 民政事務總署 | https://www.had.gov.hk |
| 11 | Government News 政府新聞網 | https://www.news.gov.hk |

### Foundations & Organizations 基金及機構
| # | Source 來源 | URL |
|---|-------------|-----|
| 12 | HKJC Charities 香港賽馬會慈善信託基金 | https://charities.hkjc.com |
| 13 | Partnership Fund 攜手扶弱基金 | https://www.swd.gov.hk |
| 14 | Cyberport 數碼港 | https://www.cyberport.hk |
| 15 | HKSTP 香港科技園 | https://www.hkstp.org |
| 16 | HKIF 香港創新基金 | https://hkif.org.hk |
| 17 | Chinese Temples Committee 華人廟宇委員會 | https://www.ctc.org.hk |
| 18 | Beat Drugs Fund 禁毒基金 | https://www.nd.gov.hk |

## Future Development 未來開發計劃

### Database Integration 數據庫整合
The system is prepared for database integration. Recommended options:
- **Supabase** - PostgreSQL with real-time subscriptions
- **Neon** - Serverless PostgreSQL
- **PostgreSQL** - Self-hosted on Ubuntu

### AI Integration AI 整合
For automated monitoring and data collection:
- Web scraping with Puppeteer/Playwright
- AI-powered content analysis with OpenAI/Anthropic
- Automated notification system

### Planned Features 計劃功能
- [ ] Database storage for funding programs 資助計劃數據庫儲存
- [ ] Automated web scraping for new funding announcements 自動網頁爬取
- [ ] Email/SMS notification system 電郵/短訊通知系統
- [ ] Application tracking and management 申請追蹤管理
- [ ] AI-powered eligibility matching AI資格配對
- [ ] Multi-user support with authentication 多用戶認證支援

## Environment Variables 環境變量

Create a `.env.local` file for local development:

```env
# Database (when integrated)
DATABASE_URL=

# AI Integration (optional)
OPENAI_API_KEY=

# Notification Service (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below:

[Continue working on v0](https://v0.app/chat/projects/prj_COLFMJEPWDt9kRtK9YslAZC7JiRA)

## License 授權

This project is developed for Hong Kong Education Equipment Industry Association (HKEEIA).
此項目為香港教育裝備行業協會開發。

---

Developed with v0.dev
