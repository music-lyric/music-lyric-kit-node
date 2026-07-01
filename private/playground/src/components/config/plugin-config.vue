<template>
  <aside :class="[$style.sidebar, { [$style.open]: open }]">
    <div :class="$style.head">
      <h2 :class="$style.title">{{ t('panel.plugins') }}</h2>
      <div :class="$style.headActions">
        <button :class="$style.reset" type="button" @click="reset">{{ t('action.reset') }}</button>
        <button :class="$style.close" type="button" :title="t('action.close')" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
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
          <ConfigField v-for="field in def.fields" :key="field.key" :field="field" v-model="states[def.key].values[field.key]" />
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import ConfigField from '@root/components/config/config-field.vue'

import { usePluginConfig } from '@root/composables/usePluginConfig'
import { useI18n } from '@root/composables/useI18n'

defineProps<{ open?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

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
  height: 100%;
  min-height: 0;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-shrink: 0;
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
  flex: 1;
  min-height: 0;
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

.headActions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--motion-fast),
    background var(--motion-fast);

  &:hover {
    color: var(--color-text);
    background: var(--color-bg-subtle);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 960px) {
    display: inline-flex;
  }
}

@media (max-width: 960px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 340px;
    max-width: 86vw;
    max-height: none;
    padding: 16px;
    border: none;
    border-right: 1px solid var(--color-border);
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform var(--motion-slow);
    z-index: 30;
  }

  .sidebar.open {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }
}
</style>
