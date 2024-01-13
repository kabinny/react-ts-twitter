import AuthContext from 'context/AuthContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { useContext, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function PostFrom() {
  const [content, setContent] = useState<string>('')
  const { user } = useContext(AuthContext)

  const handleFileUpload = () => {}

  const onSubmit = async (e: any) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        createdAt: new Date()?.toLocaleDateString('ko', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        uid: user?.uid,
        email: user?.email,
      })

      setContent('')
      toast.success('게시글을 생성했습니다.')
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
        <input type="submit" value="Tweet" className="post-form__submit-btn" />
      </div>
    </form>
  )
}
