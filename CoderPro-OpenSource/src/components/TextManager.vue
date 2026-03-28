<template>
  <div class="h-full flex flex-col gap-5 relative">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-white tracking-wide">文本片段</h2>
        <p class="text-xs text-white/40 mt-1">代码与常用提示词库</p>
      </div>
      <button @click="openAddWindow" class="glass-btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" /> 新建
      </button>
    </div>

    <!-- 列表 -->
    <div class="flex-1 flex flex-col gap-4 pr-2 relative min-h-[300px]">
      <div v-for="(item, index) in paginatedData" :key="index" class="p-4 bg-white/[0.03] rounded-2xl flex flex-col gap-3 hover:bg-white/[0.05] transition-all duration-300 group shadow-lg">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-[14px] text-cyber-cyan">{{ item.title }}</h3>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button @click="copyText(item.content)" class="glass-btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
              <Copy class="w-3 h-3" /> 复制
            </button>
            <button @click="deleteItem(item)" class="glass-btn-secondary !py-1.5 !px-3 text-xs !text-red-400 hover:!bg-red-400/10 hover:!border-red-400/30">删除</button>
          </div>
        </div>
        <div class="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <pre class="text-[13px] text-white/70 p-3 overflow-x-auto whitespace-pre-wrap max-h-40 font-mono leading-relaxed">{{ item.content }}</pre>
        </div>
      </div>
      <div v-if="!data || data.length === 0" class="flex flex-col items-center justify-center h-40 text-white/30 text-sm gap-3">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <FileText class="w-5 h-5 opacity-50" />
        </div>
        暂无片段
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
import { Plus, Copy, FileText } from 'lucide-vue-next'

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

// 监听数据变化
watch(() => props.data.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

const openAddWindow = () => {
  if (window.electronAPI) {
    window.electronAPI.openFormWindow('texts')
  }
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy: ', err)
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