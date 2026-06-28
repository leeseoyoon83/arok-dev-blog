import { createClient } from '@supabase/supabase-js'
import dummyPosts from './data/dummyPosts'

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase가 제대로 구성되었는지 판단
const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
)

let supabase = null
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.warn("Supabase 클라이언트 초기화 실패. LocalStorage 모드로 전환합니다.", e)
  }
}

const LOCAL_STORAGE_KEY = 'mentors_space_posts'

// LocalStorage에 기본 데이터 셋업
const initializeLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dummyPosts))
  }
}

export const postService = {
  // 현재 Supabase가 연동되었는지 여부를 확인하는 플래그
  isUsingSupabase: isSupabaseConfigured && !!supabase,

  /**
   * 전체 포스트 조회
   */
  async getPosts() {
    if (this.isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          // Supabase의 스네이크 케이스(created_at)를 React 컴포넌트가 쓰는 카멜 케이스(createdAt)로 포맷 변환
          return data.map(p => ({
            id: p.id,
            title: p.title,
            content: p.content,
            category: p.category,
            tags: p.tags || [],
            createdAt: p.created_at
          }))
        }
        console.error("Supabase 조회 실패, LocalStorage로 대체합니다:", error)
      } catch (err) {
        console.error("Supabase 연결 에러, LocalStorage로 대체합니다:", err)
      }
    }

    // 폴백 모드: LocalStorage 조회
    initializeLocalStorage()
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    return localData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  /**
   * 포스트 추가
   */
  async createPost({ title, content, category, tags }) {
    const processedTags = Array.isArray(tags) 
      ? tags 
      : tags.split(',').map(t => t.trim()).filter(Boolean)
      
    const newPost = {
      title,
      content,
      category,
      tags: processedTags,
      createdAt: new Date().toISOString()
    }

    if (this.isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            tags: newPost.tags,
            created_at: newPost.createdAt
          }])
          .select()

        if (!error && data && data[0]) {
          const created = data[0]
          return {
            id: created.id,
            title: created.title,
            content: created.content,
            category: created.category,
            tags: created.tags,
            createdAt: created.created_at
          }
        }
        console.error("Supabase 글 등록 실패, LocalStorage에 저장합니다:", error)
      } catch (err) {
        console.error("Supabase 글 등록 에러, LocalStorage에 저장합니다:", err)
      }
    }

    // 폴백 모드: LocalStorage에 삽입
    initializeLocalStorage()
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    // 간단한 ID 생성 (가장 큰 ID + 1)
    const nextId = localData.length > 0 ? Math.max(...localData.map(p => p.id)) + 1 : 1
    const createdPost = { id: nextId, ...newPost }
    localData.push(createdPost)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData))
    return createdPost
  },

  /**
   * 포스트 삭제
   */
  async deletePost(id) {
    if (this.isUsingSupabase) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id)

        if (!error) return true
        console.error("Supabase 글 삭제 실패, LocalStorage에서 삭제합니다:", error)
      } catch (err) {
        console.error("Supabase 글 삭제 에러, LocalStorage에서 삭제합니다:", err)
      }
    }

    // 폴백 모드: LocalStorage에서 삭제
    initializeLocalStorage()
    let localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    localData = localData.filter(p => String(p.id) !== String(id))
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData))
    return true
  }
}
