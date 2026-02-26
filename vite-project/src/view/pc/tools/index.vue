<template>
  <div class="tool-platform">
    <!-- 头部导航 -->
    <el-header class="platform-header" height="70px">
      <div class="header-left">
        <div class="logo-area">
          <el-icon :size="28" color="#409EFF"><Monitor /></el-icon>
          <span class="app-name">灵境 · 工具矩阵</span>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">工作台</el-breadcrumb-item>
          <el-breadcrumb-item>集成工具</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索工具..."
          :prefix-icon="Search"
          size="small"
          clearable
          style="width: 200px; margin-right: 16px;"
        />
        <el-badge :value="3" class="notice-badge">
          <el-button :icon="Bell" circle size="small" />
        </el-badge>
        <el-dropdown>
          <span class="user-profile">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span>开发者</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item>API 密钥</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main class="platform-main">
      <!-- 快捷状态卡片 -->
      <el-row :gutter="20" class="stat-row">
        <el-col :span="6" v-for="stat in statistics" :key="stat.label">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-number">{{ stat.value }}</div>
              </div>
              <el-icon :size="36" :color="stat.color"><component :is="stat.icon" /></el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 工具分类标签页 -->
      <el-tabs v-model="activeTab" class="tool-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="全部工具" name="all">
          <template #label>
            <span><el-icon><Grid /></el-icon> 全部工具</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="AI 工具" name="ai">
          <template #label>
            <span><el-icon><Cpu /></el-icon> AI 工具</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="爬虫工具" name="crawler">
          <template #label>
            <span><el-icon><Share /></el-icon> 爬虫工具</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="数据处理" name="data">
          <template #label>
            <span><el-icon><DataLine /></el-icon> 数据处理</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="实用工具" name="utility">
          <template #label>
            <span><el-icon><Tools /></el-icon> 实用工具</span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 工具卡片网格 -->
      <el-row :gutter="20" class="tool-grid">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tool in filteredTools" :key="tool.id">
          <el-card class="tool-card" shadow="hover" body-style="padding: 0;">
            <div class="tool-card-header" :style="{ borderLeftColor: tool.color }">
              <div class="tool-icon" :class="'icon-bg-' + tool.colorName">
                <el-icon :size="24"><component :is="tool.icon" /></el-icon>
              </div>
              <div class="tool-actions">
                <el-switch
                  v-model="tool.status"
                  :active-value="'active'"
                  :inactive-value="'inactive'"
                  active-color="#13ce66"
                  inline-prompt
                  :active-icon="Check"
                  :inactive-icon="Close"
                  size="small"
                  @change="handleStatusChange(tool)"
                />
                <el-dropdown trigger="click" @command="handleCommand($event, tool)">
                  <el-button link :icon="MoreFilled" style="margin-left: 4px;" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑配置</el-dropdown-item>
                      <el-dropdown-item command="logs">查看日志</el-dropdown-item>
                      <el-dropdown-item command="docs">使用文档</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>移除工具</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="tool-card-body">
              <h3 class="tool-title">{{ tool.name }}</h3>
              <p class="tool-desc">{{ tool.description }}</p>
              <div class="tool-meta">
                <span class="meta-tag" v-if="tool.category === 'ai'">
                  <el-icon><Cpu /></el-icon> AI模型: {{ tool.model || 'gpt-4' }}
                </span>
                <span class="meta-tag" v-else-if="tool.category === 'crawler'">
                  <el-icon><Share /></el-icon> 并发: {{ tool.concurrency || 8 }}
                </span>
                <span class="meta-tag" v-else>
                  <el-icon><Clock /></el-icon> 最后运行: {{ tool.lastRun || '刚刚' }}
                </span>
                <el-tag size="small" :type="tool.status === 'active' ? 'success' : 'info'" effect="plain" round>
                  {{ tool.status === 'active' ? '运行中' : '已停用' }}
                </el-tag>
              </div>
            </div>
            <div class="tool-card-footer">
              <el-progress 
                :percentage="tool.usage" 
                :format="() => `${tool.usage}% 负载`" 
                :stroke-width="6"
                :color="tool.usage > 80 ? '#f56c6c' : (tool.usage > 50 ? '#e6a23c' : '#67c23a')"
              />
            </div>
          </el-card>
        </el-col>
        
        <!-- 空状态 -->
        <el-col v-if="filteredTools.length === 0" :span="24">
          <el-empty description="没有找到匹配的工具" :image-size="200" />
        </el-col>
      </el-row>

      <!-- 底部添加工具栏 -->
      <el-card class="add-tool-bar" shadow="never">
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <span style="color: #606266; font-size: 14px;">
              <el-icon><Plus /></el-icon> 从应用市场添加更多工具
            </span>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" plain :icon="Plus">浏览工具库</el-button>
            <el-button type="primary" :icon="Upload">导入自定义工具</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Monitor, Bell, ArrowDown, Search, Grid, Cpu, Share, 
  DataLine, Tools, MoreFilled, Check, Close, Plus, 
  Upload, Clock, Document, Picture, ChatLineRound,
  TrendCharts, Notification, Aim, FolderOpened
} from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')
// 当前激活的标签页
const activeTab = ref('all')

