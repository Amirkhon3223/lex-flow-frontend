import type {
  DashboardStatsResponse,
  CaseAnalyticsResponse,
  ClientAnalyticsResponse,
  DocumentAnalyticsResponse,
  MeetingAnalyticsResponse,
  FinanceAnalyticsResponse,
  TeamAnalyticsResponse,
} from '@/app/types/analytics/analytics.interfaces';

interface AnalyticsExportData {
  dashboard: DashboardStatsResponse | null;
  cases: CaseAnalyticsResponse | null;
  clients: ClientAnalyticsResponse | null;
  documents: DocumentAnalyticsResponse | null;
  meetings: MeetingAnalyticsResponse | null;
  finance: FinanceAnalyticsResponse | null;
  team: TeamAnalyticsResponse | null;
}

/**
 * Converts analytics data to CSV format and triggers download
 */
export function exportAnalyticsToCSV(data: AnalyticsExportData, userCurrency: string = 'USD'): void {
  const csvLines: string[] = [];

  // Add timestamp
  csvLines.push(`Analytics Report - ${new Date().toLocaleString()}`);
  csvLines.push('');

  // 1. DASHBOARD STATS
  if (data.dashboard) {
    csvLines.push('=== DASHBOARD OVERVIEW ===');
    csvLines.push('Metric,Value,Trend');
    csvLines.push(`Total Cases,${data.dashboard.totalCases},-`);
    csvLines.push(`Active Cases,${data.dashboard.activeCases},${data.dashboard.trends?.activeCases || '-'}`);
    csvLines.push(`Closed Cases,${data.dashboard.closedCases},-`);
    csvLines.push(`Total Clients,${data.dashboard.totalClients},${data.dashboard.trends?.clients || '-'}`);
    csvLines.push(`Total Documents,${data.dashboard.totalDocuments},${data.dashboard.trends?.documents || '-'}`);
    csvLines.push(`Total Meetings,${data.dashboard.totalMeetings},-`);
    csvLines.push(`Upcoming Meetings,${data.dashboard.upcomingMeetings},-`);
    csvLines.push(`Tasks Today,${data.dashboard.tasksToday},-`);
    csvLines.push('');

    // Recent Activity
    if (data.dashboard.recentActivity && data.dashboard.recentActivity.length > 0) {
      csvLines.push('Recent Activity');
      csvLines.push('Timestamp,Type,Title,User');
      data.dashboard.recentActivity.forEach((activity) => {
        csvLines.push(
          `"${activity.timestamp}","${activity.type}","${activity.title}","${activity.userName}"`
        );
      });
      csvLines.push('');
    }
  }

  // 2. CASES ANALYTICS
  if (data.cases) {
    csvLines.push('=== CASES ANALYTICS ===');
    csvLines.push(`Total Cases: ${data.cases.totalCases}`);
    csvLines.push(`Average Progress: ${data.cases.averageProgress}%`);
    csvLines.push('');

    // By Status
    csvLines.push('Cases by Status');
    csvLines.push('Status,Count');
    Object.entries(data.cases.byStatus).forEach(([status, count]) => {
      csvLines.push(`${status},${count}`);
    });
    csvLines.push('');

    // By Priority
    csvLines.push('Cases by Priority');
    csvLines.push('Priority,Count');
    Object.entries(data.cases.byPriority).forEach(([priority, count]) => {
      csvLines.push(`${priority},${count}`);
    });
    csvLines.push('');

    // By Category
    csvLines.push('Cases by Category');
    csvLines.push('Category,Count');
    Object.entries(data.cases.byCategory).forEach(([category, count]) => {
      csvLines.push(`${category},${count}`);
    });
    csvLines.push('');

    // Monthly Trend
    if (data.cases.casesByMonth && data.cases.casesByMonth.length > 0) {
      csvLines.push('Cases by Month');
      csvLines.push('Month,Count');
      data.cases.casesByMonth.forEach((stat) => {
        csvLines.push(`${stat.month},${stat.count}`);
      });
      csvLines.push('');
    }

    // Recent Cases
    if (data.cases.recentCases && data.cases.recentCases.length > 0) {
      csvLines.push('Recent Cases');
      csvLines.push('ID,Title,Client,Priority,Status,Created At');
      data.cases.recentCases.forEach((caseItem) => {
        csvLines.push(
          `"${caseItem.id}","${caseItem.title}","${caseItem.clientName}","${caseItem.priority}","${caseItem.status}","${caseItem.createdAt}"`
        );
      });
      csvLines.push('');
    }
  }

  // 3. CLIENTS ANALYTICS
  if (data.clients) {
    csvLines.push('=== CLIENTS ANALYTICS ===');
    csvLines.push(`Total Clients: ${data.clients.totalClients}`);
    csvLines.push('');

    // By Type
    csvLines.push('Clients by Type');
    csvLines.push('Type,Count');
    Object.entries(data.clients.byType).forEach(([type, count]) => {
      csvLines.push(`${type},${count}`);
    });
    csvLines.push('');

    // By Category
    csvLines.push('Clients by Category');
    csvLines.push('Category,Count');
    Object.entries(data.clients.byCategory).forEach(([category, count]) => {
      csvLines.push(`${category},${count}`);
    });
    csvLines.push('');

    // Monthly Trend
    if (data.clients.clientsByMonth && data.clients.clientsByMonth.length > 0) {
      csvLines.push('Clients by Month');
      csvLines.push('Month,Count');
      data.clients.clientsByMonth.forEach((stat) => {
        csvLines.push(`${stat.month},${stat.count}`);
      });
      csvLines.push('');
    }

    // Top Clients
    if (data.clients.topClients && data.clients.topClients.length > 0) {
      csvLines.push('Top Clients');
      csvLines.push('ID,Name,Type,Category,Cases Count');
      data.clients.topClients.forEach((client) => {
        csvLines.push(
          `"${client.id}","${client.name}","${client.type}","${client.category}",${client.casesCount}`
        );
      });
      csvLines.push('');
    }
  }

  // 4. DOCUMENTS ANALYTICS
  if (data.documents) {
    csvLines.push('=== DOCUMENTS ANALYTICS ===');
    csvLines.push(`Total Documents: ${data.documents.totalDocuments}`);
    csvLines.push(`Total Size: ${formatFileSize(data.documents.totalSize)}`);
    csvLines.push('');

    // By Type
    csvLines.push('Documents by Type');
    csvLines.push('Type,Count');
    Object.entries(data.documents.byType).forEach(([type, count]) => {
      csvLines.push(`${type},${count}`);
    });
    csvLines.push('');

    // By Category
    csvLines.push('Documents by Category');
    csvLines.push('Category,Count');
    Object.entries(data.documents.byCategory).forEach(([category, count]) => {
      csvLines.push(`${category},${count}`);
    });
    csvLines.push('');

    // Monthly Trend
    if (data.documents.documentsByMonth && data.documents.documentsByMonth.length > 0) {
      csvLines.push('Documents by Month');
      csvLines.push('Month,Count');
      data.documents.documentsByMonth.forEach((stat) => {
        csvLines.push(`${stat.month},${stat.count}`);
      });
      csvLines.push('');
    }

    // Recent Documents
    if (data.documents.recentDocuments && data.documents.recentDocuments.length > 0) {
      csvLines.push('Recent Documents');
      csvLines.push('ID,Name,Type,Uploaded By,Created At,File Size');
      data.documents.recentDocuments.forEach((doc) => {
        csvLines.push(
          `"${doc.id}","${doc.name}","${doc.type}","${doc.uploadedBy}","${doc.createdAt}","${formatFileSize(doc.fileSize)}"`
        );
      });
      csvLines.push('');
    }
  }

  // 5. MEETINGS ANALYTICS
  if (data.meetings) {
    csvLines.push('=== MEETINGS ANALYTICS ===');
    csvLines.push(`Total Meetings: ${data.meetings.totalMeetings}`);
    csvLines.push(`Upcoming Count: ${data.meetings.upcomingCount}`);
    csvLines.push(`Completed Count: ${data.meetings.completedCount}`);
    csvLines.push('');

    // By Type
    csvLines.push('Meetings by Type');
    csvLines.push('Type,Count');
    Object.entries(data.meetings.byType).forEach(([type, count]) => {
      csvLines.push(`${type},${count}`);
    });
    csvLines.push('');

    // By Status
    csvLines.push('Meetings by Status');
    csvLines.push('Status,Count');
    Object.entries(data.meetings.byStatus).forEach(([status, count]) => {
      csvLines.push(`${status},${count}`);
    });
    csvLines.push('');

    // Monthly Trend
    if (data.meetings.meetingsByMonth && data.meetings.meetingsByMonth.length > 0) {
      csvLines.push('Meetings by Month');
      csvLines.push('Month,Count');
      data.meetings.meetingsByMonth.forEach((stat) => {
        csvLines.push(`${stat.month},${stat.count}`);
      });
      csvLines.push('');
    }

    // Recent Meetings
    if (data.meetings.recentMeetings && data.meetings.recentMeetings.length > 0) {
      csvLines.push('Recent Meetings');
      csvLines.push('ID,Title,Client,Date,Type,Status');
      data.meetings.recentMeetings.forEach((meeting) => {
        csvLines.push(
          `"${meeting.id}","${meeting.title}","${meeting.clientName || 'N/A'}","${meeting.date}","${meeting.type}","${meeting.status}"`
        );
      });
      csvLines.push('');
    }
  }

  // 6. FINANCE ANALYTICS
  if (data.finance) {
    csvLines.push('=== FINANCE ANALYTICS ===');
    csvLines.push(`Total Revenue: ${formatCurrency(data.finance.totalRevenue, userCurrency)}`);
    csvLines.push(
      `Average Revenue per Case: ${formatCurrency(data.finance.avgRevenuePerCase, userCurrency)}`
    );
    csvLines.push(
      `Average Revenue per Client: ${formatCurrency(data.finance.avgRevenuePerClient, userCurrency)}`
    );
    csvLines.push('');

    // Monthly Revenue
    if (data.finance.revenueByMonth && data.finance.revenueByMonth.length > 0) {
      csvLines.push('Revenue by Month');
      csvLines.push('Month,Amount');
      data.finance.revenueByMonth.forEach((stat) => {
        csvLines.push(`${stat.month},${formatCurrency(stat.amount, userCurrency)}`);
      });
      csvLines.push('');
    }
  }

  // 7. TEAM ANALYTICS
  if (data.team && data.team.lawyers && data.team.lawyers.length > 0) {
    csvLines.push('=== TEAM ANALYTICS ===');
    csvLines.push('Lawyer ID,Name,Cases Count,Won Cases,Revenue');
    data.team.lawyers.forEach((lawyer) => {
      csvLines.push(
        `"${lawyer.id}","${lawyer.name}",${lawyer.casesCount},${lawyer.wonCases},${formatCurrency(lawyer.revenue, userCurrency)}`
      );
    });
    csvLines.push('');
  }

  // Generate CSV content
  const csvContent = csvLines.join('\n');

  // Create downloadable file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics-report-${timestamp}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format currency based on user's preference
 */
function formatCurrency(amount: number, currency: string): string {
  const formatted = amount.toFixed(2);

  switch (currency) {
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    case 'CAD':
      return `C$${formatted}`;
    case 'RUB':
      return `${formatted} ₽`;
    case 'TJS':
      return `${formatted} сом.`;
    case 'UZS':
      return `${formatted} сўм`;
    case 'KZT':
      return `${formatted} ₸`;
    default:
      return `${currency} ${formatted}`;
  }
}
