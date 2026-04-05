import {
  FundingProgram,
  FundingSource,
  categoryLabels,
  statusLabels,
  relevanceLabels,
  sourceCategories,
} from './funding-data'

export function exportProgramsToCSV(
  programs: FundingProgram[],
  filename?: string
): void {
  const headers = [
    '計劃名稱',
    '資助機構',
    '類別',
    '最高資助金額',
    '截止日期',
    '申請狀態',
    '相關程度',
    '優先級別',
    '申請期間',
    '計劃簡介',
    '申請要求',
    '網站連結',
    '來源ID',
  ]

  const rows = programs.map((p) => [
    p.name,
    p.organization,
    categoryLabels[p.category],
    p.maxAmount,
    p.deadline,
    statusLabels[p.status],
    relevanceLabels[p.relevance],
    p.priority.toString(),
    p.applicationPeriod,
    p.description,
    p.requirements.join('; '),
    p.url,
    p.sourceId,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  downloadCSV(
    csvContent,
    filename || `香港教育資助計劃_${formatDateForFilename(new Date())}.csv`
  )
}

export function exportSourcesToCSV(
  sources: FundingSource[],
  filename?: string
): void {
  const headers = [
    '來源名稱',
    '英文名稱',
    '所屬機構',
    '類別',
    '網站連結',
    '監測狀態',
    '最後檢查時間',
  ]

  const rows = sources.map((s) => [
    s.name,
    s.nameEn,
    s.organization,
    sourceCategories[s.category],
    s.url,
    s.status === 'online' ? '正常' : s.status === 'offline' ? '離線' : '檢查中',
    new Date(s.lastChecked).toLocaleString('zh-HK'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  downloadCSV(
    csvContent,
    filename || `監測來源清單_${formatDateForFilename(new Date())}.csv`
  )
}

export function exportFullReportToCSV(
  programs: FundingProgram[],
  sources: FundingSource[]
): void {
  // Create a comprehensive report
  const reportDate = new Date()
  const dateStr = formatDateForFilename(reportDate)

  // Summary section
  const openPrograms = programs.filter((p) => p.status === 'open')
  const upcomingPrograms = programs.filter((p) => p.status === 'upcoming')
  const highRelevancePrograms = programs.filter(
    (p) => p.relevance === 'high' && p.status !== 'closed'
  )
  const onlineSources = sources.filter((s) => s.status === 'online')

  const summarySection = [
    '香港教育資助監測系統 - 完整報告',
    `報告生成日期,${reportDate.toLocaleString('zh-HK')}`,
    '',
    '摘要統計',
    `正在接受申請的計劃,${openPrograms.length}`,
    `即將開放申請的計劃,${upcomingPrograms.length}`,
    `高度相關的計劃,${highRelevancePrograms.length}`,
    `監測來源數量,${sources.length}`,
    `正常運作的來源,${onlineSources.length}`,
    '',
    '',
  ]

  // Programs section
  const programHeaders = [
    '計劃名稱',
    '資助機構',
    '類別',
    '最高資助金額',
    '截止日期',
    '申請狀態',
    '相關程度',
    '計劃簡介',
    '網站連結',
  ]

  const programRows = programs.map((p) => [
    p.name,
    p.organization,
    categoryLabels[p.category],
    p.maxAmount,
    p.deadline,
    statusLabels[p.status],
    relevanceLabels[p.relevance],
    p.description,
    p.url,
  ])

  const programsSection = [
    '資助計劃清單',
    programHeaders.join(','),
    ...programRows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
    '',
    '',
  ]

  // Sources section
  const sourceHeaders = [
    '來源名稱',
    '英文名稱',
    '所屬機構',
    '類別',
    '網站連結',
    '監測狀態',
  ]

  const sourceRows = sources.map((s) => [
    s.name,
    s.nameEn,
    s.organization,
    sourceCategories[s.category],
    s.url,
    s.status === 'online' ? '正常' : s.status === 'offline' ? '離線' : '檢查中',
  ])

  const sourcesSection = [
    '監測來源清單',
    sourceHeaders.join(','),
    ...sourceRows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ]

  const fullReport = [
    ...summarySection,
    ...programsSection,
    ...sourcesSection,
  ].join('\n')

  downloadCSV(fullReport, `香港教育資助監測系統_完整報告_${dateStr}.csv`)
}

function downloadCSV(content: string, filename: string): void {
  // Add BOM for Excel to recognize UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function generateCalendarReminders(programs: FundingProgram[]): string {
  const now = new Date()
  const upcomingDeadlines = programs
    .filter((p) => {
      if (p.deadline.includes('全年')) return false
      const deadline = new Date(p.deadline)
      return deadline >= now && p.status !== 'closed'
    })
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )

  const icsEvents = upcomingDeadlines.map((p) => {
    const deadline = new Date(p.deadline)
    const reminderDate = new Date(deadline)
    reminderDate.setDate(reminderDate.getDate() - 14) // 14 days before

    const formatICSDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    return `BEGIN:VEVENT
DTSTART:${formatICSDate(deadline)}
DTEND:${formatICSDate(deadline)}
SUMMARY:${p.name} - 申請截止
DESCRIPTION:資助機構: ${p.organization}\\n最高資助: ${p.maxAmount}\\n網站: ${p.url}
LOCATION:${p.url}
END:VEVENT`
  })

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HKEEIA//Funding Monitor//ZH
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsEvents.join('\n')}
END:VCALENDAR`
}

export function downloadCalendarReminders(programs: FundingProgram[]): void {
  const icsContent = generateCalendarReminders(programs)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `教育資助申請截止日提醒_${formatDateForFilename(new Date())}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
