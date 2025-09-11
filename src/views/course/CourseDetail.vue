<template>
  <div class="page-container">
    <div class="page-header">
      <div class="flex-between">
        <a-button @click="$router.go(-1)">
          <arrow-left-outlined />
          返回
        </a-button>
        <h1 class="page-title">课程详情</h1>
      </div>
    </div>
    
    <div v-if="loading" class="text-center" style="padding: 40px;">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="courseDetail">
      <a-row :gutter="[16, 16]">
        <!-- 基本信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="课程信息" class="info-card">
            <div class="course-detail-info">
              <div class="info-item">
                <span class="label">课程ID：</span>
                <span class="value">{{ courseDetail.id }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">课程日期：</span>
                <span class="value">{{ courseDetail.course_date }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">上课时间：</span>
                <span class="value">{{ courseDetail.start_time }} - {{ courseDetail.end_time }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">课程状态：</span>
                <a-tag :color="COURSE_STATUS_COLORS[courseDetail.booking_status]">
                  {{ COURSE_STATUS_TEXT[courseDetail.booking_status] }}
                </a-tag>
              </div>
              
              <div class="info-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.created_at) }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">更新时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.updated_at) }}</span>
              </div>
              
              <div v-if="courseDetail.confirmed_at" class="info-item">
                <span class="label">确认时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.confirmed_at) }}</span>
              </div>
              
              <div v-if="courseDetail.cancelled_at" class="info-item">
                <span class="label">取消时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.cancelled_at) }}</span>
              </div>
              
              <div v-if="courseDetail.cancelled_by" class="info-item">
                <span class="label">取消方：</span>
                <span class="value">{{ courseDetail.cancelled_by }}</span>
              </div>
              
              <div v-if="courseDetail.cancel_reason" class="info-item">
                <span class="label">取消原因：</span>
                <span class="value">{{ courseDetail.cancel_reason }}</span>
              </div>
              
              <div v-if="courseDetail.complete_at" class="info-item">
                <span class="label">完成时间：</span>
                <span class="value">{{ formatDateTime(courseDetail.complete_at) }}</span>
              </div>
            </div>
            
            <div class="course-actions" style="margin-top: 24px;">
              <a-popconfirm
                title="确定要删除这个课程吗？删除后不可恢复。"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete"
              >
                <a-button danger>删除课程</a-button>
              </a-popconfirm>
            </div>
          </a-card>
        </a-col>
        
        <!-- 地址信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="地址信息" class="info-card">
            <div class="address-detail-info">
              <div class="info-item">
                <span class="label">地址名称：</span>
                <span class="value">{{ courseDetail.address?.name || '-' }}</span>
              </div>
              
              <div class="info-item">
                <span class="label">详细地址：</span>
                <span class="value">{{ courseDetail.address?.detailed_address || '-' }}</span>
              </div>
              
              <div v-if="courseDetail.address?.latitude && courseDetail.address?.longitude" class="info-item">
                <span class="label">坐标：</span>
                <span class="value">
                  纬度: {{ courseDetail.address.latitude }}, 经度: {{ courseDetail.address.longitude }}
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <!-- 学员信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="学员信息" class="info-card">
            <div class="user-detail-section">
              <div class="user-avatar-section">
                <a-avatar
                  :src="courseDetail.student?.avatar_url"
                  :size="80"
                  class="user-avatar"
                >
                  <template #icon>
                    <user-outlined />
                  </template>
                </a-avatar>
              </div>
              
              <div class="user-info-section">
                <div class="info-item">
                  <span class="label">用户ID：</span>
                  <span class="value">{{ courseDetail.student?.id || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">昵称：</span>
                  <span class="value">{{ courseDetail.student?.nickname || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">手机号：</span>
                  <span class="value">{{ courseDetail.student?.phone || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">性别：</span>
                  <span class="value">{{ courseDetail.student?.gender || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">学员备注：</span>
                  <span class="value">{{ courseDetail.student_remark || '-' }}</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <!-- 教练信息 -->
        <a-col :xs="24" :lg="12">
          <a-card title="教练信息" class="info-card">
            <div class="user-detail-section">
              <div class="user-avatar-section">
                <a-avatar
                  :src="courseDetail.coach?.avatar_url"
                  :size="80"
                  class="user-avatar"
                >
                  <template #icon>
                    <user-outlined />
                  </template>
                </a-avatar>
              </div>
              
              <div class="user-info-section">
                <div class="info-item">
                  <span class="label">用户ID：</span>
                  <span class="value">{{ courseDetail.coach?.id || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">昵称：</span>
                  <span class="value">{{ courseDetail.coach?.nickname || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">手机号：</span>
                  <span class="value">{{ courseDetail.coach?.phone || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">性别：</span>
                  <span class="value">{{ courseDetail.coach?.gender || '-' }}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">教练备注：</span>
                  <span class="value">{{ courseDetail.coach_remark || '-' }}</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    
    <div v-else class="text-center" style="padding: 40px;">
      <a-empty description="课程不存在" />
    </div>
  </div>
</template>

<script setup>
/**
 * 课程详情页面
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons-vue'
import * as courseApi from '@/api/course'
import { formatDateTime } from '@/utils/format'
import { COURSE_STATUS_TEXT, COURSE_STATUS_COLORS } from '@/utils/constants'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const courseDetail = ref(null)

/**
 * 获取课程详情
 */
const getCourseDetail = async () => {
  const courseId = route.params.id
  if (!courseId) {
    message.error('课程ID无效')
    router.go(-1)
    return
  }
  
  loading.value = true
  try {
    const response = await courseApi.getCourseDetail(courseId)
    if (response.code === 200) {
      courseDetail.value = response.data
    } else {
      message.error(response.message || '获取课程详情失败')
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
    message.error('获取课程详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 删除课程
 */
const handleDelete = async () => {
  try {
    const response = await courseApi.deleteCourse(courseDetail.value.id)
    if (response.code === 200) {
      message.success('删除课程成功')
      router.go(-1)
    } else {
      message.error(response.message || '删除课程失败')
    }
  } catch (error) {
    console.error('删除课程失败:', error)
    message.error('删除课程失败')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getCourseDetail()
})
</script>

<style scoped>
.course-detail-info .info-item,
.address-detail-info .info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.course-detail-info .info-item:last-child,
.address-detail-info .info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.course-detail-info .label,
.address-detail-info .label {
  min-width: 100px;
  color: #8c8c8c;
  font-weight: 500;
}

.course-detail-info .value,
.address-detail-info .value {
  flex: 1;
  color: #262626;
  word-break: break-all;
}

.user-detail-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.user-avatar-section {
  flex-shrink: 0;
}

.user-avatar {
  border: 3px solid #f0f0f0;
}

.user-info-section {
  flex: 1;
}

.user-info-section .info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info-section .info-item:last-child {
  margin-bottom: 0;
}

.user-info-section .label {
  min-width: 80px;
  color: #8c8c8c;
  font-weight: 500;
}

.user-info-section .value {
  flex: 1;
  color: #262626;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-detail-section {
    flex-direction: column;
    text-align: center;
  }
  
  .user-info-section {
    text-align: left;
  }
}
</style>