// 统计数据
const statistics = ref([
  { label: '活跃工具', value: 8, icon: 'Monitor', color: '#409EFF' },
  { label: '今日执行', value: '1.2k', icon: 'TrendCharts', color: '#67C23A' },
  { label: '待处理任务', value: 3, icon: 'Notification', color: '#E6A23C' },
  { label: '爬取数据量', value: '45GB', icon: 'FolderOpened', color: '#F56C6C' }
])

// 工具数据
const tools = ref([
  {
    id: 1,
    name: '智能对话代理 (AI)',
    description: '基于gpt-4的对话接口，支持上下文记忆、函数调用',
    icon: 'ChatLineRound',
    color: '#409EFF',
    colorName: 'blue',
    category: 'ai',
    model: 'gpt-4-turbo',
    status: 'active',
    usage: 76,
    lastRun: '2分钟前'
  },
  {
    id: 2,
    name: '通用爬虫引擎',
    description: '分布式爬虫，支持JS渲染、自定义解析规则',
    icon: 'Share',
    color: '#67C23A',
    colorName: 'green',
    category: 'crawler',
    concurrency: 16,
    status: 'active',
    usage: 88,
    lastRun: '刚刚'
  },
  {
    id: 3,
    name: '文档解析器',
    description: '智能解析PDF/Word/Excel，提取表格与文本',
    icon: 'Document',
    color: '#E6A23C',
    colorName: 'orange',
    category: 'data',
    status: 'inactive',
    usage: 12,
    lastRun: '昨天'
  },
  {
    id: 4,
    name: 'AI 图像生成',
    description: 'Stable Diffusion 接口，支持图生图、高清修复',
    icon: 'Picture',
    color: '#F56C6C',
    colorName: 'red',
    category: 'ai',
    model: 'sdxl-turbo',
    status: 'active',
    usage: 45,
    lastRun: '15分钟前'
  },
  {
    id: 5,
    name: '社交媒体爬虫',
    description: '采集微博/小红书/抖音公开数据，自动登录处理',
    icon: 'Aim',
    color: '#9b59b6',
    colorName: 'purple',
    category: 'crawler',
    concurrency: 8,
    status: 'active',
    usage: 62,
    lastRun: '1小时前'
  },
  {
    id: 6,
    name: '定时调度器',
    description: 'cron风格任务编排，支持依赖和重试策略',
    icon: 'Clock',
    color: '#34495e',
    colorName: 'gray',
    category: 'utility',
    status: 'active',
    usage: 30,
    lastRun: '3小时前'
  },
  {
    id: 7,
    name: '数据清洗工具',
    description: '去重、格式转换、缺失值处理，支持自定义脚本',
    icon: 'DataLine',
    color: '#1abc9c',
    colorName: 'teal',
    category: 'data',
    status: 'inactive',
    usage: 5,
    lastRun: '上周'
  },
  {
    id: 8,
    name: '代理IP池管理',
    description: '动态代理隧道，自动检测可用性，API获取',
    icon: 'Share',
    color: '#e67e22',
    colorName: 'orange',
    category: 'crawler',
    concurrency: 128,
    status: 'active',
    usage: 95,
    lastRun: '5分钟前'
  }
])

