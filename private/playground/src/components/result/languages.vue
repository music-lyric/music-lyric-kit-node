<template>
  <div v-if="languages.length" :class="$style.section">
    <div :class="$style.title">{{ t('result.languages') }}</div>
    <div :class="$style.grid">
      <span v-for="(item, i) in languages" :key="i" :class="$style.tag">
        <span :class="$style.tagLabel">{{ item.tag }}</span>
        <span :class="$style.tagValue">{{ item.percent }}%</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'

import { useI18n } from '@root/composables/useI18n'

defineProps<{ languages: Lyric.LanguageItem[] }>()

const { t } = useI18n()
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
