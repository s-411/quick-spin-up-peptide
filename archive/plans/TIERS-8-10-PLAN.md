# Tiers 8-10 Implementation Plan

## Overview
This document provides a detailed implementation plan for Tiers 8, 9, and 10 of the MM Design System. Each tier contains 10 components following established patterns.

---

## TIER 8: Admin & Settings Sections (Part 2)
**Focus**: Team management, billing, and advanced admin features

### Components to Build:

#### 1. TeamMembers (`components/sections/settings/team-members.tsx`)
```typescript
interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending'
  joinedDate: string
}

interface TeamMembersProps {
  members: TeamMember[]
  onAddMember?: () => void
  onEditMember?: (id: string) => void
  onRemoveMember?: (id: string) => void
  currentUserId: string
}
```
**Key Features**: Member grid, role badges, add/remove actions, pending invitations section

#### 2. TeamInvite (`components/sections/settings/team-invite.tsx`)
```typescript
interface TeamInviteProps {
  onInvite?: (emails: string[], role: string, message?: string) => void
  roles: Array<{ value: string; label: string }>
  isInviting?: boolean
}
```
**Key Features**: Email input (single/bulk), role selector, custom message, preview

#### 3. RolePermissions (`components/sections/settings/role-permissions.tsx`)
```typescript
interface Permission {
  resource: string
  actions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  memberCount: number
}

interface RolePermissionsProps {
  roles: Role[]
  onCreateRole?: (role: Omit<Role, 'id' | 'memberCount'>) => void
  onEditRole?: (id: string, role: Partial<Role>) => void
  onDeleteRole?: (id: string) => void
}
```
**Key Features**: Permission matrix, role CRUD, inheritance visualization

#### 4. AuditLog (`components/sections/settings/audit-log.tsx`)
```typescript
interface AuditEvent {
  id: string
  timestamp: string
  user: { name: string; avatar?: string }
  action: string
  resource: string
  details?: string
  ipAddress?: string
}

interface AuditLogProps {
  events: AuditEvent[]
  onFilter?: (filters: { user?: string; action?: string; dateRange?: [Date, Date] }) => void
  onExport?: () => void
}
```
**Key Features**: Filterable activity feed, date range picker, export logs

#### 5. BillingOverview (`components/sections/settings/billing-overview.tsx`)
```typescript
interface Plan {
  name: string
  price: number
  billingCycle: 'monthly' | 'annual'
  features: string[]
}

interface Usage {
  resource: string
  current: number
  limit: number
  unit: string
}

interface BillingOverviewProps {
  currentPlan: Plan
  usage: Usage[]
  nextBillingDate: string
  onUpgrade?: () => void
  onDowngrade?: () => void
}
```
**Key Features**: Plan card, usage metrics, billing info, upgrade CTAs

#### 6. PaymentMethods (`components/sections/settings/payment-methods.tsx`)
```typescript
interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

interface PaymentMethodsProps {
  methods: PaymentMethod[]
  onAddMethod?: () => void
  onSetDefault?: (id: string) => void
  onRemoveMethod?: (id: string) => void
}
```
**Key Features**: Card list, add/remove, set default, billing address

#### 7. InvoiceHistory (`components/sections/settings/invoice-history.tsx`)
```typescript
interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  pdfUrl?: string
}

interface InvoiceHistoryProps {
  invoices: Invoice[]
  onDownload?: (id: string) => void
  onEmail?: (id: string) => void
  onFilter?: (dateRange: [Date, Date]) => void
}
```
**Key Features**: Invoice list, download PDF, filter by date, status badges

#### 8. UsageStats (`components/sections/settings/usage-stats.tsx`)
```typescript
interface UsageMetric {
  name: string
  current: number
  limit: number
  unit: string
  history: Array<{ date: string; value: number }>
  cost?: number
}

interface UsageStatsProps {
  metrics: UsageMetric[]
  billingPeriod: { start: string; end: string }
}
```
**Key Features**: Usage graphs, progress bars, cost breakdown, overage warnings

#### 9. DangerZone (`components/sections/settings/danger-zone.tsx`)
```typescript
interface DangerZoneProps {
  onTransferOwnership?: () => void
  onDeactivateAccount?: () => void
  onDeleteAccount?: () => void
  onExportData?: () => void
}
```
**Key Features**: Critical actions, confirmation modals, verification steps

#### 10. SystemStatus (`components/sections/settings/system-status.tsx`)
```typescript
interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  lastChecked: string
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  startTime: string
  updates: Array<{ time: string; message: string }>
}

interface SystemStatusProps {
  services: ServiceStatus[]
  incidents: Incident[]
  maintenance?: Array<{ date: string; description: string }>
  onSubscribe?: () => void
}
```
**Key Features**: Service indicators, incident timeline, maintenance schedule

---

