import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  }),
  
  actions: {
    // 添加新帖子
    addPost(post) {
      this.posts.unshift(post)
      // 保存到本地存储
      try {
        uni.setStorageSync('posts', JSON.stringify(this.posts))
      } catch (e) {
        console.error('保存帖子失败:', e)
      }
    },
    
    // 获取帖子列表
    async getPosts(page = 1) {
      if (this.loading) return []
      
      this.loading = true
      this.page = page
      
      try {
        if (page === 1 && this.posts.length === 0) {
          // 首次加载或刷新时，添加一些测试数据
          this.posts = [
            {
              id: 1,
              content: '今天天气真好，心情也不错~',
              createTime: '2024-03-29 10:00',
              user: {
                id: 1,
                name: '测试用户',
                avatar: '/static/default-avatar.png'
              },
              commentCount: 5,
              likeCount: 3
            },
            {
              id: 2,
              content: '学习编程中，加油！💪',
              createTime: '2024-03-29 09:30',
              user: {
                id: 2,
                name: '小明',
                avatar: '/static/default-avatar.png'
              },
              commentCount: 3,
              likeCount: 1
            }
          ]
        }
      
      // 模拟分页
      const start = (page - 1) * this.pageSize
      const end = start + this.pageSize
      const pagePosts = this.posts.slice(start, end)
      
        // 更新是否有更多数据
      this.hasMore = end < this.posts.length
      
        return pagePosts
      } catch (error) {
        console.error('获取帖子列表失败:', error)
        return []
      } finally {
      this.loading = false
      }
    },
    
    // 从本地存储获取
    getPosts() {
      try {
        const posts = uni.getStorageSync('posts')
        if (posts) {
          this.posts = JSON.parse(posts)
        }
      } catch (e) {
        console.error('获取帖子失败:', e)
      }
      return this.posts
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'posts',
        storage: localStorage
      }
    ]
  }
}) 