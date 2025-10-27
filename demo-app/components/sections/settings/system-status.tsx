'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { CheckCircle, AlertCircle, XCircle, Bell, Calendar, Activity } from 'lucide-react'

/**
 * Represents the status of a service
 */
export interface ServiceStatus {
  /** Service name */
  name: string
  /** Current status */
  status: 'operational' | 'degraded' | 'down'
  /** Uptime percentage */
  uptime: number
  /** Last time status was checked */
  lastChecked: string
}

/**
 * Represents an incident
 */
export interface Incident {
  /** Unique identifier */
  id: string
  /** Incident title */
  title: string
  /** Current status */
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  /** When the incident started */
  startTime: string
  /** Updates about the incident */
  updates: Array<{ time: string; message: string }>
}

/**
 * Props for the SystemStatus component
 */
export interface SystemStatusProps {
  /** Array of services and their status */
  services: ServiceStatus[]
  /** Active or recent incidents */
  incidents: Incident[]
  /** Scheduled maintenance (optional) */
  maintenance?: Array<{ date: string; description: string }>
  /** Callback when subscribe button is clicked */
  onSubscribe?: () => void
}

const statusConfig = {
  operational: {
    icon: CheckCircle,
    label: 'Operational',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary',
  },
  degraded: {
    icon: AlertCircle,
    label: 'Degraded',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary',
  },
  down: {
    icon: XCircle,
    label: 'Down',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive',
  },
}

const incidentStatusConfig = {
  investigating: { label: 'Investigating', color: 'text-destructive' },
  identified: { label: 'Identified', color: 'text-secondary' },
  monitoring: { label: 'Monitoring', color: 'text-secondary' },
  resolved: { label: 'Resolved', color: 'text-primary' },
}

/**
 * SystemStatus component displays service health indicators and incident information.
 * Shows operational status, uptime, incidents, and maintenance schedule.
 */
export function SystemStatus({ services, incidents, maintenance, onSubscribe }: SystemStatusProps) {
  const allOperational = services.every(s => s.status === 'operational')
  const activeIncidents = incidents.filter(i => i.status !== 'resolved')

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            System Status
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status of all services
          </p>
        </div>
        {onSubscribe && (
          <button
            onClick={onSubscribe}
            className="btn-secondary flex items-center gap-2"
            aria-label="Subscribe to status updates"
          >
            <Bell className="w-4 h-4" />
            Subscribe
          </button>
        )}
      </div>

      {/* Overall Status Banner */}
      <div
        className={`mb-6 p-4 rounded-lg border ${
          allOperational && activeIncidents.length === 0
            ? 'bg-primary/10 border-primary'
            : 'bg-secondary/10 border-secondary'
        }`}
      >
        <div className="flex items-center gap-3">
          {allOperational && activeIncidents.length === 0 ? (
            <>
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  All Systems Operational
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  All services are running normally
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  Some Services Affected
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeIncidents.length} active {activeIncidents.length === 1 ? 'incident' : 'incidents'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Services
        </h3>
        <div className="space-y-3">
          {services.map((service) => {
            const StatusIcon = statusConfig[service.status].icon
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.uptime.toFixed(2)}% uptime • Last checked{' '}
                      {new Date(service.lastChecked).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig[service.status].bg} border ${statusConfig[service.status].border}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig[service.status].color}`} />
                  <span className={`text-sm font-semibold ${statusConfig[service.status].color}`}>
                    {statusConfig[service.status].label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Incidents
          </h3>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-5 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {incident.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Started {new Date(incident.startTime).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${incidentStatusConfig[incident.status].color} bg-muted`}
                  >
                    {incidentStatusConfig[incident.status].label}
                  </span>
                </div>

                {/* Updates Timeline */}
                <div className="space-y-3 mt-4">
                  {incident.updates.map((update, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {update.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(update.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Maintenance */}
      {maintenance && maintenance.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Scheduled Maintenance
          </h3>
          <div className="space-y-3">
            {maintenance.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-primary/10 border border-primary rounded-lg"
              >
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {new Date(item.date).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </EnhancedCard>
  )
}
