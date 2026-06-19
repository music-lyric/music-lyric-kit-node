<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.headerRow">
        <div :class="$style.brand">
          <h1 :class="$style.title">{{ t('app.title') }}</h1>
          <span :class="$style.version">v{{ version }}</span>
        </div>
        <button :class="$style.localeBtn" :title="t('app.changeLanguage')" @click="cycleLocale">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span :class="$style.localeLabel">{{ LOCALE_LABELS[locale] }}</span>
        </button>
      </div>
      <p :class="$style.subtitle">{{ t('app.subtitle') }}</p>
    </header>

    <div :class="$style.body">
      <PluginConfig />

      <main :class="$style.content">
      <section :class="$style.panel">
        <div :class="$style.panelHead">
          <h2 :class="$style.panelTitle">{{ t('panel.input') }}</h2>
          <Segmented v-model="parser.format.value" :options="formatOptions" />
        </div>

        <div :class="$style.fields">
          <div :class="$style.infoGrid">
            <LabeledInput v-model="parser.songName.value" :label="t('field.songName')" :placeholder="t('placeholder.songName')" />
            <LabeledInput v-model="parser.singers.value" :label="t('field.singers')" :placeholder="t('placeholder.singers')" :hint="t('hint.singers')" />
          </div>

          <div v-if="parser.format.value === 'lrc'" :class="$style.inputGrid">
            <LabeledTextarea v-model="parser.original.value" :label="t('field.original')" :placeholder="t('placeholder.original')" />
            <LabeledTextarea v-model="parser.translate.value" :label="t('field.translate')" :placeholder="t('placeholder.translate')" />
            <LabeledTextarea v-model="parser.roman.value" :label="t('field.roman')" :placeholder="t('placeholder.roman')" />
          </div>
          <div v-else>
            <LabeledTextarea v-model="parser.ttml.value" :label="t('field.ttml')" :placeholder="t('placeholder.ttml')" tall />
          </div>
        </div>

        <div :class="$style.actions">
          <div :class="$style.engine">
            <span :class="$style.engineLabel">{{ t('label.engine') }}</span>
            <Segmented v-model="parser.engine.value" :options="engineOptions" size="sm" />
          </div>
          <button :class="$style.parseBtn" :disabled="parser.parsing.value" @click="parser.parse">{{ t('action.parse') }}</button>
        </div>
      </section>

      <section :class="$style.panel">
        <div :class="$style.panelHead">
          <h2 :class="$style.panelTitle">{{ t('panel.result') }}</h2>
          <div :class="$style.resultMeta">
            <span v-if="parser.elapsed.value" :class="$style.timing">{{ parser.elapsed.value.toFixed(2) }}ms</span>
            <span v-if="parser.result.value" :class="$style.badge">{{ parser.resultType.value }} / v{{ parser.resultVersion.value }}</span>
          </div>
        </div>

        <div :class="$style.resultBody">
          <div v-if="parser.error.value" :class="$style.error">{{ t(parser.error.value) }}</div>
          <template v-else-if="parser.result.value">
            <ResultMetas :metas="parser.result.value.meta.list" />
            <ResultLanguages :languages="parser.result.value.language.list" />
            <ResultAgents :agents="parser.result.value.agents" />
            <ResultLines :lines="parser.result.value.lines" :agents="parser.result.value.agents" />
          </template>
          <div v-else :class="$style.empty">{{ t('result.empty') }}</div>
        </div>
      </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocaleKey } from '@root/composables/useI18n'

import Segmented from '@root/components/segmented.vue'
import LabeledInput from '@root/components/labeled-input.vue'
import LabeledTextarea from '@root/components/labeled-textarea.vue'
import ResultMetas from '@root/components/result/metas.vue'
import ResultLanguages from '@root/components/result/languages.vue'
import ResultAgents from '@root/components/result/agents.vue'
import ResultLines from '@root/components/result/lines.vue'
import PluginConfig from '@root/components/config/plugin-config.vue'

import { computed, onMounted } from 'vue'
import { useParser } from '@root/composables/useParser'
import { useI18n } from '@root/composables/useI18n'

const version = __APP_VERSION__

const { t, locale, setLocale, available } = useI18n()

const LOCALE_LABELS: Record<LocaleKey, string> = {
  'en-us': 'EN',
  'zh-cn': '中',
}

const cycleLocale = () => {
  const index = available.indexOf(locale.value)
  setLocale(available[(index + 1) % available.length])
}

const formatOptions = computed(() => [
  { value: 'lrc', label: t('format.lrc') },
  { value: 'ttml', label: t('format.ttml') },
])

const engineOptions = computed(() => [
  { value: 'pipeline', label: t('engine.pipeline') },
  { value: 'client', label: t('engine.client') },
])

const parser = useParser()

onMounted(parser.parse)
</script>

<style module lang="scss">
.page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 40px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.body {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.localeBtn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    color var(--motion-fast),
    border-color var(--motion-fast),
    background var(--motion-fast);

  &:hover {
    color: var(--color-primary-strong);
    border-color: var(--color-primary-border);
    background: var(--color-primary-faint);
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.localeLabel {
  min-width: 14px;
  text-align: center;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.version {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-strong);
  background: var(--color-primary-faint);
  border: 1px solid var(--color-primary-border);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 20px;
}

.panelHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panelTitle {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.inputGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.engine {
  display: flex;
  align-items: center;
  gap: 10px;
}

.engineLabel {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.parseBtn {
  padding: 11px 32px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-inverse);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-full);
  transition:
    background var(--motion-fast),
    box-shadow var(--motion-fast),
    transform var(--motion-fast);
  box-shadow: var(--shadow-sm);

  &:hover {
    background: var(--color-primary-strong);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.resultMeta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timing {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
}

.badge {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-strong);
  background: var(--color-primary-faint);
  border-radius: var(--radius-full);
}

.resultBody {
  min-height: 80px;
}

.error {
  padding: 16px;
  font-size: 14px;
  color: var(--color-primary-strong);
  background: var(--color-primary-faint);
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-md);
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 30px;
  font-size: 14px;
}
</style>