## TIER 9: Dashboard & Analytics Sections
**Focus**: Data visualization, metrics, and dashboard widgets

### Components to Build:

#### 1. LineChart (`components/sections/dashboard/line-chart.tsx`)
```typescript
interface DataPoint {
  date: string
  value: number
  label?: string
}

interface DataSeries {
  name: string
  data: DataPoint[]
  color?: string
}

interface LineChartProps {
  series: DataSeries[]
  title?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  yAxisLabel?: string
  xAxisLabel?: string
}
```
**Implementation**: Use Recharts or Chart.js for rendering

#### 2. BarChart (`components/sections/dashboard/bar-chart.tsx`)
```typescript
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  title?: string
  orientation?: 'vertical' | 'horizontal'
  stacked?: boolean
  showValues?: boolean
}
```

#### 3. PieChart (`components/sections/dashboard/pie-chart.tsx`)
```typescript
interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  title?: string
  variant?: 'pie' | 'donut'
  showLegend?: boolean
  showPercentages?: boolean
  centerMetric?: { label: string; value: string }
}
```

#### 4. AreaChart (`components/sections/dashboard/area-chart.tsx`)
```typescript
interface AreaChartProps {
  series: DataSeries[]
  title?: string
  stacked?: boolean
  gradient?: boolean
}
```

#### 5. MetricCard (`components/sections/dashboard/metric-card.tsx`)
```typescript
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ComponentType
  sparkline?: number[]
  format?: 'number' | 'currency' | 'percentage'
}
```

#### 6. StatsGrid (`components/sections/dashboard/stats-grid.tsx`)
```typescript
interface Stat {
  id: string
  title: string
  value: string | number
  change?: number
  icon?: React.ComponentType
  color?: string
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
  onClick?: (id: string) => void
}
```

#### 7. ProgressMetrics (`components/sections/dashboard/progress-metrics.tsx`)
```typescript
interface Goal {
  id: string
  name: string
  current: number
  target: number
  unit: string
  deadline?: string
  color?: string
}

interface ProgressMetricsProps {
  goals: Goal[]
  onViewDetails?: (id: string) => void
}
```

#### 8. ActivityFeed (`components/sections/dashboard/activity-feed.tsx`)
```typescript
interface Activity {
  id: string
  user: { name: string; avatar?: string }
  action: string
  target?: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'comment'
}

interface ActivityFeedProps {
  activities: Activity[]
  onLoadMore?: () => void
  onFilter?: (type?: Activity['type']) => void
}
```

#### 9. RecentItems (`components/sections/dashboard/recent-items.tsx`)
```typescript
interface RecentItem {
  id: string
  title: string
  type: string
  thumbnail?: string
  lastAccessed: string
  isFavorite?: boolean
}

interface RecentItemsProps {
  items: RecentItem[]
  onItemClick?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  onClearHistory?: () => void
}
```

#### 10. QuickActions (`components/sections/dashboard/quick-actions.tsx`)
```typescript
interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType
  badge?: number
  shortcut?: string
  onClick: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
  columns?: 2 | 3 | 4
}
```

---

## TIER 10: Communication & Social Sections
**Focus**: Messaging, social interactions, and collaboration

### Components to Build:

#### 1. ChatInterface (`components/sections/social/chat-interface.tsx`)
```typescript
interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isOwn: boolean
  attachments?: Array<{ url: string; name: string; type: string }>
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage?: (content: string, attachments?: File[]) => void
  isTyping?: boolean
  typingUser?: string
}
```

#### 2. ChatList (`components/sections/social/chat-list.tsx`)
```typescript
interface Conversation {
  id: string
  participants: Array<{ name: string; avatar?: string }>
  lastMessage: string
  timestamp: string
  unreadCount: number
  isGroup: boolean
}

interface ChatListProps {
  conversations: Conversation[]
  activeConversationId?: string
  onSelect?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}
```

#### 3. MessageThread (`components/sections/social/message-thread.tsx`)
```typescript
interface ThreadMessage extends Message {
  replies?: ThreadMessage[]
  replyCount?: number
}

interface MessageThreadProps {
  message: ThreadMessage
  onReply?: (parentId: string, content: string) => void
  collapsed?: boolean
}
```

#### 4. DirectMessage (`components/sections/social/direct-message.tsx`)
```typescript
interface DirectMessageProps {
  onSend?: (recipientIds: string[], content: string, attachments?: File[]) => void
  users: Array<{ id: string; name: string; avatar?: string }>
  isSending?: boolean
}
```

#### 5. CommentSection (`components/sections/social/comment-section.tsx`)
```typescript
interface Comment {
  id: string
  author: { name: string; avatar?: string }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  sortBy?: 'newest' | 'oldest' | 'popular'
  onAddComment?: (content: string, parentId?: string) => void
  onLike?: (id: string) => void
  onDelete?: (id: string) => void
}
```