// 根据标签和搜索过滤工具
const filteredTools = computed(() => {
  let result = tools.value
  if (activeTab.value !== 'all') {
    result = result.filter(t => t.category === activeTab.value)
  }
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(keyword) || 
      t.description.toLowerCase().includes(keyword)
    )
  }
  return result
})

// 标签切换处理
const handleTabClick = () => {
  // 可以在这里埋点统计
}

// 工具状态切换
const handleStatusChange = (tool) => {
  console.log(`工具 ${tool.name} 状态变为: ${tool.status}`)
  // 模拟调用API
  ElMessage({
    type: tool.status === 'active' ? 'success' : 'info',
    message: `${tool.name} 已${tool.status === 'active' ? '启动' : '停止'}`
  })
}

// 下拉菜单命令
const handleCommand = (cmd, tool) => {
  switch (cmd) {
    case 'edit':
      ElMessage.info(`编辑 ${tool.name} 配置`)
      break
    case 'logs':
      ElMessage.info(`查看 ${tool.name} 运行日志`)
      break
    case 'docs':
      window.open('https://example.com/docs', '_blank')
      break
    case 'delete':
      ElMessageBox.confirm(`确定要移除工具“${tool.name}”吗？`, '提示', {
        confirmButtonText: '移除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tools.value = tools.value.filter(t => t.id !== tool.id)
        ElMessage.success('工具已移除')
      }).catch(() => {})
      break
  }
}

// 引入Message和MessageBox（实际项目中需要从element-plus导入）
import { ElMessage, ElMessageBox } from 'element-plus'
</script>

<style scoped>
.tool-platform {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.platform-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  gap: 32px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  color: #1e293b;
}

.app-name {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.notice-badge :deep(.el-badge__content) {
  top: 4px;
  right: 6px;
}

.platform-main {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.stat-row {
  margin-bottom: 24px;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
}

.tool-tabs {
  margin: 16px 0 24px 0;
  background: white;
  padding: 0 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.tool-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.tool-tabs :deep(.el-tabs__item) {
  height: 56px;
  font-size: 14px;
}

.tool-grid {
  margin-bottom: 30px;
}

.tool-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.tool-card:hover {
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.tool-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px 16px;
  border-left: 4px solid transparent;
}

.tool-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg-blue { background: #e8f0fe; color: #409EFF; }
.icon-bg-green { background: #e8f5e9; color: #67c23a; }
.icon-bg-orange { background: #fef5e7; color: #e6a23c; }
.icon-bg-red { background: #fef0f0; color: #f56c6c; }
.icon-bg-purple { background: #f3e8ff; color: #9b59b6; }
.icon-bg-gray { background: #edf2f7; color: #34495e; }
.icon-bg-teal { background: #e0f2f1; color: #1abc9c; }

.tool-actions {
  display: flex;
  align-items: center;
}

.tool-card-body {
  padding: 0 16px 16px 16px;
}

.tool-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0 6px 0;
  color: #1e293b;
}

.tool-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-tag {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f9fafb;
  padding: 4px 8px;
  border-radius: 20px;
}

.tool-card-footer {
  padding: 12px 16px 16px 16px;
  background: #fafbfc;
  border-top: 1px solid #f0f2f5;
}

.add-tool-bar {
  margin-top: 20px;
  border: 1px dashed #d0d7de;
  background: #f8fafd;
  border-radius: 16px;
}

.add-tool-bar :deep(.el-card__body) {
  padding: 20px 24px;
}
</style>