<template>
  <div v-if="isTaskWidget" class="w-full h-full overflow-hidden">
    <TaskWidget />
  </div>
  <div v-else-if="isFormWindow" class="w-full h-full overflow-hidden">
    <!-- 独立新增表单窗口 -->
    <AddFormWidget :type="formType" />
  </div>
  <div v-else-if="isDetachedTab" class="w-full h-full overflow-hidden rounded-2xl">
    <!-- 独立分离出的窗口视图 -->
    <div class="glass-panel w-full h-full flex flex-col relative overflow-hidden rounded-2xl">
      <!-- 拖拽栏与关闭按钮 -->
      <div class="h-8 flex items-center justify-between px-3 bg-white/5 text-white/50 text-[11px] drag-region rounded-t-2xl">
        <div class="flex items-center gap-1">
          <GripHorizontal class="w-3.5 h-3.5" /> 拖拽移动
        </div>
        <button class="no-drag text-white/40 hover:text-red-400 p-1 rounded-lg transition-colors active:scale-90" @click="closeDetachedWindow" title="关闭并合回主面板">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 p-4 overflow-y-auto no-drag bg-gradient-to-b from-transparent to-black/10 bg-glass-glow">
        <UrlManager v-if="detachedType === 'urls'" :data="urls" @update="updateUrls" />
        <TextManager v-if="detachedType === 'texts'" :data="texts" @update="updateTexts" />
        <TaskManager v-if="detachedType === 'tasks'" :data="tasks" @update="updateTasks" />
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <MainWidget />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { GripHorizontal, X } from 'lucide-vue-next'
import MainWidget from './components/MainWidget.vue'
import TaskWidget from './components/TaskWidget.vue'
import UrlManager from './components/UrlManager.vue'
import TextManager from './components/TextManager.vue'
import TaskManager from './components/TaskManager.vue'
import AddFormWidget from './components/AddFormWidget.vue'

const isTaskWidget = ref(false)
const isDetachedTab = ref(false)
const isFormWindow = ref(false)
const detachedType = ref('')
const formType = ref('')

const urls = ref([])
const texts = ref([])
const tasks = ref([])
let unsubscribe = null

const loadData = async () => {
  if (window.electronAPI) {
    const data = await window.electronAPI.getData()
    urls.value = data.urls || []
    texts.value = data.texts || []
    tasks.value = data.tasks || []
  }
}

const saveData = async (category, data) => {
  if (window.electronAPI) {
    const savedData = await window.electronAPI.saveData({
      category,
      data
    })
    // 使用返回的数据同步本地
    urls.value = savedData.urls || []
    texts.value = savedData.texts || []
    tasks.value = savedData.tasks || []
  }
}

const updateUrls = (newUrls) => { updateLocalAndSave('urls', newUrls) }
const updateTexts = (newTexts) => { updateLocalAndSave('texts', newTexts) }
const updateTasks = (newTasks) => { updateLocalAndSave('tasks', newTasks) }

const updateLocalAndSave = (category, data) => {
  if (category === 'urls') urls.value = data
  if (category === 'texts') texts.value = data
  if (category === 'tasks') tasks.value = data
  saveData(category, data)
}

const closeDetachedWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.closeDetachedWindow(detachedType.value)
  }
}

onMounted(() => {
  const hash = window.location.hash
  if (hash.includes('task-widget')) {
    isTaskWidget.value = true
  } else if (hash.includes('form-window')) {
    isFormWindow.value = true
    const params = new URLSearchParams(hash.split('?')[1])
    formType.value = params.get('type')
  } else if (hash.includes('detached-tab')) {
    isDetachedTab.value = true
    const params = new URLSearchParams(hash.split('?')[1])
    detachedType.value = params.get('type')
    loadData()
    if (window.electronAPI) {
      unsubscribe = window.electronAPI.onDataUpdated((newData) => {
        urls.value = newData.urls || []
        texts.value = newData.texts || []
        tasks.value = newData.tasks || []
      })
    }
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
