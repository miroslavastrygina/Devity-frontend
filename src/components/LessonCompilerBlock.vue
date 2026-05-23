<template>
  <div class="compiler-shell ide-border">
    <div class="compiler-toolbar">
      <button type="button" class="btn-run" :disabled="running" @click="run">
        {{ running ? 'Выполняется…' : 'Запустить' }}
      </button>
      <button type="button" class="btn-stop" :disabled="!running" @click="stop">Стоп</button>
    </div>
    <div ref="editorHost" class="compiler-editor-host"></div>
    <div class="compiler-output ide-border-inner" aria-live="polite">
      <div v-if="errorMsg" class="output-line output-err">{{ errorMsg }}</div>
      <pre v-else class="output-pre">{{ output || (ranOnce ? '' : 'Вывод появится после запуска.') }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState, Transaction } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { StreamLanguage } from '@codemirror/language';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { oneDark } from '@codemirror/theme-one-dark';

const props = defineProps({
  initialCode: { type: String, default: '' },
  token: { type: String, default: '' },
  backendUrl: { type: String, required: true },
});

const editorHost = ref(null);
const running = ref(false);
const output = ref('');
const errorMsg = ref('');
const ranOnce = ref(false);

let view = null;
let abortController = null;

const csharpLang = StreamLanguage.define(csharp);

function getDoc() {
  return view?.state.doc.toString() ?? '';
}

async function run() {
  errorMsg.value = '';
  output.value = '';
  ranOnce.value = true;
  if (!props.token) {
    errorMsg.value = 'Нужна авторизация для запуска кода.';
    return;
  }
  abortController = new AbortController();
  running.value = true;
  try {
    const res = await fetch(`${props.backendUrl}/compiler/execute`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${props.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: getDoc(), language: 'csharp' }),
      signal: abortController.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      errorMsg.value = data.msg || `Ошибка запроса (${res.status})`;
      return;
    }
    const d = data.data || {};
    const parts = [];
    if (d.output) {
      parts.push(String(d.output));
    }
    if (d.compilation_status != null && Number(d.compilation_status) !== 0) {
      parts.push(`compilationStatus: ${d.compilation_status}`);
    }
    if (d.error) {
      parts.push(String(d.error));
    }
    output.value = parts.join('\n').trimEnd() || '(пустой вывод)';
  } catch (e) {
    if (e.name === 'AbortError') {
      errorMsg.value = 'Остановлено.';
    } else {
      errorMsg.value = e.message || String(e);
    }
  } finally {
    running.value = false;
    abortController = null;
  }
}

function stop() {
  abortController?.abort();
}

function defaultDoc() {
  return props.initialCode || '// Введите C# код\n';
}

function applyInitialCodeFromProps() {
  if (!view) {
    return;
  }
  const next = defaultDoc();
  const cur = view.state.doc.toString();
  if (cur === next) {
    return;
  }
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: next },
    annotations: Transaction.remote.of(true),
  });
}

function mountEditor() {
  if (!editorHost.value) {
    return;
  }
  view?.destroy();
  view = new EditorView({
    state: EditorState.create({
      doc: defaultDoc(),
      extensions: [
        history(),
        lineNumbers(),
        oneDark,
        csharpLang,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.theme(
          {
            '&': { height: '100%', backgroundColor: '#282c34' },
            '.cm-scroller': { overflow: 'auto', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '13px' },
            '.cm-gutters': { backgroundColor: '#21252b', color: '#636d83', border: 'none' },
          },
          { dark: true },
        ),
      ],
    }),
    parent: editorHost.value,
  });
}

watch(
  () => props.initialCode,
  () => {
    applyInitialCodeFromProps();
  },
);

onMounted(() => {
  mountEditor();
});

onUnmounted(() => {
  view?.destroy();
  view = null;
});
</script>

<style scoped>
.compiler-shell {
  display: flex;
  flex-direction: column;
  height: 420px;
  max-width: 100%;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
}

.ide-border {
  border: 1px solid #3e4451;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.ide-border-inner {
  border-top: 1px solid #3e4451;
}

.compiler-toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.4rem 0.6rem;
  background: #2c313a;
  flex-shrink: 0;
}

.compiler-editor-host {
  flex: 1;
  min-height: 0;
  background: #282c34;
}

.compiler-output {
  height: 120px;
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  background: #21252b;
  overflow: auto;
  color: #abb2bf;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
}

.output-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-line {
  margin: 0;
}

.output-err {
  color: #e06c75;
}

.btn-run,
.btn-stop {
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  cursor: pointer;
  color: #fff;
}

.btn-run {
  background: #61afef;
}

.btn-run:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-stop {
  background: #5c6370;
}

.btn-stop:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
