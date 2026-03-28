<template>
  <div class="w-full h-full relative font-sans text-white transition-all duration-500 ease-out">
    <!-- 小悬浮窗状态 -->
    <div 
      v-if="!isExpanded"
      class="w-[56px] h-[56px] rounded-2xl glass-panel flex items-center justify-center cursor-pointer transition-all duration-300 group select-none active:scale-95"
      @mousedown="handleMouseDown"
      @contextmenu="handleContextMenu"
    >
      <Cpu class="w-7 h-7 text-white/80 group-hover:text-cyber-cyan group-hover:scale-110 transition-all duration-300 pointer-events-none" />
    </div>

    <!-- 展开后的二级菜单 -->
    <div 
      v-else
      class="w-full h-full glass-panel flex flex-col drag-region rounded-2xl overflow-hidden"
      style="will-change: width, height;"
    >
      <!-- Header & Top Navigation -->
      <div class="flex flex-col bg-white/[0.02] rounded-t-2xl">
        <!-- Title Bar -->
        <div class="flex items-center justify-between px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="p-1.5 rounded-xl bg-cyber-cyan/10">
              <Cpu class="w-5 h-5 text-cyber-cyan" />
            </div>
            <span class="font-bold text-[15px] tracking-wide text-white/90">CoderPro</span>
          </div>
          <button class="no-drag text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-all duration-200 active:scale-90" @click="toggleExpand">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Top Tabs Navigation -->
        <div class="flex items-center px-4 pb-2 gap-2 no-drag">
          <button 
            @mousedown="startPress('urls')"
            @mouseup="cancelPress('urls')"
            @mouseleave="cancelPress('urls')"
            @click="currentTab = 'urls'"
            :class="['relative px-4 py-2 text-[13px] rounded-xl transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden select-none', currentTab === 'urls' ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-white/60 hover:text-white hover:bg-white/5']"
          >
            <div v-if="pressingTab === 'urls' || detachedTabs.includes('urls')" :class="['absolute inset-0 bg-cyber-cyan/20 origin-left ease-linear', (pressingTab === 'urls' && !detachedTabs.includes('urls')) ? 'transition-transform duration-1000' : '']" :style="{ transform: isProgressFull('urls') ? 'scaleX(1)' : 'scaleX(0)' }"></div>
            <LinkIcon class="w-4 h-4 relative z-10" /> <span class="relative z-10">网址</span>
          </button>
          
          <button 
            @mousedown="startPress('texts')"
            @mouseup="cancelPress('texts')"
            @mouseleave="cancelPress('texts')"
            @click="currentTab = 'texts'"
            :class="['relative px-4 py-2 text-[13px] rounded-xl transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden select-none', currentTab === 'texts' ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-white/60 hover:text-white hover:bg-white/5']"
          >
            <div v-if="pressingTab === 'texts' || detachedTabs.includes('texts')" :class="['absolute inset-0 bg-cyber-cyan/20 origin-left ease-linear', (pressingTab === 'texts' && !detachedTabs.includes('texts')) ? 'transition-transform duration-1000' : '']" :style="{ transform: isProgressFull('texts') ? 'scaleX(1)' : 'scaleX(0)' }"></div>
            <FileText class="w-4 h-4 relative z-10" /> <span class="relative z-10">文本</span>
          </button>
          
          <button 
            @mousedown="startPress('tasks')"
            @mouseup="cancelPress('tasks')"
            @mouseleave="cancelPress('tasks')"
            @click="currentTab = 'tasks'"
            :class="['relative px-4 py-2 text-[13px] rounded-xl transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden select-none', currentTab === 'tasks' ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-white/60 hover:text-white hover:bg-white/5']"
          >
            <div v-if="pressingTab === 'tasks' || detachedTabs.includes('tasks')" :class="['absolute inset-0 bg-cyber-cyan/20 origin-left ease-linear', (pressingTab === 'tasks' && !detachedTabs.includes('tasks')) ? 'transition-transform duration-1000' : '']" :style="{ transform: isProgressFull('tasks') ? 'scaleX(1)' : 'scaleX(0)' }"></div>
            <ListTodo class="w-4 h-4 relative z-10" /> <span class="relative z-10">任务</span>
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 overflow-hidden no-drag relative bg-glass-glow rounded-b-2xl m-2 mt-0">
        <!-- Content Panel -->
        <div class="w-full h-full p-4 overflow-y-auto">
          <div class="relative z-10 min-h-full">
            <Transition name="fade" mode="out-in">
              <!-- 如果当前 Tab 已被分离，显示占位提示 -->
              <div v-if="detachedTabs.includes(currentTab)" class="w-full h-full flex flex-col items-center justify-center text-white/40 gap-3">
                <div class="w-12 h-12 rounded-full bg-cyber-cyan/10 flex items-center justify-center border border-cyber-cyan/30">
                  <GripHorizontal class="w-5 h-5 text-cyber-cyan" />
                </div>
                <p class="text-sm">该面板已在独立窗口打开</p>
              </div>
              
              <!-- 正常内容 -->
              <UrlManager v-else-if="currentTab === 'urls'" :data="urls" @update="updateUrls" />
              <TextManager v-else-if="currentTab === 'texts'" :data="texts" @update="updateTexts" />
              <TaskManager v-else-if="currentTab === 'tasks'" :data="tasks" @update="updateTasks" />
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Cpu, X, Link as LinkIcon, FileText, ListTodo, GripHorizontal } from 'lucide-vue-next'
import UrlManager from './UrlManager.vue'
import TextManager from './TextManager.vue'
import TaskManager from './TaskManager.vue'

