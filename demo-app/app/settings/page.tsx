'use client'

import { ArrowLeft, Settings } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import {
  TeamMembers,
  TeamInvite,
  RolePermissions,
  AuditLog,
  BillingOverview,
  PaymentMethodsSettings,
  InvoiceHistory,
  UsageStats,
  DangerZone,
  SystemStatus,
} from '@/components/sections'
import type { SettingsTeamMember, Role, AuditEvent, Plan, Usage, PaymentMethodSettings, Invoice, UsageMetric, ServiceStatus, Incident } from '@/components/sections'

export default function SettingsPage() {
  // Sample data
  const teamMembers: SettingsTeamMember[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'owner', status: 'active', joinedDate: '2023-01-15' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'admin', status: 'active', joinedDate: '2023-03-20' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'member', status: 'active', joinedDate: '2024-02-10' },
    { id: '4', name: 'David Brown', email: 'david@example.com', role: 'member', status: 'pending', joinedDate: '2024-10-15' },
  ]

  const roles: Role[] = [
    {
      id: '1',
      name: 'Owner',
      description: 'Full access to all features and settings',
      memberCount: 1,
      permissions: [
        { resource: 'Users', actions: { create: true, read: true, update: true, delete: true } },
        { resource: 'Projects', actions: { create: true, read: true, update: true, delete: true } },
        { resource: 'Settings', actions: { create: true, read: true, update: true, delete: true } },
      ],
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Manage most features except billing',
      memberCount: 1,
      permissions: [
        { resource: 'Users', actions: { create: true, read: true, update: true, delete: false } },
        { resource: 'Projects', actions: { create: true, read: true, update: true, delete: true } },
        { resource: 'Settings', actions: { create: false, read: true, update: true, delete: false } },
      ],
    },
  ]

  const auditEvents: AuditEvent[] = [
    { id: '1', timestamp: new Date(Date.now() - 120000).toISOString(), user: { name: 'Alice Johnson' }, action: 'created', resource: 'Project Alpha', ipAddress: '192.168.1.1' },
    { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), user: { name: 'Bob Smith' }, action: 'updated', resource: 'Team Settings', ipAddress: '192.168.1.2' },
  ]

  const currentPlan: Plan = { name: 'Pro', price: 49, billingCycle: 'monthly', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom integrations'] }
  const usage: Usage[] = [
    { resource: 'Projects', current: 15, limit: 50, unit: 'projects' },
    { resource: 'Storage', current: 25, limit: 100, unit: 'GB' },
    { resource: 'API Calls', current: 45000, limit: 100000, unit: 'calls' },
  ]

  const paymentMethods: PaymentMethodSettings[] = [
    { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: '2', type: 'card', last4: '5555', brand: 'Mastercard', expiryMonth: 6, expiryYear: 2026, isDefault: false },
  ]

  const invoices: Invoice[] = [
    { id: '1', number: 'INV-001', date: '2024-10-01', amount: 49, status: 'paid', pdfUrl: '#' },
    { id: '2', number: 'INV-002', date: '2024-09-01', amount: 49, status: 'paid', pdfUrl: '#' },
  ]

  const usageMetrics: UsageMetric[] = [
    { name: 'API Calls', current: 45000, limit: 100000, unit: 'calls', history: [{ date: '2024-10-10', value: 5000 }, { date: '2024-10-11', value: 7000 }], cost: 25 },
    { name: 'Storage', current: 25, limit: 100, unit: 'GB', history: [{ date: '2024-10-10', value: 20 }, { date: '2024-10-11', value: 22 }], cost: 15 },
  ]

  const services: ServiceStatus[] = [
    { name: 'API', status: 'operational', uptime: 99.9, lastChecked: new Date().toISOString() },
    { name: 'Database', status: 'operational', uptime: 99.95, lastChecked: new Date().toISOString() },
    { name: 'CDN', status: 'degraded', uptime: 98.5, lastChecked: new Date().toISOString() },
  ]

  const incidents: Incident[] = [
    { id: '1', title: 'CDN Performance Issues', status: 'monitoring', startTime: new Date(Date.now() - 3600000).toISOString(), updates: [{ time: new Date(Date.now() - 1800000).toISOString(), message: 'We are investigating reports of slow CDN performance.' }] },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <div>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <h1 className="text-3xl md:text-4xl font-heading">Settings & Billing</h1>
              </div>
              <p className="text-muted-foreground mt-1">Team management, billing, and system status</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <TeamMembers members={teamMembers} currentUserId="1" onAddMember={() => {}} />
          <TeamInvite onInvite={() => {}} roles={[{ value: 'admin', label: 'Admin' }, { value: 'member', label: 'Member' }]} />
          <RolePermissions roles={roles} />
          <AuditLog events={auditEvents} />
          <BillingOverview currentPlan={currentPlan} usage={usage} nextBillingDate="2024-11-01" />
          <PaymentMethodsSettings methods={paymentMethods} />
          <InvoiceHistory invoices={invoices} />
          <UsageStats metrics={usageMetrics} billingPeriod={{ start: '2024-10-01', end: '2024-10-31' }} />
          <SystemStatus services={services} incidents={incidents} />
          <DangerZone />
        </div>
      </div>
    </div>
  )
}
