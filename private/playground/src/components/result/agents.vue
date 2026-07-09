<template>
  <div v-if="agents.length" :class="$style.section">
    <div :class="$style.title">{{ t('result.agents') }}</div>
    <div :class="$style.list">
      <span v-for="(agent, i) in agents" :key="agent.id" :class="$style.tag">
        <span :class="$style.dot" :style="{ background: getAgentColor(i) }"></span>
        {{ agent.names.join(' / ') }}
        <span :class="$style.count">{{ counts.get(agent.id) ?? 0 }} {{ t('result.lines') }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'

import { computed } from 'vue'
import { getAgentColor } from '@root/core/utils'
import { useI18n } from '@root/composables/useI18n'

const props = defineProps<{ agents: Lyric.Runtime.Proto.AgentItem[]; lines: Lyric.Runtime.Proto.Line[] }>()

const { t } = useI18n()

const counts = computed(() => Lyric.Runtime.getAgentLineCounts(props.lines))
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

.list {
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
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.count {
  color: var(--color-text-muted);
  font-size: 12px;
}
</style>
