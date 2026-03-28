<template>
  <div class="w-full h-full p-4 flex flex-col font-sans text-white drag-region">
    <div class="glass-panel flex-1 flex flex-col overflow-hidden transition-all duration-300 hover:bg-black/30">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <h2 class="font-bold text-[13px] text-white/90 flex items-center gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-green shadow-[0_0_8px_#39FF14]"></span>
          </span>
          今日任务
        </h2>
      </div>

      <!-- Task List -->
      <div class="flex-1 p-3 overflow-y-auto flex flex-col gap-2 no-drag">
        <div v-for="(item, index) in tasks" :key="index" 
          :class="['p-3 rounded-xl flex items-center gap-3 transition-all duration-300', 
                   item.done ? 'opacity-40 bg-transparent' : 'bg-white/[0.03] hover:bg-white/[0.06]']"
        >
          <label class="relative flex items-center justify-center cursor-pointer">
            <input type="checkbox" :checked="item.done" @change="toggleDone(index)" class="peer sr-only" />
            <div class="w-4 h-4 border-2 rounded border-white/30 peer-checked:border-cyber-green peer-checked:bg-cyber-green/20 transition-all flex items-center justify-center">
              <Check v-if="item.done" class="w-2.5 h-2.5 text-cyber-green" />
            </div>
          </label>
          <span :class="['text-[13px] flex-1 truncate transition-all duration-300', item.done ? 'line-through text-white/40' : 'text-white/80']" :title="item.content">
            {{ item.content }}
          </span>
        </div>
        <div v-if="!tasks || tasks.length === 0" class="flex flex-col items-center justify-center h-full text-white/30 text-xs gap-2">
          暂无任务，请在主面板添加
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Check } from 'lucide-vue-next'

const tasks = ref([])
let unsubscribe = null

const loadData = async () => {
  if (window.electronAPI) {
    const data = await window.electronAPI.getData()
    tasks.value = data.tasks || []
  }
}

const toggleDone = async (index) => {
  const newTasks = [...tasks.value]
  newTasks[index].done = !newTasks[index].done
  tasks.value = newTasks
  
  if (window.electronAPI) {
    const savedData = await window.electronAPI.saveData({
      category: 'tasks',
      data: newTasks
    })
    tasks.value = savedData.tasks || []
  }
}

onMounted(() => {
  loadData()
  if (window.electronAPI) {
    unsubscribe = window.electronAPI.onDataUpdated((newData) => {
      tasks.value = newData.tasks || []
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
