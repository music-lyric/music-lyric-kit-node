<template>
  <label :class="$style.field">
    <span :class="$style.label">{{ label }}</span>
    <input
      :class="$style.input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="hint" :class="$style.hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  placeholder?: string
  hint?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  font-size: 14px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition:
    border-color var(--motion-fast),
    box-shadow var(--motion-fast);

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--ring);
  }
}

.hint {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
