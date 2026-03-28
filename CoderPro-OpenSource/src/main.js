import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 禁用右键菜单
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

createApp(App).mount('#app')