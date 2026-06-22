<template>
  <div v-if="rows.length" :class="$style.section">
    <div :class="$style.title">{{ t('result.metadata') }}</div>
    <div :class="$style.list">
      <template v-for="(row, i) in rows" :key="i">
        <span :class="[$style.label, { [$style.mono]: row.mono }]">{{ row.label }}</span>
        <div :class="$style.values">
          <span v-for="(value, j) in row.values" :key="j" :class="$style.chip">{{ value }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'

import { computed } from 'vue'
import { formatDuration } from '@root/core/utils'
import { useI18n } from '@root/composables/useI18n'

interface MetaRow {
  /**
   * Display label, the meta type for known kinds and the raw key for unknown ones.
   */
  label: string
  /**
   * Every value carried by this label, each rendered as its own chip.
   */
  values: string[]
  /**
   * Whether the label is a raw source key, rendered in monospace.
   */
  mono?: boolean
}

const props = defineProps<{ metas: Lyric.MetaItem[] }>()

const { t } = useI18n()

const toRow = (meta: Lyric.MetaItem): MetaRow => {
  switch (meta.type) {
    case Lyric.MetaType.Duration:
      return { label: meta.type, values: [formatDuration(meta.value)] }
    case Lyric.MetaType.Offset:
      return { label: meta.type, values: [`${meta.value}ms`] }
    case Lyric.MetaType.Creator:
      return { label: meta.value.role || meta.type, values: meta.value.name }
    case Lyric.MetaType.Unknown:
      return { label: meta.key, values: [String(meta.value)], mono: true }
    default:
      return { label: meta.type, values: [String(meta.value)] }
  }
}

const rows = computed<MetaRow[]>(() => {
  const known: Lyric.MetaItem[] = []
  const unknown: Lyric.MetaItem[] = []
  for (const meta of props.metas) {
    ;(meta.type === Lyric.MetaType.Unknown ? unknown : known).push(meta)
  }

  // one row per label, every value of that label trailing as its own chip; unknowns sink to the bottom.
  const merged = new Map<string, MetaRow>()
  for (const meta of [...known, ...unknown]) {
    const row = toRow(meta)
    const existing = merged.get(row.label)
    if (existing) {
      existing.values.push(...row.values)
    } else {
      merged.set(row.label, row)
    }
  }

  return [...merged.values()]
})
</script>

<style module lang="scss">
.section {
  margin-bottom: 20px;
}

.title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.list {
  display: grid;
  grid-template-columns: max-content 1fr;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.label {
  display: flex;
  align-items: flex-start;
  padding: 12px 14px;
  background: var(--color-bg-subtle);
  border-right: 1px solid var(--color-border-soft);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.mono {
  font-family: var(--font-mono);
  text-transform: none;
  letter-spacing: 0;
  color: var(--color-text-secondary);
}

.values {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
}

// row divider across both columns, from the second row onward.
.list > *:nth-child(n + 3) {
  border-top: 1px solid var(--color-border-soft);
}

.chip {
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-sm);
  word-break: break-word;
}
</style>
