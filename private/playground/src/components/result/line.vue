<template>
  <div :class="$style.lineRow">
    <span :class="$style.time">{{ timeStr }}</span>
    <span v-if="agentInfo" :class="$style.agentBadge" :style="{ background: agentInfo.color }">{{ agentInfo.name }}</span>
    <div :class="$style.content">
      <div :class="$style.words">
        <template v-for="(word, i) in words" :key="i">
          <span v-if="word.type === 'word'" :class="$style.wordCol">
            <span v-if="word.ruby" :class="$style.ruby" :title="word.ruby.title">{{ word.ruby.text }}</span>
            <span v-for="(r, ri) in word.romans" :key="`r${ri}`" :class="$style.wordRoman" :title="r.title">{{ r.text }}</span>
            <span v-for="(u, ui) in word.unknowns" :key="`u${ui}`" :class="$style.wordUnknown" :title="u.title">{{ u.text }}</span>
            <span
              :class="[$style.word, { [$style.hasTime]: word.hasTime, [$style.stress]: word.stress }]"
              :title="word.title"
              >{{ word.text }}</span
            >
          </span>
          <span v-else :class="$style.space">{{ word.text }}</span>
        </template>
      </div>
      <div v-if="extended.length" :class="$style.extended">
        <span v-for="(ext, i) in extended" :key="i" :class="[$style.extItem, $style[ext.kind]]">{{ ext.text }}</span>
      </div>
    </div>
  </div>

  <div v-if="!isBg && line.background?.length" :class="$style.background">
    <div :class="$style.bgLabel">{{ t('result.background') }}</div>
    <ResultLine v-for="(bg, i) in line.background" :key="i" :line="bg" :agents="agents" is-bg />
  </div>
</template>

<script setup lang="ts">
import { Lyric } from 'music-lyric-kit'

import { computed } from 'vue'
import { formatTime, getAgentColor } from '@root/core/utils'
import { useI18n } from '@root/composables/useI18n'

defineOptions({ name: 'ResultLine' })

const props = defineProps<{
  line: Lyric.LineNormal
  agents: Lyric.Agent[]
  isBg?: boolean
}>()

const { t } = useI18n()

const timeStr = computed(() => `${formatTime(props.line.time.start)} ~ ${formatTime(props.line.time.end)}`)

const agentInfo = computed(() => {
  if (!props.line.agent) return null
  const index = props.agents.findIndex((item) => item.id === props.line.agent!.id)
  if (index < 0) return null
  return { name: props.agents[index].names.join(' / '), color: getAgentColor(index) }
})

const annoItem = (item: Lyric.WordAnnotationItem) => {
  const timed = !!item.time && (item.time.start > 0 || item.time.end > 0)
  const time = timed ? `${formatTime(item.time!.start)} ~ ${formatTime(item.time!.end)}` : ''
  return { text: item.content, title: [item.language, time].filter(Boolean).join(' · ') }
}

const words = computed(() =>
  props.line.words.map((word) => {
    if (word.type === Lyric.WordType.Space) {
      return { type: 'space' as const, text: ' '.repeat((word as Lyric.WordSpace).count) }
    }
    const w = word as Lyric.WordNormal
    const hasTime = !!w.time && (w.time.start > 0 || w.time.end > 0)
    const anno = w.annotation
    return {
      type: 'word' as const,
      text: w.content,
      hasTime,
      stress: w.stress,
      title: hasTime ? `${formatTime(w.time?.start ?? 0)} ~ ${formatTime(w.time?.end ?? 0)}` : '',
      ruby: anno?.ruby ? annoItem(anno.ruby) : null,
      romans: (anno?.romans ?? []).map(annoItem),
      unknowns: (anno?.unknowns ?? []).map((u) => {
        const base = annoItem(u)
        return { text: base.text, title: [u.key, base.title].filter(Boolean).join(' · ') }
      }),
    }
  }),
)

// word-level annotations are rendered per syllable, so skip the line-level (aggregated) duplicate of the same kind.
const wordAnno = computed(() => {
  let roman = false
  let ruby = false
  let unknown = false
  for (const word of props.line.words) {
    if (word.type !== Lyric.WordType.Normal) {
      continue
    }
    const anno = (word as Lyric.WordNormal).annotation
    if (!anno) {
      continue
    }
    if (anno.romans?.length) {
      roman = true
    }
    if (anno.ruby) {
      ruby = true
    }
    if (anno.unknowns?.length) {
      unknown = true
    }
  }
  return { roman, ruby, unknown }
})

const extended = computed(() => {
  const result: { kind: 'translate' | 'roman' | 'other'; text: string }[] = []
  const annotation = props.line.annotation

  for (const item of annotation.all(Lyric.LineAnnotationKind.Translate)) {
    result.push({ kind: 'translate', text: item.content })
  }
  if (!wordAnno.value.roman) {
    for (const item of annotation.all(Lyric.LineAnnotationKind.Roman)) {
      result.push({ kind: 'roman', text: item.content })
    }
  }
  if (!wordAnno.value.ruby) {
    const ruby = annotation.first(Lyric.LineAnnotationKind.Ruby)
    if (ruby) {
      result.push({ kind: 'other', text: `[ruby] ${ruby.content}` })
    }
  }
  if (!wordAnno.value.unknown) {
    for (const item of annotation.all(Lyric.LineAnnotationKind.Unknown)) {
      result.push({ kind: 'other', text: `[${item.key}] ${item.content}` })
    }
  }

  return result
})
</script>

<style module lang="scss">
.lineRow {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: background var(--motion-fast);

  &:hover {
    background: var(--color-bg-alt);
  }
}

.time {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 110px;
  text-align: right;
}

.agentBadge {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-inverse);
  border-radius: var(--radius-xs);
}

.content {
  flex: 1;
  min-width: 0;
}

.words {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  column-gap: 4px;
  row-gap: 8px;
  font-size: 15px;
  line-height: 1.5;
}

.wordCol {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.space {
  white-space: pre;
}

.word {
  &.hasTime {
    border-radius: var(--radius-xs);
    transition: background var(--motion-fast);

    &:hover {
      background: var(--color-primary-soft);
    }
  }

  &.stress {
    font-weight: 700;
  }
}

.ruby,
.wordRoman,
.wordUnknown {
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
}

.ruby {
  color: var(--color-primary);
}

.wordRoman {
  color: var(--color-text-muted);
  font-style: italic;
}

.wordUnknown {
  color: var(--color-text-secondary);
}

.extended {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.extItem {
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text-secondary);
}

.roman {
  color: var(--color-text-muted);
  font-style: italic;
}

.background {
  margin: 2px 0 2px 24px;
  padding-left: 16px;
  border-left: 2px solid var(--color-border);
}

.bgLabel {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 4px 12px 0;
}

.background .words {
  font-size: 13px;
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .lineRow {
    gap: 8px;
    padding: 6px 6px;
  }

  .time {
    min-width: 64px;
    font-size: 11px;
  }

  .background {
    margin-left: 12px;
    padding-left: 10px;
  }
}
</style>
