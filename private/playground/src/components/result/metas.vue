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

const props = defineProps<{ meta?: Lyric.Common.Meta }>()

const { t } = useI18n()

const rows = computed<MetaRow[]>(() => {
  const meta = props.meta
  if (!meta) {
    return []
  }

  const result: MetaRow[] = []

  const pushTexts = (label: string, items: Lyric.Common.MetaText[]) => {
    if (items.length) {
      result.push({ label, values: items.map((item) => item.content) })
    }
  }

  pushTexts('title', meta.titles)
  pushTexts('artist', meta.artists)
  pushTexts('album', meta.albums)
  pushTexts('author', meta.authors)
  if (meta.duration) {
    result.push({ label: 'duration', values: [formatDuration(meta.duration)] })
  }
  if (meta.offset) {
    result.push({ label: 'offset', values: [`${meta.offset}ms`] })
  }
  if (meta.isrcs.length) {
    result.push({ label: 'isrc', values: [...meta.isrcs] })
  }
  for (const credit of meta.credits) {
    result.push({ label: credit.role || 'creator', values: credit.names.map((name) => name.content) })
  }
  for (const reference of meta.references) {
    if (reference.ids.length) {
      result.push({ label: reference.platform, values: [...reference.ids], mono: true })
    }
  }
  for (const unknown of meta.unknowns) {
    result.push({ label: unknown.key, values: [unknown.value], mono: true })
  }

  return result
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
