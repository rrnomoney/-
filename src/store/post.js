import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
	state: () => ({
		postList: [],
		myPosts: [],
		currentPost: null,
		loading: false,
		hasMore: true
	}),
	
	getters: {
		getPostList: (state) => state.postList,
		getMyPosts: (state) => state.myPosts,
		getCurrentPost: (state) => state.currentPost,
		getLoading: (state) => state.loading,
		getHasMore: (state) => state.hasMore
	},
	
	actions: {
		// 设置帖子列表
		setPostList(list) {
			this.postList = list
		},
		
		// 添加帖子列表
		appendPostList(list) {
			this.postList = [...this.postList, ...list]
		},
		
		// 设置我的帖子
		setMyPosts(list) {
			this.myPosts = list
		},
		
		// 设置当前帖子
		setCurrentPost(post) {
			this.currentPost = post
		},
		
		// 设置加载状态
		setLoading(status) {
			this.loading = status
		},
		
		// 设置是否有更多
		setHasMore(status) {
			this.hasMore = status
		},
		
		// 获取帖子列表
		async getPosts(page = 1) {
			if (this.loading || !this.hasMore) return
			
			this.setLoading(true)
			try {
				// TODO: 调用获取帖子列表接口
				// const res = await getPostsApi(page)
				// if (page === 1) {
				// 	this.setPostList(res.list)
				// } else {
				// 	this.appendPostList(res.list)
				// }
				// this.setHasMore(res.hasMore)
				
				// 模拟数据
				const mockData = {
					list: [
						{
							id: '1',
							content: '今天天气真好，心情也不错~',
							createTime: '2024-03-29 10:00',
							commentCount: 5
						},
						{
							id: '2',
							content: '最近工作压力有点大，想找人聊聊...',
							createTime: '2024-03-29 09:30',
							commentCount: 3
						}
					],
					hasMore: false
				}
				
				if (page === 1) {
					this.setPostList(mockData.list)
				} else {
					this.appendPostList(mockData.list)
				}
				this.setHasMore(mockData.hasMore)
				
				return true
			} catch (error) {
				console.error('获取帖子列表失败:', error)
				return false
			} finally {
				this.setLoading(false)
			}
		},
		
		// 发布帖子
		async createPost(data) {
			try {
				// TODO: 调用发布帖子接口
				// const res = await createPostApi(data)
				// this.postList.unshift(res)
				
				// 模拟数据
				const mockPost = {
					id: Date.now().toString(),
					content: data.content,
					createTime: new Date().toLocaleString(),
					commentCount: 0
				}
				
				this.postList.unshift(mockPost)
				return true
			} catch (error) {
				console.error('发布帖子失败:', error)
				return false
			}
		}
	}
}) 