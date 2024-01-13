import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { PostProps } from 'pages/home'
import { useCallback, useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PostEditForm() {
  const params = useParams()
  const [post, setPost] = useState<PostProps | null>(null)
  const [content, setContent] = useState<string>('')
  const navigate = useNavigate()

  const handleFileUpload = () => {}

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id)
      const docSnap = await getDoc(docRef)

      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id })
      setContent(docSnap?.data()?.content)
    }
  }, [params.id])

  const onSubmit = async (e: any) => {
    e.preventDefault()

    try {
      if (post) {
        const postRef = doc(db, 'posts', post?.id)
        await updateDoc(postRef, {
          content,
        })
        toast.success('게시글을 수정했습니다.')
        navigate(`/posts/${post?.id}`)
      }
    } catch (e: any) {
      console.log(e)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e

    if (name === 'content') {
      setContent(value)
    }
  }

  useEffect(() => {
    if (params.id) {
      getPost()
    }
  }, [getPost, params.id])

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        name="content"
        id="content"
        className="post-form__textarea"
        placeholder="What is happening?"
        required
        onChange={onChange}
        value={content}
      ></textarea>
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>
  )
}