#### 6. CommentForm (`components/sections/social/comment-form.tsx`)
```typescript
interface CommentFormProps {
  onSubmit?: (content: string, mentions: string[], attachments?: File[]) => void
  placeholder?: string
  showFormatting?: boolean
  mentionableUsers?: Array<{ id: string; name: string; avatar?: string }>
}
```

#### 7. ReactionBar (`components/sections/social/reaction-bar.tsx`)
```typescript
interface Reaction {
  emoji: string
  count: number
  userIds: string[]
  isReacted: boolean
}

interface ReactionBarProps {
  reactions: Reaction[]
  onReact?: (emoji: string) => void
  availableReactions?: string[]
}
```

#### 8. UserCard (`components/sections/social/user-card.tsx`)
```typescript
interface UserCardProps {
  user: {
    id: string
    name: string
    username: string
    avatar?: string
    bio?: string
    followers: number
    following: number
    posts: number
    isOnline?: boolean
  }
  isFollowing?: boolean
  onFollow?: () => void
  onMessage?: () => void
  onShare?: () => void
}
```

#### 9. FollowButton (`components/sections/social/follow-button.tsx`)
```typescript
interface FollowButtonProps {
  isFollowing: boolean
  followerCount?: number
  onToggle?: () => void
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}
```

#### 10. SharePanel (`components/sections/social/share-panel.tsx`)
```typescript
interface SharePanelProps {
  url: string
  title: string
  description?: string
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy'>
  onShare?: (platform: string) => void
  shareCount?: number
}
```

---

## Implementation Checklist

### For Each Component:
- [ ] Create TypeScript interface with JSDoc comments
- [ ] Use `'use client'` directive
- [ ] Import necessary icons from lucide-react
- [ ] Use EnhancedCard with `tilt={false} glowEffect={false}`
- [ ] Use `btn-mm` and `btn-secondary` for buttons
- [ ] Implement dark mode with vibrant colors (500 shades)
- [ ] Add responsive design (mobile-first)
- [ ] Include loading and error states
- [ ] Add proper ARIA labels
- [ ] Test keyboard navigation

### Directory Structure:
```
components/sections/
├── settings/      (Tier 8: 10 components)
│   ├── team-members.tsx
│   ├── team-invite.tsx
│   ├── role-permissions.tsx
│   ├── audit-log.tsx
│   ├── billing-overview.tsx
│   ├── payment-methods.tsx
│   ├── invoice-history.tsx
│   ├── usage-stats.tsx
│   ├── danger-zone.tsx
│   └── system-status.tsx
├── dashboard/     (Tier 9: 10 components)
│   ├── line-chart.tsx
│   ├── bar-chart.tsx
│   ├── pie-chart.tsx
│   ├── area-chart.tsx
│   ├── metric-card.tsx
│   ├── stats-grid.tsx
│   ├── progress-metrics.tsx
│   ├── activity-feed.tsx
│   ├── recent-items.tsx
│   └── quick-actions.tsx
└── social/        (Tier 10: 10 components)
    ├── chat-interface.tsx
    ├── chat-list.tsx
    ├── message-thread.tsx
    ├── direct-message.tsx
    ├── comment-section.tsx
    ├── comment-form.tsx
    ├── reaction-bar.tsx
    ├── user-card.tsx
    ├── follow-button.tsx
    └── share-panel.tsx
```

### Demo Pages to Create:
```
app/
├── settings/page.tsx    (Tier 8 demo)
├── dashboard/page.tsx   (Tier 9 demo)
└── social/page.tsx      (Tier 10 demo)
```

### Export Updates:
Update `components/sections/index.ts` for each tier with all component exports and type exports.

### Home Page Updates:
Add navigation buttons for Tiers 8, 9, and 10 to `app/page.tsx`.

---

## Recommended Libraries for Charts (Tier 9):
- **Recharts** (Recommended): React-native charts library
  ```bash
  npm install recharts
  ```
- **Alternative**: Chart.js with react-chartjs-2
- **Alternative**: Victory (for more customization)

---

## Tips for Implementation:

1. **Start with Tier 8**: Team management components are most similar to existing patterns
2. **Use existing components as templates**: Reference Tier 6 (UserProfile, OrderHistory) for patterns
3. **Mock data**: Create comprehensive sample data for each demo page
4. **Incremental testing**: Test each component individually before building the demo page
5. **Dark mode**: Always test dark mode with vibrant 500 shades
6. **Responsive**: Test on mobile, tablet, and desktop viewports

---

## Estimated Time per Tier:
- **Tier 8**: ~4-6 hours (10 settings components)
- **Tier 9**: ~6-8 hours (10 chart/dashboard components + chart library integration)
- **Tier 10**: ~5-7 hours (10 social/communication components)

**Total**: 15-21 hours for Tiers 8-10

---

**End of Plan Document**
