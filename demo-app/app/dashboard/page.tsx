'use client'

import { ArrowLeft, BarChart3, Users, DollarSign, TrendingUp, Plus, FileText, MessageSquare, Clock } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  MetricCard,
  DashboardStatsGrid,
  ProgressMetrics,
  ActivityFeed,
  RecentItems,
  QuickActions,
} from '@/components/sections'

export default function DashboardPage() {
  const chartPalette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]
  const chartColor = (index: number) => chartPalette[index % chartPalette.length]

  const lineChartData = [
    {
      name: 'Revenue',
      data: [
        { date: 'Jan', value: 4000 },
        { date: 'Feb', value: 3000 },
        { date: 'Mar', value: 5000 },
        { date: 'Apr', value: 4500 },
        { date: 'May', value: 6000 },
        { date: 'Jun', value: 5500 },
      ],
      color: chartColor(0),
    },
  ]

  const barChartData = [
    { label: 'Product A', value: 400, color: chartColor(0) },
    { label: 'Product B', value: 300, color: chartColor(1) },
    { label: 'Product C', value: 600, color: chartColor(2) },
    { label: 'Product D', value: 200, color: chartColor(3) },
  ]

  const pieChartData = [
    { name: 'Desktop', value: 400, color: chartColor(0) },
    { name: 'Mobile', value: 300, color: chartColor(1) },
    { name: 'Tablet', value: 200, color: chartColor(2) },
  ]

  const stats = [
    { id: '1', title: 'Total Revenue', value: '$45,231', change: 20.1, icon: DollarSign, color: 'green' },
    { id: '2', title: 'New Users', value: 1234, change: 15.3, icon: Users, color: 'blue' },
    { id: '3', title: 'Sales', value: 543, change: -2.4, icon: TrendingUp, color: 'purple' },
    { id: '4', title: 'Conversion Rate', value: '3.2%', change: 5.1, icon: BarChart3, color: 'yellow' },
  ]

  const goals = [
    { id: '1', name: 'Q4 Revenue Target', current: 450000, target: 500000, unit: 'USD', deadline: '2024-12-31', color: chartColor(0) },
    { id: '2', name: 'New User Acquisition', current: 8500, target: 10000, unit: 'users', deadline: '2024-11-30', color: chartColor(1) },
  ]

  const activities = [
    { id: '1', user: { name: 'Alice Johnson' }, action: 'created', target: 'Project Alpha', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'create' as const },
    { id: '2', user: { name: 'Bob Smith' }, action: 'updated', target: 'Dashboard Settings', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'update' as const },
    { id: '3', user: { name: 'Carol White' }, action: 'commented on', target: 'Issue #42', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'comment' as const },
  ]

  const recentItems = [
    { id: '1', title: 'Q3 Report.pdf', type: 'Document', lastAccessed: new Date(Date.now() - 3600000).toISOString(), isFavorite: true },
    { id: '2', title: 'Marketing Campaign', type: 'Project', lastAccessed: new Date(Date.now() - 7200000).toISOString(), isFavorite: false },
    { id: '3', title: 'Team Photo.jpg', type: 'Image', lastAccessed: new Date(Date.now() - 10800000).toISOString(), isFavorite: false },
  ]

  const quickActions = [
    { id: '1', label: 'New Project', icon: Plus, onClick: () => {} },
    { id: '2', label: 'Create Report', icon: FileText, badge: 3, onClick: () => {} },
    { id: '3', label: 'Messages', icon: MessageSquare, badge: 12, onClick: () => {} },
    { id: '4', label: 'Schedule', icon: Clock, shortcut: '⌘+S', onClick: () => {} },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h1 className="text-3xl md:text-4xl font-heading">Dashboard</h1>
              </div>
              <p className="text-muted-foreground mt-1">Analytics, metrics, and insights</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <DashboardStatsGrid stats={stats} columns={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart series={lineChartData} title="Revenue Trend" showLegend showGrid />
            <BarChart data={barChartData} title="Product Sales" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart data={pieChartData} title="Device Distribution" variant="donut" centerMetric={{ label: 'Total', value: '900' }} />
            <AreaChart series={lineChartData} title="Revenue Area" gradient />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Active Users" value={2543} change={12.5} trend="up" icon={Users} sparkline={[100, 120, 115, 134, 145, 160, 155]} />
            <MetricCard title="Conversion" value="3.2%" format="percentage" change={0.5} trend="up" icon={TrendingUp} />
            <MetricCard title="Revenue" value={45231} format="currency" change={-2.3} trend="down" icon={DollarSign} />
            <MetricCard title="Orders" value={543} change={0} trend="neutral" icon={BarChart3} />
          </div>
          <ProgressMetrics goals={goals} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={activities} />
            <RecentItems items={recentItems} />
          </div>
          <QuickActions actions={quickActions} columns={4} />
        </div>
      </div>
    </div>
  )
}
