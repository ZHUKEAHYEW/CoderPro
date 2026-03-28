<template>
  <div class="w-full h-full glass-panel flex flex-col relative overflow-hidden rounded-2xl">
    <!-- Header / Drag Bar -->
    <div class="h-10 flex items-center justify-between px-4 bg-white/5 drag-region rounded-t-2xl">
      <div class="flex items-center gap-2">
        <Plus class="w-4 h-4 text-cyber-cyan" />
        <span class="text-xs font-bold tracking-wider text-white/90">{{ title }}</span>
      </div>
      <button class="no-drag text-white/40 hover:text-red-400 p-1 rounded transition-colors active:scale-90" @click="close">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Form Content -->
    <div class="flex-1 p-6 flex flex-col gap-5 no-drag overflow-y-auto">
      <!-- URL Form -->
      <template v-if="type === 'urls'">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">链接名称</label>
          <input v-model="form.urls.name" placeholder="如: GitHub" class="glass-input" autofocus />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">URL 地址</label>
          <input v-model="form.urls.url" placeholder="https://..." class="glass-input" @keyup.enter="save" />
        </div>
      </template>

      <!-- Text Form -->
      <template v-else-if="type === 'texts'">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">片段标题</label>
          <input v-model="form.texts.title" placeholder="如: 常用正则" class="glass-input" autofocus />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <label class="text-[11px] text-white/40 ml-1">内容</label>
          <textarea v-model="form.texts.content" placeholder="输入代码或提示词..." class="glass-input flex-1 resize-none font-mono text-[13px]"></textarea>
        </div>
      </template>

      <!-- Task Form -->
      <template v-else-if="type === 'tasks'">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">任务内容</label>
          <input v-model="form.tasks.content" placeholder="要做什么？" class="glass-input" autofocus />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">截止时间</label>
          <input v-model="form.tasks.time" type="datetime-local" class="glass-input" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] text-white/40 ml-1">优先级</label>
          <select v-model="form.tasks.priority" class="glass-input">
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>
        </div>
      </template>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-2">
        <button @click="close" class="glass-btn-secondary">取消</button>
        <button @click="save" class="glass-btn-primary">保存记录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { Plus, X } from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const title = computed(() => {
  const map = { urls: '新增网址', texts: '新增片段', tasks: '新增任务' }
  return map[props.type] || '新增记录'
})

const form = reactive({
  urls: { name: '', url: '' },
  texts: { title: '', content: '' },
  tasks: { content: '', done: false, time: '', priority: 'medium' }
})

const close = () => {
  if (window.electronAPI) {
    window.electronAPI.closeFormWindow(props.type)
  }
}

const save = async () => {
  if (!window.electronAPI) return

  const data = await window.electronAPI.getData()
  const currentCategoryData = data[props.type] || []
  const newItem = { ...form[props.type] }

  // 简单校验
  if (props.type === 'urls' && (!newItem.name || !newItem.url)) return
  if (props.type === 'texts' && (!newItem.title || !newItem.content)) return
  if (props.type === 'tasks' && !newItem.content) return

  // URL 自动补全
  if (props.type === 'urls' && !newItem.url.startsWith('http')) {
    newItem.url = 'https://' + newItem.url
  }

  await window.electronAPI.saveData({
    category: props.type,
    data: [...currentCategoryData, newItem]
  })

  close()
}
</script>