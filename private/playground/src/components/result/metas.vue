<template>
  <div v-if="tags.length" :class="$style.section">
    <div :class="$style.title">{{ t('result.metadata') }}</div>
    <div :class="$style.grid">
      <span v-for="(tag, i) in tags" :key="i" :class="$style.tag">
        <span :class="$style.tagLabel">{{ tag.label }}</span>
        <span :class="$style.tagValue">{{ tag.value }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'

import { computed } from 'vue'
import { formatDuration } from '@root/core/utils'
import { useI18n } from '@root/composables/useI18n'

const props = defineProps<{ metas: Lyric.MetaItem[] }>()

const { t } = useI18n()

const tags = computed(() =>
  props.metas.map((meta) => {
    switch (meta.type) {
      case Lyric.MetaType.Duration:
        return { label: meta.type, value: formatDuration(meta.value) }
      case Lyric.MetaType.Offset:
        return { label: meta.type, value: `${meta.value}ms` }
      case Lyric.MetaType.Creator: {
        const creator = meta.value
        return { label: creator.role || 'Creator', value: creator.name.join(', ') }
      }
      default:
        return { label: meta.type, value: String(meta.value) }
    }
  }),
)
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
  margin-bottom: 10px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
}

.tagLabel {
  color: var(--color-text-muted);
  font-weight: 500;
}

.tagValue {
  color: var(--color-text);
  font-weight: 600;
}
</style>
