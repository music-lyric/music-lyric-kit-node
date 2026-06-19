<template>
  <aside :class="$style.sidebar">
    <div :class="$style.head">
      <h2 :class="$style.title">{{ t('panel.plugins') }}</h2>
      <button :class="$style.reset" type="button" @click="reset">{{ t('action.reset') }}</button>
    </div>

    <div :class="$style.list">
      <section v-for="def in defs" :key="def.key" :class="[$style.plugin, { [$style.disabled]: !states[def.key].enabled }]">
        <label :class="$style.pluginHead">
          <span :class="$style.pluginName">{{ t(def.labelKey) }}</span>
          <button
            type="button"
            role="switch"
            :aria-checked="states[def.key].enabled"
            :class="[$style.switch, { [$style.on]: states[def.key].enabled }]"
            @click="toggle(def.key, !states[def.key].enabled)"
          >
            <span :class="$style.knob"></span>
          </button>
        </label>

        <div v-if="states[def.key].enabled && def.fields.length" :class="$style.fields">
          <ConfigField
            v-for="field in def.fields"
            :key="field.key"
            :field="field"
            v-model="states[def.key].values[field.key]"
          />
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ConfigField from '@root/components/config/config-field.vue'

import { usePluginConfig } from '@root/composables/usePluginConfig'
import { useI18n } from '@root/composables/useI18n'

const { states, defs, reset, toggle } = usePluginConfig()

const { t } = useI18n()
</script>

<style module lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  align-self: start;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.reset {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    color var(--motion-fast),
    border-color var(--motion-fast);

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.plugin {
  padding: 12px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  transition: opacity var(--motion-fast);
}

.disabled {
  opacity: 0.6;
}

.pluginHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
}

.pluginName {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-soft);
}

.switch {
  flex-shrink: 0;
  position: relative;
  width: 38px;
  height: 22px;
  padding: 0;
  background: var(--color-border-strong);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background var(--motion-fast);

  &.on {
    background: var(--color-primary);
  }
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--color-text-inverse);
  border-radius: 50%;
  transition: transform var(--motion-fast);

  .on & {
    transform: translateX(16px);
  }
}
</style>
