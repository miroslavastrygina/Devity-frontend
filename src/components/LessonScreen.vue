<template>
  <Header />
  <div v-if="!lesson" class="container mt-4">
    <p>Урок не найден. Загрузите список уроков или проверьте ссылку.</p>
  </div>
  <template v-else>
    <div class="container mt-4">
      <div class="card shadow-sm lesson-card animate__animated animate__fadeInUp">
        <div class="card-body">
          <h1 class="card-title text-purple">{{ lesson.title }}</h1>
          <p class="text-muted mb-2">Создан: {{ formatDate(lesson.created_at) }}</p>
          <div class="card-text markdown-body lesson-md-segment" v-html="lessonHtml" />
          <LessonCompilerBlock
            v-for="idx in compilerSlots"
            :key="'compiler-' + lesson.id + '-' + idx"
            :initial-code="compilerCode(idx)"
            :token="auth.token"
            :backend-url="data.backendUrl"
          />
        </div>
      </div>
    </div>
    <TestList :tests="lesson.tests" />
    <AssignmentListScreen v-if="lesson.assignments" :assignments="lesson.assignments" />
  </template>
</template>

<script setup>
import { computed, onMounted, onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import Header from './Header.vue';
import TestList from './TestListScreen.vue';
import { useDataStore } from '@/stores/data';
import { useAuthStore } from '@/stores/auth';
import AssignmentListScreen from './AssignmentListScreen.vue';
import LessonCompilerBlock from './LessonCompilerBlock.vue';

const props = defineProps({
  id: String,
});

const data = useDataStore();
const { lessons } = storeToRefs(data);
const auth = useAuthStore();
const router = useRouter();

const lesson = computed(() => {
  if (!lessons.value) {
    return undefined;
  }
  const nid = Number(props.id);
  return lessons.value.find((l) => Number(l.id) === nid);
});

function getCompilerMarkerIndices(content) {
  const indices = [];
  const text = content || '';
  const re = /\[\[compiler:\s*(\d+)\s*\]\]/g;
  let m = re.exec(text);
  while (m !== null) {
    indices.push(parseInt(m[1], 10));
    m = re.exec(text);
  }
  return indices;
}

const compilerSlots = computed(() => {
  if (!lesson.value) {
    return [];
  }
  const content = lesson.value.content || '';
  const markerIdx = getCompilerMarkerIndices(content);
  if (markerIdx.length > 0) {
    return [...new Set(markerIdx)].sort((a, b) => a - b);
  }
  const blocks = normalizeCompilerBlocks(lesson.value.compiler_blocks);
  if (blocks?.length) {
    return blocks.map((_, i) => i);
  }
  return [0];
});

const lessonHtml = computed(() => {
  const raw = lesson.value?.content ?? '';
  const withoutMarkers = String(raw).replace(/\[\[compiler:\s*\d+\s*\]\]/g, '');
  return marked.parse(withoutMarkers);
});

function normalizeCompilerBlocks(raw) {
  if (raw == null) {
    return null;
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

const DEFAULT_CSHARP_PLAYGROUND = `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Пример: измените код и нажмите «Запустить».");
    }
}
`;

function compilerCode(index) {
  const blocks = normalizeCompilerBlocks(lesson.value?.compiler_blocks);
  if (blocks?.[index] != null) {
    const code = blocks[index].code;
    return typeof code === 'string' ? code : '// Пустой блок';
  }
  if (index === 0) {
    return DEFAULT_CSHARP_PLAYGROUND;
  }
  return `// Добавьте код для блока [[compiler:${index}]] в админке (JSON compiler_blocks).`;
}

function formatDate(dateStr) {
  if (!dateStr) {
    return '';
  }
  return dateStr.split('T')[0];
}

function highlightCode() {
  document.querySelectorAll('.lesson-md-segment pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push('/login');
    return;
  }

  await Promise.all([
    data.fetchCourses(auth.token),
    data.fetchBlcoks(auth.token),
    data.fetchLessons(auth.token),
    data.fetchTests(auth.token),
    data.fetchAssignments(auth.token),
  ]);
  if (auth.user?.id != null) {
    await data.fetchAssignmentsResults(auth.token, auth.user.id);
  }
  await data.fetchLesson(auth.token, props.id);

  highlightCode();
});

onUpdated(() => {
  highlightCode();
});
</script>

<style scoped>
.markdown-body pre {
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  color: #fff;
}

.markdown-body code {
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
}

.lesson-card {
  background-color: #f9f3fc;
  border-radius: 1rem;
  padding: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15);
}

.text-purple {
  color: #6f42c1;
}
</style>
