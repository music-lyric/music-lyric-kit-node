<template>
  <div :class="[$style.segmented, { [$style.small]: size === 'sm' }]">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[$style.item, { [$style.active]: option.value === modelValue }]"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

defineProps<{
  modelValue: string
  options: Option[]
  size?: 'sm'
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<style module lang="scss">
.segmented {
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.item {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--motion-fast),
    background var(--motion-fast);

  &:hover {
    color: var(--color-text);
  }

  &.active {
    color: var(--color-text-inverse);
    background: var(--color-primary);

    &:hover {
      color: var(--color-text-inverse);
      background: var(--color-primary-strong);
    }
  }
}

.small .item {
  padding: 4px 12px;
  font-size: 12px;
}
</style>