const isExpanded = ref(false)
const currentTab = ref('urls')

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

// 双击右键关闭应用
let rightClickCount = 0
let rightClickTimer = null
const DOUBLE_CLICK_DELAY = 300 // 毫秒阈值

// 拖拽与点击交互逻辑
let isDragging = false
let startX = 0
let startY = 0
let startTime = 0
const DRAG_THRESHOLD = 5 // 像素阈值
const TIME_THRESHOLD = 250 // 毫秒阈值

// 右键双击关闭应用处理
const handleContextMenu = (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  // 右键点击计数
  rightClickCount++
  
  // 清除之前的计时器
  if (rightClickTimer) {
    clearTimeout(rightClickTimer)
  }
  
  // 如果是第二次点击，关闭应用
  if (rightClickCount === 2) {
    rightClickCount = 0
    closeApp()
    return
  }
  
  // 设置计时器，超时后重置计数
  rightClickTimer = setTimeout(() => {
    rightClickCount = 0
  }, DOUBLE_CLICK_DELAY)
}

// 关闭应用
const closeApp = () => {
  if (window.electronAPI) {
    // 通过 IPC 通知主进程退出应用
    window.electronAPI.closeApp()
  }
}

const handleMouseDown = (e) => {
  if (isExpanded.value) return
  
  // 右键点击不处理拖拽和点击
  if (e.button === 2) return
  
  isDragging = false
  startX = e.screenX
  startY = e.screenY
  startTime = Date.now()

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e) => {
  const deltaX = e.screenX - startX
  const deltaY = e.screenY - startY

  // 如果移动超过阈值，判定为拖拽
  if (!isDragging) {
    const moveDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (moveDist > DRAG_THRESHOLD) {
      isDragging = true
    }
  }

  if (isDragging && window.electronAPI?.moveWindow) {
    window.electronAPI.moveWindow(Math.round(deltaX), Math.round(deltaY))
    startX = e.screenX
    startY = e.screenY
  }
}

const handleMouseUp = (e) => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)

  // 如果右键菜单已显示，不触发展开
  if (showContextMenu.value) return

  const duration = Date.now() - startTime
  const deltaX = Math.abs(e.screenX - startX)
  const deltaY = Math.abs(e.screenY - startY)

  // 判定为点击的条件：没有明显的拖拽位移，且按下时间较短
  if (!isDragging && duration < TIME_THRESHOLD && deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
    toggleExpand()
  }
}

