<template>
  <div class="h-full flex flex-col gap-5 relative">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-white tracking-wide">网址导航</h2>
        <p class="text-xs text-white/40 mt-1">快捷管理你的常用开发链接</p>
      </div>
      <button @click="openAddWindow" class="glass-btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" /> 新增
      </button>
    </div>

    <!-- 列表 -->
    <div class="flex-1 flex flex-col gap-3 pr-2 relative min-h-[300px]">
      <div v-for="(item, index) in paginatedData" :key="index" class="p-4 bg-white/[0.03] rounded-2xl flex items-center justify-between hover:bg-white/[0.06] transition-all duration-300 group">
        <div class="flex-1 min-w-0 pr-4">
          <h3 class="font-semibold text-[14px] text-white/90 truncate">{{ item.name }}</h3>
          <p class="text-xs text-cyber-cyan/70 truncate mt-1">{{ item.url }}</p>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button @click="openUrl(item.url)" class="glass-btn-secondary !py-1.5 !px-3 text-xs">打开</button>
          <button @click="deleteItem(item)" class="glass-btn-secondary !py-1.5 !px-3 text-xs !text-red-400 hover:!bg-red-400/10 hover:!border-red-400/30">删除</button>
        </div>
      </div>
      <div v-if="!data || data.length === 0" class="flex flex-col items-center justify-center h-40 text-white/30 text-sm gap-3">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <LinkIcon class="w-5 h-5 opacity-50" />
        </div>
        暂无记录
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
import { Plus, Link as LinkIcon } from 'lucide-vue-next'

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

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.data.slice(start, end)
})

// 监听数据变化，确保删除最后一页的最后一条数据时，自动跳回上一页
watch(() => props.data.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

const openAddWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.openFormWindow('urls')
  }
}

const openUrl = (url) => {
  if (window.electronAPI) {
    window.electronAPI.openUrl(url)
  } else {
    window.open(url, '_blank')
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
</script>