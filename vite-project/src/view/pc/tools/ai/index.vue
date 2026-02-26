<template>
  <div class="ai-tool-workspace">
    <!-- 顶部导航与全局控制 -->
    <el-header class="ai-header" height="64px">
      <div class="header-left">
        <el-button link :icon="Fold" v-if="!sidebarCollapsed" @click="sidebarCollapsed = true" />
        <el-button link :icon="Expand" v-else @click="sidebarCollapsed = false" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">工作台</el-breadcrumb-item>
          <el-breadcrumb-item>AI工具中心</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentCategoryName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-tooltip content="全局提示" placement="bottom">
          <el-badge :value="5" :hidden="false" class="item">
            <el-button :icon="Bell" circle size="small" />
          </el-badge>
        </el-tooltip>
        <el-dropdown>
          <span class="user-profile">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span>AI研究员</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>API密钥管理</el-dropdown-item>
              <el-dropdown-item>使用配额</el-dropdown-item>
              <el-dropdown-item divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="ai-layout">
      <!-- 左侧分类菜单 - AI工具专属导航 -->
      <el-aside :width="sidebarCollapsed ? '64px' : '260px'" class="ai-sidebar">
        <div class="sidebar-header">
          <el-icon v-if="!sidebarCollapsed" size="24" color="#409EFF"><Cpu /></el-icon>
          <span v-if="!sidebarCollapsed" class="sidebar-title">AI工具分类</span>
          <el-icon v-else size="24" color="#409EFF"><Cpu /></el-icon>
        </div>

        <el-menu
          :default-active="activeCategory"
          class="category-menu"
          :collapse="sidebarCollapsed"
          :collapse-transition="true"
          @select="handleCategorySelect"
        >
          <el-menu-item index="overview">
            <el-icon><Grid /></el-icon>
            <span>总览仪表板</span>
          </el-menu-item>
          
          <el-sub-menu index="llm">
            <template #title>
              <el-icon><ChatLineRound /></el-icon>
              <span>大语言模型</span>
            </template>
            <el-menu-item index="chat">对话机器人</el-menu-item>
            <el-menu-item index="completion">文本生成</el-menu-item>
            <el-menu-item index="code">代码助手</el-menu-item>
            <el-menu-item index="translate">翻译引擎</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="vision">
            <template #title>
              <el-icon><Picture /></el-icon>
              <span>计算机视觉</span>
            </template>
            <el-menu-item index="image-gen">图像生成</el-menu-item>
            <el-menu-item index="image-edit">图像编辑</el-menu-item>
            <el-menu-item index="ocr">文字识别OCR</el-menu-item>
            <el-menu-item index="face-detect">人脸检测</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="audio">
            <template #title>
              <el-icon><Microphone /></el-icon>
              <span>语音音频</span>
            </template>
            <el-menu-item index="asr">语音识别</el-menu-item>
            <el-menu-item index="tts">语音合成</el-menu-item>
            <el-menu-item index="audio-tag">音频标签</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="embedding">
            <template #title>
              <el-icon><DataLine /></el-icon>
              <span>向量与嵌入</span>
            </template>
            <el-menu-item index="text-embed">文本嵌入</el-menu-item>
            <el-menu-item index="image-embed">图像嵌入</el-menu-item>
            <el-menu-item index="similarity">相似度计算</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="multimodal">
            <el-icon><Monitor /></el-icon>
            <span>多模态模型</span>
          </el-menu-item>

          <el-menu-item index="training">
            <el-icon><TrendCharts /></el-icon>
            <span>微调与训练</span>
          </el-menu-item>

          <el-menu-item index="evaluation">
            <el-icon><DataAnalysis /></el-icon>
            <span>模型评估</span>
          </el-menu-item>
        </el-menu>

        <!-- 折叠后底部快速操作 -->
        <div v-if="!sidebarCollapsed" class="sidebar-footer">
          <el-button type="primary" plain :icon="Plus" size="small" style="width: 100%;">新建实验</el-button>
          <div class="quota-info">
            <div class="quota-label">
              <span>今日配额</span>
              <span>2.4k / 5k</span>
            </div>
            <el-progress :percentage="48" :stroke-width="6" striped striped-flow />
          </div>
        </div>
        <div v-else class="sidebar-footer-collapsed">
          <el-tooltip content="新建实验" placement="right">
            <el-button :icon="Plus" circle type="primary" plain size="small" />
          </el-tooltip>
        </div>
      </el-aside>

      <!-- 右侧主内容区域 - AI工具使用界面 -->
      <el-main class="ai-content">
        <!-- 当前分类的标题和描述 -->
        <div class="category-header">
          <div>
            <h2 class="category-title">{{ currentCategoryName }}</h2>
            <p class="category-desc">{{ categoryDescription }}</p>
          </div>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button value="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 模型快速切换/全局参数 -->
        <el-card class="global-config" shadow="never">
          <el-row :gutter="24" align="middle">
            <el-col :span="6">
              <span class="config-label">默认模型</span>
              <el-select v-model="defaultModel" placeholder="选择模型" size="small" style="width: 160px;">
                <el-option label="GPT-4 Turbo" value="gpt4" />
                <el-option label="Claude 3 Opus" value="claude" />
                <el-option label="文心一言 4.0" value="ernie" />
                <el-option label="通义千问 Max" value="qwen" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <span class="config-label">温度</span>
              <el-slider v-model="temperature" :min="0" :max="2" :step="0.1" size="small" style="width: 160px;" />
            </el-col>
            <el-col :span="6">
              <span class="config-label">最大输出</span>
              <el-input-number v-model="maxTokens" :min="1" :max="4096" size="small" controls-position="right" style="width: 140px;" />
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <el-button type="primary" :icon="VideoPlay" size="small">批量运行</el-button>
              <el-button :icon="Histogram" size="small">查看用量</el-button>
            </el-col>
          </el-row>
        </el-card>

        <!-- 工具卡片网格 / 列表 (根据viewMode切换) -->
        <div v-if="viewMode === 'grid'" class="tool-grid-container">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tool in currentTools" :key="tool.id">
              <el-card class="ai-tool-card" shadow="hover" body-style="padding: 0;" @click="openToolDialog(tool)">
                <div class="tool-card-media" :style="{ backgroundColor: tool.bgColor + '20' }">
                  <el-icon :size="36" :color="tool.color"><component :is="tool.icon" /></el-icon>
                </div>
                <div class="tool-card-info">
                  <h4>{{ tool.name }}</h4>
                  <p>{{ tool.description }}</p>
                  <div class="tool-badges">
                    <el-tag size="small" round>{{ tool.provider }}</el-tag>
                    <el-tag size="small" round type="info" v-if="tool.latency">延迟 {{ tool.latency }}ms</el-tag>
                  </div>
                </div>
                <div class="tool-card-footer">
                  <span class="price-badge">{{ tool.price || '按量付费' }}</span>
                  <el-button link type="primary" :icon="ArrowRight" @click.stop="openToolDialog(tool)">使用</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-else class="tool-list-container">
          <el-table :data="currentTools" style="width: 100%" @row-click="openToolDialog">
            <el-table-column width="50">
              <template #default="{ row }">
                <el-icon :color="row.color"><component :is="row.icon" /></el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="工具名称" width="180" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column prop="provider" label="提供商" width="120" />
            <el-table-column label="延迟" width="100">
              <template #default="{ row }">{{ row.latency || '-' }} ms</template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click.stop="openToolDialog(row)">打开</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 最近使用记录 -->
        <el-card class="recent-usage" shadow="never">
          <template #header>
            <div class="recent-header">
              <span><el-icon><Clock /></el-icon> 最近使用</span>
              <el-button link type="primary">查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in recentRecords"
              :key="index"
              :timestamp="record.time"
              :type="record.type"
              :size="'small'"
            >
              {{ record.action }} —— {{ record.model }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-main>
    </el-container>

    <!-- AI工具使用对话框 (模拟) -->
    <el-dialog v-model="dialogVisible" :title="currentTool?.name" width="700px" destroy-on-close>
      <div v-if="currentTool">
        <el-alert :title="'当前使用模型: ' + defaultModel" type="info" :closable="false" style="margin-bottom: 20px;" />
        
        <el-form label-width="80px">
          <el-form-item label="输入内容">
            <el-input
              v-model="promptInput"
              type="textarea"
              :rows="4"
              placeholder="请输入你的问题或指令..."
            />
          </el-form-item>
          
          <el-form-item label="高级选项">
            <el-space wrap>
              <el-checkbox v-model="streamOutput">流式输出</el-checkbox>
              <el-checkbox v-model="enableSearch">启用联网搜索</el-checkbox>
              <el-checkbox v-model="enableMemory">记忆上下文</el-checkbox>
            </el-space>
          </el-form-item>
          
          <el-form-item label="输出结果">
            <el-input
              v-model="outputResult"
              type="textarea"
              :rows="6"
              readonly
              placeholder="生成的结果将显示在这里..."
            />
          </el-form-item>
        </el-form>
        
        <div class="dialog-footer">
          <el-button @click="simulateRun" :loading="running" type="primary">
            {{ running ? '生成中...' : '运行' }}
          </el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  Cpu, Grid, ChatLineRound, Picture, Microphone, DataLine,
  Monitor, TrendCharts, DataAnalysis, Plus, VideoPlay, Histogram,
  ArrowRight, Clock, Bell, ArrowDown, Fold, Expand, List,
  Edit, Document, MagicStick, Reading, CopyDocument,
  Opportunity, SetUp, Tickets, ShoppingCart, Files
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {outGet} from '@/service'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 当前选中的分类
const activeCategory = ref('chat')
// 视图模式: grid 或 list
const viewMode = ref('grid')

// 全局参数
const defaultModel = ref('gpt4')
const temperature = ref(0.7)
const maxTokens = ref(2048)

// 对话框控制
const dialogVisible = ref(false)
const currentTool = ref(null)
const promptInput = ref('')
const outputResult = ref('')
const running = ref(false)
const streamOutput = ref(false)
const enableSearch = ref(false)
const enableMemory = ref(true)

// 分类名称映射
const categoryNames = {
  overview: '总览仪表板',
  chat: '对话机器人',
  completion: '文本生成',
  code: '代码助手',
  translate: '翻译引擎',
  'image-gen': '图像生成',
  'image-edit': '图像编辑',
  ocr: '文字识别OCR',
  'face-detect': '人脸检测',
  asr: '语音识别',
  tts: '语音合成',
  'audio-tag': '音频标签',
  'text-embed': '文本嵌入',
  'image-embed': '图像嵌入',
  similarity: '相似度计算',
  multimodal: '多模态模型',
  training: '微调与训练',
  evaluation: '模型评估'
}

const categoryDescriptions = {
  overview: '查看所有AI工具的使用情况和性能指标',
  chat: '智能对话机器人，支持多轮交互和上下文理解',
  completion: '根据提示生成各类文本内容，包括文章、邮件、故事等',
  code: '代码生成、解释、调试和转换的AI助手',
  translate: '多语言互译，支持专业领域术语优化',
  'image-gen': '根据文字描述生成高质量图像',
  'image-edit': '图像修复、扩展、风格迁移等编辑功能',
  ocr: '从图片和文档中提取文字信息',
  'face-detect': '人脸检测、关键点定位和属性分析',
  asr: '将语音转换为文字的自动语音识别',
  tts: '将文字转换为自然流畅的语音',
  'audio-tag': '音频内容识别和标签分类',
  'text-embed': '将文本转换为向量嵌入表示',
  'image-embed': '将图像转换为向量嵌入表示',
  similarity: '计算文本或图像的相似度',
  multimodal: '同时处理文字、图像、音频的多模态模型',
  training: '模型微调和定制化训练服务',
  evaluation: '评估模型性能和输出质量'
}

const currentCategoryName = computed(() => categoryNames[activeCategory.value] || 'AI工具')
const categoryDescription = computed(() => categoryDescriptions[activeCategory.value] || '请选择具体的AI工具分类')

// 根据分类展示不同的工具列表
const currentTools = computed(() => {
  // 模拟不同分类下的工具数据
  const toolsByCategory = {
    chat: [
      { id: 'c1', name: 'GPT-4 对话', description: '支持函数调用、知识库检索', icon: 'ChatLineRound', color: '#409EFF', bgColor: '#409EFF', provider: 'OpenAI', latency: 320, price: '0.03$/次' },
      { id: 'c2', name: 'Claude 3 对话', description: '长上下文、安全对齐', icon: 'ChatLineRound', color: '#9b59b6', bgColor: '#9b59b6', provider: 'Anthropic', latency: 450, price: '0.04$/次' },
      { id: 'c3', name: '文心一言', description: '中文优化、知识增强', icon: 'ChatLineRound', color: '#e67e22', bgColor: '#e67e22', provider: '百度', latency: 280, price: '0.02$/次' },
      { id: 'c4', name: '通义千问', description: '电商/办公场景增强', icon: 'ChatLineRound', color: '#1abc9c', bgColor: '#1abc9c', provider: '阿里', latency: 310, price: '0.025$/次' }
    ],
    'image-gen': [
      { id: 'i1', name: 'Stable Diffusion 3', description: '高质量文生图', icon: 'Picture', color: '#f56c6c', bgColor: '#f56c6c', provider: 'Stability AI', latency: 2450, price: '0.08$/张' },
      { id: 'i2', name: 'DALL·E 3', description: '创意图像生成', icon: 'Picture', color: '#409EFF', bgColor: '#409EFF', provider: 'OpenAI', latency: 3200, price: '0.12$/张' },
      { id: 'i3', name: 'Midjourney 6', description: '艺术风格渲染', icon: 'MagicStick', color: '#9b59b6', bgColor: '#9b59b6', provider: 'Midjourney', latency: 4100, price: '0.15$/张' }
    ],
    asr: [
      { id: 'a1', name: 'Whisper Large', description: '多语言语音识别', icon: 'Microphone', color: '#67c23a', bgColor: '#67c23a', provider: 'OpenAI', latency: 850, price: '0.01$/分钟' },
      { id: 'a2', name: '语音识别-中文', description: '中文优化识别', icon: 'Microphone', color: '#e6a23c', bgColor: '#e6a23c', provider: '阿里', latency: 420, price: '0.008$/分钟' }
    ],
    'text-embed': [
      { id: 'e1', name: 'text-embedding-3', description: '1536维向量', icon: 'DataLine', color: '#409EFF', bgColor: '#409EFF', provider: 'OpenAI', latency: 180, price: '0.0001$/千token' },
      { id: 'e2', name: 'bge-large-zh', description: '中文检索优化', icon: 'DataLine', color: '#f56c6c', bgColor: '#f56c6c', provider: '智源', latency: 220, price: '免费' }
    ]
  }
  
  // 如果当前分类有数据则返回，否则返回一个默认展示数据
  return toolsByCategory[activeCategory.value] || toolsByCategory.chat
})

// 最近使用记录
const recentRecords = ref([
  { action: '使用GPT-4完成代码审查', model: 'GPT-4 Turbo', time: '5分钟前', type: 'primary' },
  { action: '通过Stable Diffusion生成产品图', model: 'SD 3', time: '32分钟前', type: 'success' },
  { action: '调用Whisper转写会议录音', model: 'Whisper Large', time: '2小时前', type: 'info' },
  { action: '文本向量化检索', model: 'text-embedding-3', time: '3小时前', type: '' }
])

// 分类选择处理
const handleCategorySelect = (index) => {
  activeCategory.value = index
}

// 打开工具对话框
const openToolDialog = (tool) => {
  currentTool.value = tool
  dialogVisible.value = true
  promptInput.value = ''
  outputResult.value = ''
}

// 模拟运行AI工具
const simulateRun = () => {
  if (!promptInput.value.trim()) {
    ElMessage.warning('请输入一些内容')
    return
  }
  
  outGet('/api2/v2.1/tti',{},{
    "header": {
      "app_id": "99c016c8",
    },
    "parameter": {
        "chat": {
            "domain": "xopqwentti20b",
            "width":768,
            "height":768,
            "seed":42,
            "num_inference_steps":20,
            "guidance_scale":5.0,
            "scheduler":"Euler",
        }
    },
    "payload": {
        "message": {
            "text": [
                {"role": "user", "content": "Draw a mountain."}
            ]
        },
        "negative_prompts":{
            "text":"black and white"
        }
    }
})

  running.value = true
  outputResult.value = ''
  
  setTimeout(() => {
    const demos = [
      '这是一个模拟的AI生成结果。在实际应用中，这里会显示模型生成的文本内容。\n\n人工智能正在改变我们工作和生活的方式。通过大语言模型，我们可以更高效地处理信息、创造内容和解决问题。',
      '根据您的输入，AI建议如下：\n1. 考虑使用更具体的描述\n2. 可以尝试调整温度参数获得更多样化的输出\n3. 最大输出长度已设置为 ' + maxTokens.value + ' token'
    ]
    outputResult.value = demos[Math.floor(Math.random() * demos.length)]
    running.value = false
    
    // 添加到最近使用记录
    recentRecords.value.unshift({
      action: `使用 ${currentTool.value.name} 生成内容`,
      model: defaultModel.value,
      time: '刚刚',
      type: 'primary'
    })
    
    ElMessage.success('生成完成')
  }, 2000)
}

// 监听分类变化
watch(activeCategory, () => {
  // 切换分类时可以重置一些状态
})
</script>

<style scoped>
.ai-tool-workspace {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.ai-header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ai-layout {
  height: calc(100vh - 64px);
}

.ai-sidebar {
  background-color: white;
  border-right: 1px solid #e5e7eb;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.sidebar-title {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}

.category-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.category-menu:not(.el-menu--collapse) {
  width: 260px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f0f2f5;
}

.quota-info {
  margin-top: 16px;
}

.quota-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.sidebar-footer-collapsed {
  padding: 16px 0;
  text-align: center;
}

.ai-content {
  background-color: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1e293b;
}

.category-desc {
  color: #6b7280;
  margin: 0;
}

.global-config {
  margin-bottom: 24px;
  background-color: white;
  border: none;
}

.config-label {
  font-size: 13px;
  color: #6b7280;
  margin-right: 12px;
}

.tool-grid-container {
  margin-bottom: 30px;
}

.ai-tool-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #edf2f7;
}

.ai-tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}

.tool-card-media {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.tool-card-info {
  padding: 16px;
}

.tool-card-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.tool-card-info p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-card-footer {
  padding: 12px 16px;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafbfc;
}

.price-badge {
  font-size: 12px;
  color: #67c23a;
  background-color: #f0f9eb;
  padding: 2px 8px;
  border-radius: 12px;
}

.tool-list-container {
  margin-bottom: 30px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
}

.recent-usage {
  background-color: white;
  border: none;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-header span {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>