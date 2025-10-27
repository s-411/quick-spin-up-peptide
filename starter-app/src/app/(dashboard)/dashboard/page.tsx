import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdherenceChart } from '@/components/peptide/adherence-chart'
import { Plus, Syringe, Pill, Calendar, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch quick stats
  const { data: medications } = await supabase
    .from('medications')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  const { data: activeVials } = await supabase
    .from('vials')
    .select('id, remaining_volume')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .gt('remaining_volume', 0)

  const { data: activeProtocols } = await supabase
    .from('protocols')
    .select('id, name, dose_value, dose_units')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .eq('is_active', true)

  // Get today's date for upcoming injections
  const today = new Date().toISOString()
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: upcomingReminders } = await supabase
    .from('reminders')
    .select('*, protocols(name, dose_value, dose_units)')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .eq('is_completed', false)
    .gte('scheduled_for', today)
    .lte('scheduled_for', nextWeek)
    .order('scheduled_for', { ascending: true })
    .limit(5)

  const medicationCount = medications?.length || 0
  const activeVialCount = activeVials?.length || 0
  const activeProtocolCount = activeProtocols?.length || 0
  const upcomingCount = upcomingReminders?.length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your peptide therapy, TRT, and GLP-1 protocols
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Medications */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Pill className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{medicationCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Medications</p>
          </div>

          {/* Active Vials */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Syringe className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{activeVialCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Vials</p>
          </div>

          {/* Active Protocols */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{activeProtocolCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Protocols</p>
          </div>

          {/* Upcoming */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{upcomingCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-heading text-xl font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/medications" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Pill className="h-4 w-4 mr-2" />
                  Manage Medications
                </Button>
              </Link>
              <Link href="/injections" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Injection
                </Button>
              </Link>
              <Link href="/protocols" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Protocols
                </Button>
              </Link>
              <Link href="/calendar" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Calendar View
                </Button>
              </Link>
            </div>
          </div>

          {/* Upcoming Injections */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-heading text-xl font-semibold">Upcoming This Week</h3>
            {upcomingReminders && upcomingReminders.length > 0 ? (
              <div className="space-y-3">
                {upcomingReminders.map((reminder: any) => {
                  const scheduledDate = new Date(reminder.scheduled_for)
                  const isToday = scheduledDate.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg border ${
                        isToday ? 'bg-primary/10 border-primary/30' : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {reminder.protocols?.name || 'Injection'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reminder.protocols?.dose_value} {reminder.protocols?.dose_units}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">
                            {isToday
                              ? 'Today'
                              : scheduledDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                          </p>
                          {reminder.scheduled_time && (
                            <p className="text-xs text-muted-foreground">
                              {reminder.scheduled_time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No upcoming injections scheduled</p>
                <Link href="/protocols" className="inline-block mt-3">
                  <Button size="sm" variant="outline">
                    Create Protocol
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Adherence Chart */}
          <div className="lg:col-span-2">
            <AdherenceChart days={30} />
          </div>

          {/* Active Protocols Summary */}
          {activeProtocols && activeProtocols.length > 0 && (
            <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-heading text-xl font-semibold">Active Protocols</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activeProtocols.map((protocol: any) => (
                  <div
                    key={protocol.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <p className="font-medium text-sm mb-1">{protocol.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {protocol.dose_value} {protocol.dose_units}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Getting Started (if empty state) */}
          {medicationCount === 0 && (
            <div className="lg:col-span-2 rounded-lg border border-primary/30 bg-primary/5 p-6">
              <h3 className="mb-4 font-heading text-xl font-semibold">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Add Your Medications</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Start by adding the peptides, TRT, or GLP-1 medications you're using
                    </p>
                    <Link href="/medications">
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Medication
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background text-xs font-bold text-muted-foreground/50">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1 text-muted-foreground">
                      Create Protocols
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Set up dosing schedules and injection protocols
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background text-xs font-bold text-muted-foreground/50">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1 text-muted-foreground">
                      Track Injections
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Log your injections and monitor adherence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