const urls = ref([])
const texts = ref([])
const tasks = ref([])
const contentPanelRef = ref(null)

let unsubscribeData = null
let unsubscribeDetached = null

// 长按分离逻辑状态
const pressingTab = ref(null)
const isPressing = ref(false)
let pressTimer = null

// 记录已经分离的标签
const detachedTabs = ref([])

const toggleExpand = () => {
  // 收起时清理所有状态
  if (isExpanded.value) {
    showContextMenu.value = false
    pressingTab.value = null
    isPressing.value = false
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
  }
  
  isExpanded.value = !isExpanded.value
  
  if (window.electronAPI) {
    if (isExpanded.value) {
      window.electronAPI.resizeMainWindow(600, 650)
    } else {
      window.electronAPI.resizeMainWindow(60, 60)
    }
  }
  
  // 收起后强制重绘
  if (!isExpanded.value) {
    setTimeout(() => {
      // 触发一次微小的重绘
      const container = document.querySelector('.glass-panel')
      if (container) {
        container.style.transform = 'scale(1)'
      }
    }, 50)
  }
}

// 检查是否保持满进度条
const isProgressFull = (tab) => {
  return detachedTabs.value.includes(tab) || (pressingTab.value === tab && isPressing.value)
}

// 开始长按
const startPress = (tab) => {
  // 如果已经分离了，就不再触发长按
  if (detachedTabs.value.includes(tab)) return
  
  pressingTab.value = tab
  
  // 使用 nextTick 或 setTimeout 确保动画能够触发
  setTimeout(() => {
    isPressing.value = true
  }, 10)
  
  // 1秒后触发分离
  pressTimer = setTimeout(() => {
    if (isPressing.value) {
      startDragDetach(tab)
      // 分离后不要立刻取消状态，让它保持满
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
  }, 1000)
}

// 取消长按
const cancelPress = (tab) => {
  // 如果当前 tab 已经分离了，就不做回滚
  if (detachedTabs.value.includes(tab)) return

  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
  isPressing.value = false
  setTimeout(() => {
    if (!isPressing.value) pressingTab.value = null
  }, 300) // 等待进度条退回动画结束
}

// 强制清除进度条状态（用于窗口关闭合并时，无回滚动画）
const clearPressState = (tab) => {
  if (pressingTab.value === tab) {
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
    isPressing.value = false
    pressingTab.value = null
  }
}

const startDragDetach = (tabToDetach) => {
  if (window.electronAPI) {
    window.electronAPI.detachTab(tabToDetach)
    
    // 移除自动切换 Tab 的逻辑，保持在当前 Tab，由 UI 显示占位提示
  }
}

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
    // 使用保存后返回的数据刷新，确保一致性
    urls.value = savedData.urls || []
    texts.value = savedData.texts || []
    tasks.value = savedData.tasks || []
  }
}

const updateUrls = (newUrls) => { urls.value = newUrls; saveData('urls', newUrls) }
const updateTexts = (newTexts) => { texts.value = newTexts; saveData('texts', newTexts) }
const updateTasks = (newTasks) => { tasks.value = newTasks; saveData('tasks', newTasks) }

onMounted(() => {
  loadData()
  if (window.electronAPI) {
    unsubscribeData = window.electronAPI.onDataUpdated((newData) => {
      urls.value = newData.urls || []
      texts.value = newData.texts || []
      tasks.value = newData.tasks || []
    })
    
    unsubscribeDetached = window.electronAPI.onDetachedTabsUpdated((tabs) => {
      detachedTabs.value = tabs
      // 如果分离的窗口被合并，强制清除按压状态，无退回动画
      if (pressingTab.value && !tabs.includes(pressingTab.value)) {
         clearPressState(pressingTab.value)
      }
    })
  }
})

onUnmounted(() => {
  if (unsubscribeData) unsubscribeData()
  if (unsubscribeDetached) unsubscribeDetached()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
