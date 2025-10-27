'use client'

import { useState } from 'react'
import { AdherenceChart } from '@/components/peptide/adherence-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Activity, Calendar, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const [adherenceDays, setAdherenceDays] = useState(30)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Track your progress and analyze your injection adherence
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm font-medium">Time Period:</span>
          <div className="flex gap-2">
            <Button
              variant={adherenceDays === 7 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAdherenceDays(7)}
            >
              7 Days
            </Button>
            <Button
              variant={adherenceDays === 30 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAdherenceDays(30)}
            >
              30 Days
            </Button>
            <Button
              variant={adherenceDays === 90 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAdherenceDays(90)}
            >
              90 Days
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Adherence Chart */}
          <AdherenceChart days={adherenceDays} />

          {/* Analytics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Consistency Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  Consistency Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">-</div>
                  <p className="text-sm text-muted-foreground">
                    Based on schedule adherence
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Injections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" />
                  Total Injections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">-</div>
                  <p className="text-sm text-muted-foreground">
                    Last {adherenceDays} days
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Average Gap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Average Gap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">-</div>
                  <p className="text-sm text-muted-foreground">
                    Days between injections
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1 text-blue-700 dark:text-blue-400">
                    Adherence Tracking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your adherence data is calculated based on your scheduled protocols and
                    logged injections. Maintain consistency to see better long-term results.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1 text-green-700 dark:text-green-400">
                    Site Rotation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Remember to rotate injection sites to prevent tissue damage and improve
                    absorption. Track your sites in each injection log.
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1 text-purple-700 dark:text-purple-400">
                    Data Export
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Export your injection data anytime from the backup page to share with your
                    healthcare provider or keep for your records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong className="font-medium text-foreground">Medical Disclaimer:</strong>{' '}
                This app is for tracking purposes only and does not provide medical advice.
                Always consult with your healthcare provider before making changes to your
                medication protocols. Your injection schedules should be prescribed by a licensed
                medical professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
