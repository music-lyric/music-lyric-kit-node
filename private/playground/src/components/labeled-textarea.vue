<template>
  <label :class="$style.field">
    <span :class="$style.label">{{ label }}</span>
    <textarea
      :class="[$style.area, { [$style.tall]: tall }]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  placeholder?: string
  tall?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.area {
  width: 100%;
  height: 200px;
  padding: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
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

  &.tall {
    height: 320px;
  }
}
</style>
