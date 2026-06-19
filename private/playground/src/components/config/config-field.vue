<template>
  <div :class="[$style.field, { [$style.row]: field.type === 'boolean' }]">
    <span :class="$style.label">{{ t(field.labelKey) }}</span>

    <button
      v-if="field.type === 'boolean'"
      type="button"
      role="switch"
      :aria-checked="!!modelValue"
      :class="[$style.switch, { [$style.on]: modelValue }]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span :class="$style.knob"></span>
    </button>

    <input
      v-else-if="field.type === 'number'"
      type="number"
      :class="$style.input"
      :value="modelValue"
      :min="field.min"
      :max="field.max"
      :step="field.step"
      @input="onNumber($event)"
    />

    <input
      v-else-if="field.type === 'string'"
      type="text"
      :class="$style.input"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <Segmented
      v-else-if="field.type === 'enum'"
      :model-value="String(modelValue)"
      :options="enumOptions"
      size="sm"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <div v-else-if="field.type === 'multienum'" :class="$style.chips">
      <button
        v-for="opt in field.options"
        :key="opt.value"
        type="button"
        :class="[$style.chip, { [$style.chipOn]: selected.includes(opt.value) }]"
        @click="toggleMulti(opt.value)"
      >
        {{ t(opt.labelKey) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PluginField } from '@root/core/plugins'

import Segmented from '@root/components/segmented.vue'

import { computed } from 'vue'
import { useI18n } from '@root/composables/useI18n'

const props = defineProps<{
  field: PluginField
  modelValue: boolean | number | string | string[]
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean | number | string | string[]): void }>()

const { t } = useI18n()

const enumOptions = computed(() => (props.field.options ?? []).map((item) => ({ value: item.value, label: t(item.labelKey) })))

const selected = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

const onNumber = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value
  const value = Number(raw)
  emit('update:modelValue', Number.isFinite(value) ? value : 0)
}

const toggleMulti = (value: string) => {
  const current = selected.value
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
  emit('update:modelValue', next)
}
</script>

<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  font-size: 13px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition:
    border-color var(--motion-fast),
    box-shadow var(--motion-fast);

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--ring);
  }
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

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    color var(--motion-fast),
    background var(--motion-fast),
    border-color var(--motion-fast);

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }
}

.chipOn {
  color: var(--color-text-inverse);
  background: var(--color-primary);
  border-color: var(--color-primary);

  &:hover {
    color: var(--color-text-inverse);
    background: var(--color-primary-strong);
  }
}
</style>
