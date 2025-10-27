'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { InjectionSite } from '@/types'
import { User, MapPin } from 'lucide-react'

interface InjectionSiteSelectorProps {
  value?: InjectionSite
  onChange?: (site: InjectionSite) => void
  recentSites?: InjectionSite[]
  showRecent?: boolean
}

const INJECTION_SITES: { value: InjectionSite; label: string; region: string }[] = [
  { value: 'abdomen_upper_left', label: 'Left Abdomen', region: 'Abdomen' },
  { value: 'abdomen_upper_right', label: 'Right Abdomen', region: 'Abdomen' },
  { value: 'left_thigh', label: 'Left Thigh', region: 'Legs' },
  { value: 'right_thigh', label: 'Right Thigh', region: 'Legs' },
  { value: 'left_glute', label: 'Left Glute', region: 'Glutes' },
  { value: 'right_glute', label: 'Right Glute', region: 'Glutes' },
  { value: 'left_delt', label: 'Left Shoulder', region: 'Shoulders' },
  { value: 'right_delt', label: 'Right Shoulder', region: 'Shoulders' },
]

const REGIONS = ['Abdomen', 'Legs', 'Glutes', 'Shoulders']

export function InjectionSiteSelector({
  value,
  onChange,
  recentSites = [],
  showRecent = true,
}: InjectionSiteSelectorProps) {
  const [selectedSite, setSelectedSite] = useState<InjectionSite | undefined>(value)

  const handleSelect = (site: InjectionSite) => {
    setSelectedSite(site)
    onChange?.(site)
  }

  const sitesByRegion = REGIONS.map(region => ({
    region,
    sites: INJECTION_SITES.filter(s => s.region === region),
  }))

  const getSiteUsageCount = (site: InjectionSite): number => {
    return recentSites.filter(s => s === site).length
  }

  const getMostRecentSite = (): InjectionSite | null => {
    return recentSites.length > 0 ? recentSites[0] : null
  }

  const mostRecentSite = getMostRecentSite()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          Injection Site
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Sites Warning */}
        {showRecent && mostRecentSite && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">
              Last injection site
            </p>
            <p className="text-sm text-muted-foreground">
              {INJECTION_SITES.find(s => s.value === mostRecentSite)?.label} - Consider rotating to
              a different site
            </p>
          </div>
        )}

        {/* Visual Body Map (Simplified) */}
        <div className="relative bg-muted/30 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <User className="h-32 w-32 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xs text-muted-foreground">
              Select an injection site from the list below
            </p>
          </div>
        </div>

        {/* Site Selection by Region */}
        <div className="space-y-3">
          {sitesByRegion.map(({ region, sites }) => (
            <div key={region} className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {region}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sites.map(site => {
                  const usageCount = getSiteUsageCount(site.value)
                  const isRecent = recentSites.slice(0, 3).includes(site.value)
                  const isSelected = selectedSite === site.value

                  return (
                    <Button
                      key={site.value}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSelect(site.value)}
                      className={`justify-start relative ${
                        isRecent && !isSelected ? 'border-yellow-500/30 bg-yellow-500/5' : ''
                      }`}
                    >
                      <span className="flex-1 text-left">{site.label}</span>
                      {usageCount > 0 && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {usageCount}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Site Display */}
        {selectedSite && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-xs font-medium text-primary mb-1">Selected Site</p>
            <p className="text-sm font-medium">
              {INJECTION_SITES.find(s => s.value === selectedSite)?.label}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
