<template>
  <div :class="$style.section">
    <div :class="$style.title">
      {{ t('result.linesTitle') }}
      <span :class="$style.count">({{ lines.length }})</span>
    </div>

    <div v-if="!lines.length" :class="$style.empty">{{ t('result.noLines') }}</div>

    <div v-else :class="$style.list">
      <template v-for="(line, i) in lines" :key="i">
        <div v-if="line.type === Lyric.LineType.Interlude" :class="$style.interlude">
          <span :class="$style.interludeTime">{{ interludeTime(line as Lyric.LineInterlude) }}</span>
          <span :class="$style.interludeLabel">{{ t('result.interlude') }}</span>
          <span :class="$style.interludeDots"></span>
        </div>
        <ResultLine v-else :line="line as Lyric.LineNormal" :agents="agents" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'
import ResultLine from './line.vue'

import { formatTime } from '@root/core/utils'
import { useI18n } from '@root/composables/useI18n'

defineProps<{
  lines: Lyric.Line[]
  agents: Lyric.Agent[]
}>()

const { t } = useI18n()

const interludeTime = (line: Lyric.LineInterlude) => `${formatTime(line.time.start)} ~ ${formatTime(line.time.end)}`
</script>

<style module lang="scss">
.section {
  margin-bottom: 0;
}

.title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.count {
  font-weight: 400;
  color: var(--color-text-muted);
  text-transform: none;
  letter-spacing: 0;
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 30px;
  font-size: 14px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list > * {
  // skip layout and paint for rows scrolled off-screen; a long song emits hundreds of rows.
  content-visibility: auto;
  contain-intrinsic-size: auto 40px;
}

.interlude {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);

  &:hover {
    background: var(--color-bg-alt);
  }
}

.interludeTime {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 110px;
  text-align: right;
}

.interludeLabel {
  font-size: 12px;
  font-style: italic;
  color: var(--color-text-muted);
}

.interludeDots {
  flex: 1;
  border-bottom: 1px dashed var(--color-border-strong);
}
</style>
