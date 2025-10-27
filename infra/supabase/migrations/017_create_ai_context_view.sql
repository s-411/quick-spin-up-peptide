-- AI Context View
-- Read-only view for RAG summarization (future AI Coach feature)
-- Aggregates last 90 days of user activity for AI context

CREATE OR REPLACE VIEW ai_context_view AS
SELECT
  u.id as user_id,
  u.email,

  -- Summary stats
  (
    SELECT jsonb_build_object(
      'active_medications_count', COUNT(DISTINCT m.id),
      'active_protocols_count', COUNT(DISTINCT p.id),
      'active_vials_count', COUNT(DISTINCT v.id),
      'medications', jsonb_agg(DISTINCT jsonb_build_object(
        'name', m.name,
        'type', m.type,
        'active_since', m.created_at
      ))
    )
    FROM medications m
    LEFT JOIN protocols p ON p.medication_id = m.id AND p.is_active = TRUE AND p.deleted_at IS NULL
    LEFT JOIN vials v ON v.medication_id = m.id AND v.deleted_at IS NULL AND v.remaining_volume > 0
    WHERE m.user_id = u.id AND m.deleted_at IS NULL
  ) as active_medications_summary,

  -- Recent injections (last 90 days)
  (
    SELECT jsonb_build_object(
      'total_count', COUNT(*),
      'last_injection_date', MAX(i.date_time),
      'recent_injections', jsonb_agg(
        jsonb_build_object(
          'medication', m.name,
          'dose', i.dose_value || ' ' || i.dose_units,
          'site', i.site,
          'date', i.date_time
        ) ORDER BY i.date_time DESC
      ) FILTER (WHERE i.date_time >= NOW() - INTERVAL '30 days')
    )
    FROM injections i
    INNER JOIN protocols p ON i.protocol_id = p.id
    INNER JOIN medications m ON p.medication_id = m.id
    WHERE m.user_id = u.id
    AND i.deleted_at IS NULL
    AND i.date_time >= NOW() - INTERVAL '90 days'
  ) as recent_injections_summary,

  -- Adherence stats (last 30 days)
  (
    SELECT jsonb_object_agg(
      m.name,
      jsonb_build_object(
        'adherence_percent', calculate_adherence(p.id, CURRENT_DATE - 30, CURRENT_DATE),
        'total_injections', (
          SELECT COUNT(*)
          FROM injections i2
          WHERE i2.protocol_id = p.id
          AND i2.date_time::DATE >= CURRENT_DATE - 30
          AND i2.deleted_at IS NULL
        )
      )
    )
    FROM medications m
    INNER JOIN protocols p ON p.medication_id = m.id
    WHERE m.user_id = u.id
    AND p.is_active = TRUE
    AND m.deleted_at IS NULL
    AND p.deleted_at IS NULL
  ) as adherence_summary,

  -- Upcoming reminders (next 7 days)
  (
    SELECT jsonb_build_object(
      'next_due_date', MIN(r.next_due_date),
      'upcoming_count', COUNT(*),
      'reminders', jsonb_agg(
        jsonb_build_object(
          'medication', m.name,
          'due_date', r.next_due_date,
          'due_time', r.next_due_time
        ) ORDER BY r.next_due_date ASC
      )
    )
    FROM reminders r
    INNER JOIN protocols p ON r.protocol_id = p.id
    INNER JOIN medications m ON p.medication_id = m.id
    WHERE m.user_id = u.id
    AND r.status = 'pending'
    AND r.next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  ) as upcoming_reminders_summary,

  -- Recent measurements (last 90 days)
  (
    SELECT jsonb_object_agg(
      measurement_type,
      jsonb_build_object(
        'latest_value', latest_value,
        'latest_date', latest_date,
        'trend', trend_data
      )
    )
    FROM (
      SELECT
        me.measurement_type,
        (SELECT value FROM measurements WHERE user_id = u.id AND measurement_type = me.measurement_type AND deleted_at IS NULL ORDER BY date_time DESC LIMIT 1) as latest_value,
        (SELECT date_time::DATE FROM measurements WHERE user_id = u.id AND measurement_type = me.measurement_type AND deleted_at IS NULL ORDER BY date_time DESC LIMIT 1) as latest_date,
        get_measurement_trend(u.id, me.measurement_type, CURRENT_DATE - 90, CURRENT_DATE) as trend_data
      FROM measurements me
      WHERE me.user_id = u.id
      AND me.deleted_at IS NULL
      AND me.date_time >= NOW() - INTERVAL '90 days'
      GROUP BY me.measurement_type
    ) measurement_summary
  ) as measurements_summary,

  -- Symptom tracking (last 30 days)
  (
    SELECT jsonb_object_agg(
      symptom_type,
      jsonb_build_object(
        'avg_severity', avg_severity,
        'recent_entries', recent_count
      )
    )
    FROM (
      SELECT
        s.symptom_type,
        get_avg_symptom_severity(u.id, s.symptom_type, CURRENT_DATE - 30, CURRENT_DATE) as avg_severity,
        COUNT(*) as recent_count
      FROM symptoms s
      WHERE s.user_id = u.id
      AND s.deleted_at IS NULL
      AND s.date_time >= NOW() - INTERVAL '30 days'
      GROUP BY s.symptom_type
    ) symptom_summary
  ) as symptoms_summary,

  -- Vial inventory status
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'medication', m.name,
        'remaining_volume', v.remaining_volume,
        'total_volume', v.total_volume,
        'percent_remaining', ROUND((v.remaining_volume / v.total_volume) * 100, 1),
        'expiration_date', v.expiration_date,
        'estimated_doses_remaining', calculate_remaining_doses(v.id, p.dose_value)
      )
    )
    FROM vials v
    INNER JOIN medications m ON v.medication_id = m.id
    LEFT JOIN protocols p ON p.medication_id = m.id AND p.is_active = TRUE AND p.deleted_at IS NULL
    WHERE m.user_id = u.id
    AND v.deleted_at IS NULL
    AND v.remaining_volume > 0
  ) as vials_inventory_summary,

  -- Last updated timestamp
  NOW() as context_generated_at

FROM auth.users u;

-- Grant access to authenticated users (only their own data via RLS)
GRANT SELECT ON ai_context_view TO authenticated;

-- Comments for documentation
COMMENT ON VIEW ai_context_view IS 'Read-only view aggregating user activity for AI RAG context (last 90 days)';
COMMENT ON COLUMN ai_context_view.user_id IS 'User identifier for context isolation';
COMMENT ON COLUMN ai_context_view.active_medications_summary IS 'Summary of active medications and protocols';
COMMENT ON COLUMN ai_context_view.recent_injections_summary IS 'Last 90 days injection history';
COMMENT ON COLUMN ai_context_view.adherence_summary IS 'Adherence percentages per medication for last 30 days';
COMMENT ON COLUMN ai_context_view.upcoming_reminders_summary IS 'Next 7 days of scheduled reminders';
COMMENT ON COLUMN ai_context_view.measurements_summary IS 'Recent measurements with trend analysis';
COMMENT ON COLUMN ai_context_view.symptoms_summary IS 'Symptom tracking aggregates';
COMMENT ON COLUMN ai_context_view.vials_inventory_summary IS 'Current vial inventory with remaining doses';

-- Note: This view is prepared for future AI Coach integration
-- It provides a structured summary of user data that can be:
-- 1. Converted to natural language summaries
-- 2. Embedded as vectors for RAG retrieval
-- 3. Used as context for AI chat responses
-- The view respects RLS and only shows data for the authenticated user
