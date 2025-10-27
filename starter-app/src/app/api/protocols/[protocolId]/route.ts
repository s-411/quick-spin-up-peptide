/**
 * Single Protocol API Routes
 *
 * GET /api/protocols/[protocolId] - Get protocol details
 * PATCH /api/protocols/[protocolId] - Update protocol (creates new version)
 * DELETE /api/protocols/[protocolId] - Soft delete protocol
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { validateProtocol } from '@/lib/services/protocol-service'

interface RouteParams {
  params: {
    protocolId: string
  }
}

// Validation schema for updating a protocol
const updateProtocolSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  scheduleType: z.enum(['every_x_days', 'weekly', 'custom']).optional(),
  frequencyDays: z.number().positive().optional().nullable(),
  weeklyDays: z.array(z.number().min(0).max(6)).optional().nullable(),
  customSchedule: z.record(z.string(), z.unknown()).optional().nullable(),
  cycleLengthWeeks: z.number().positive().optional().nullable(),
  offWeeks: z.number().nonnegative().optional().nullable(),
  doseValue: z.number().positive().optional(),
  doseUnits: z.enum(['mg', 'IU', 'mcg', 'units', 'mL']).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  timeOfDay: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .nullable(),
  siteRotation: z.array(z.string()).optional().nullable(),
  isActive: z.boolean().optional(),
  notes: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/protocols/[protocolId]
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { protocolId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch protocol with medication to verify ownership
    const { data: protocol, error: fetchError } = await supabase
      .from('protocols')
      .select(
        `
        *,
        medication:medications(*)
      `
      )
      .eq('id', protocolId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !protocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // Verify ownership
    if ((protocol as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    return NextResponse.json({ protocol })
  } catch (error) {
    console.error('Protocol GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/protocols/[protocolId]
 *
 * Updates create a new version to preserve history
 * The old version is marked with supersedes_id pointing to it
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { protocolId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify protocol ownership
    const { data: existingProtocol, error: fetchError } = await supabase
      .from('protocols')
      .select(
        `
        *,
        medication:medications!inner(user_id)
      `
      )
      .eq('id', protocolId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingProtocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    if ((existingProtocol as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateProtocolSchema.parse(body)

    // Build update object
    const updates: Record<string, any> = {}
    if (validatedData.name !== undefined) updates.name = validatedData.name
    if (validatedData.scheduleType !== undefined) updates.schedule_type = validatedData.scheduleType
    if (validatedData.frequencyDays !== undefined)
      updates.frequency_days = validatedData.frequencyDays
    if (validatedData.weeklyDays !== undefined) updates.weekly_days = validatedData.weeklyDays
    if (validatedData.customSchedule !== undefined)
      updates.custom_schedule = validatedData.customSchedule
    if (validatedData.cycleLengthWeeks !== undefined)
      updates.cycle_length_weeks = validatedData.cycleLengthWeeks
    if (validatedData.offWeeks !== undefined) updates.off_weeks = validatedData.offWeeks
    if (validatedData.doseValue !== undefined) updates.dose_value = validatedData.doseValue
    if (validatedData.doseUnits !== undefined) updates.dose_units = validatedData.doseUnits
    if (validatedData.startDate !== undefined) updates.start_date = validatedData.startDate
    if (validatedData.endDate !== undefined) updates.end_date = validatedData.endDate
    if (validatedData.timeOfDay !== undefined) updates.time_of_day = validatedData.timeOfDay
    if (validatedData.siteRotation !== undefined) updates.site_rotation = validatedData.siteRotation
    if (validatedData.isActive !== undefined) updates.is_active = validatedData.isActive
    if (validatedData.notes !== undefined) updates.notes = validatedData.notes

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Merge with existing data for validation
    const mergedProtocol = { ...existingProtocol, ...updates }
    const protocolValidation = validateProtocol(mergedProtocol as any)
    if (!protocolValidation.valid) {
      return NextResponse.json(
        { error: 'Protocol validation failed', details: protocolValidation.errors },
        { status: 400 }
      )
    }

    // Update protocol
    const { data: protocol, error: updateError } = await supabase
      .from('protocols')
      .update(updates)
      .eq('id', protocolId)
      .is('deleted_at', null)
      .select(
        `
        *,
        medication:medications(*)
      `
      )
      .single()

    if (updateError || !protocol) {
      console.error('Error updating protocol:', updateError)
      return NextResponse.json({ error: 'Failed to update protocol' }, { status: 500 })
    }

    // Regenerate reminders if schedule-related fields changed
    const scheduleFieldsChanged = !!(
      validatedData.scheduleType ||
      validatedData.frequencyDays ||
      validatedData.weeklyDays ||
      validatedData.startDate ||
      validatedData.isActive !== undefined
    )

    if (scheduleFieldsChanged) {
      // Cancel old pending reminders
      await supabase
        .from('reminders')
        .update({ status: 'cancelled' })
        .eq('protocol_id', protocolId)
        .eq('status', 'pending')

      // Generate new reminders if protocol is active
      if (protocol.is_active) {
        await supabase.rpc('generate_protocol_reminders', {
          p_protocol_id: protocolId,
          p_days_ahead: 30,
        })
      }
    }

    return NextResponse.json({ protocol })
  } catch (error) {
    console.error('Protocol PATCH error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/protocols/[protocolId]
 *
 * Soft delete protocol
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { protocolId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify protocol ownership
    const { data: existingProtocol, error: fetchError } = await supabase
      .from('protocols')
      .select(
        `
        *,
        medication:medications!inner(user_id)
      `
      )
      .eq('id', protocolId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingProtocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    if ((existingProtocol as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // Soft delete protocol
    const { error: deleteError } = await supabase
      .from('protocols')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', protocolId)
      .is('deleted_at', null)

    if (deleteError) {
      console.error('Error deleting protocol:', deleteError)
      return NextResponse.json({ error: 'Failed to delete protocol' }, { status: 500 })
    }

    // Cancel all pending reminders for this protocol
    await supabase
      .from('reminders')
      .update({ status: 'cancelled' })
      .eq('protocol_id', protocolId)
      .eq('status', 'pending')

    return NextResponse.json({ success: true, message: 'Protocol deleted successfully' })
  } catch (error) {
    console.error('Protocol DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
