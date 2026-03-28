<template>
  <div class="h-full flex flex-col gap-5 relative">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-white tracking-wide">今日任务</h2>
        <p class="text-xs text-white/40 mt-1">你的桌面待办事项清单</p>
      </div>
      <button @click="openAddWindow" class="glass-btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" /> 任务
      </button>
    </div>

    <!-- 列表 -->
    <div class="flex-1 flex flex-col gap-3 pr-2 relative min-h-[300px]">
      <div v-for="(item, index) in paginatedData" :key="index" 
        :class="['p-4 rounded-2xl flex items-center justify-between transition-all duration-300 group', 
                 item.done ? 'bg-cyber-green/5 opacity-60' : 'bg-white/[0.03] hover:bg-white/[0.06]']"
      >
        <div class="flex items-start gap-4 flex-1">
          <label class="relative flex items-center justify-center cursor-pointer">
            <input type="checkbox" :checked="item.done" @change="toggleDone(item)" class="peer sr-only" />
            <div class="w-5 h-5 border-2 rounded-md border-white/30 peer-checked:border-cyber-green peer-checked:bg-cyber-green/20 transition-all flex items-center justify-center">
              <Check v-if="item.done" class="w-3 h-3 text-cyber-green" />
            </div>
          </label>
          <div class="flex-1 min-w-0">
            <p :class="['text-[14px] font-medium transition-all duration-300 truncate', item.done ? 'line-through text-white/40' : 'text-white/90']">
              {{ item.content }}
            </p>
            <div class="mt-1 flex items-center gap-2 text-[11px]">
              <span class="px-2 py-0.5 rounded-lg border border-white/10 text-white/50">{{ formatTime(item.time) }}</span>
              <span :class="priorityClass(item.priority)">{{ priorityLabel(item.priority) }}</span>
            </div>
          </div>
        </div>
        <button @click="deleteItem(item)" class="glass-btn-secondary !py-1.5 !px-3 text-xs !text-red-400 hover:!bg-red-400/10 hover:!border-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
      </div>
      
      <div v-if="!data || data.length === 0" class="flex flex-col items-center justify-center h-40 text-white/30 text-sm gap-3">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ListTodo class="w-5 h-5 opacity-50" />
        </div>
        暂无任务
      </div>

      <!-- 分页导航 -->
      <div v-if="totalPages > 1" class="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-2 pt-4 pb-2 bg-gradient-to-t from-cyber-panel to-transparent rounded-b-2xl">
        <button 
          @click="currentPage > 1 && currentPage--" 
          :disabled="currentPage === 1"
          class="px-2 py-1 rounded-lg text-xs transition-colors"
          :class="currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white hover:bg-white/10'"
        >上一页</button>
        
        <div class="flex items-center gap-1">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            class="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all"
            :class="currentPage === page ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30' : 'text-white/50 hover:bg-white/5'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage < totalPages && currentPage++" 
          :disabled="currentPage === totalPages"
          class="px-2 py-1 rounded-lg text-xs transition-colors"
          :class="currentPage === totalPages ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white hover:bg-white/10'"
        >下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Plus, Check, ListTodo } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update'])

// 分页逻辑
const currentPage = ref(1)
const itemsPerPage = 3

const totalPages = computed(() => Math.ceil(props.data.length / itemsPerPage) || 1)

const sortedTasks = computed(() => {
  return [...props.data].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const pMap = { high: 0, medium: 1, low: 2 }
    return pMap[a.priority] - pMap[b.priority]
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedTasks.value.slice(start, end)
})

// 监听数据变化
watch(() => props.data.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

const openAddWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.openFormWindow('tasks')
  }
}

const toggleDone = (item) => {
  const originalIndex = props.data.findIndex(t => t === item)
  if (originalIndex !== -1) {
    const newData = [...props.data]
    newData[originalIndex].done = !newData[originalIndex].done
    emit('update', newData)
  }
}

const deleteItem = (item) => {
  const originalIndex = props.data.findIndex(t => t === item)
  if (originalIndex !== -1) {
    const newData = [...props.data]
    newData.splice(originalIndex, 1)
    emit('update', newData)
  }
}

const priorityLabel = (priority) => {
  if (priority === 'high') return '高'
  if (priority === 'low') return '低'
  return '中'
}

const priorityClass = (priority) => {
  if (priority === 'high') return 'px-2 py-0.5 rounded-full bg-red-400/10 text-red-300'
  if (priority === 'low') return 'px-2 py-0.5 rounded-full bg-green-400/10 text-green-300'
  return 'px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-200'
}

const formatTime = (time) => {
  if (!time) return '未设置时间'
  return time.replace('T', ' ')
}
</script>
