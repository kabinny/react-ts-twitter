import PostHeader from 'components/posts/PostHeader'
import AuthContext from 'context/AuthContext'
import { updateProfile } from 'firebase/auth'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage'
import { storage } from 'firebaseApp'
import useTranslation from 'hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_DOWNLOAD_URL_STR = 'https://firebasestorage.googleapis.com'

export default function ProfileEditPage() {
  const [displayName, setDisplayName] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const t = useTranslation()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e
    setDisplayName(value)
  }

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e

    const file = files?.[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget
      setImageUrl(result)
    }
  }

  const handleDeleteImage = () => {
    setImageUrl(null)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()

    let key = `${user?.uid}/${uuidv4()}`
    const storageRef = ref(storage, key)
    let newImageUrl = null

    try {
      // 기존 이미지 삭제
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
      ) {
        const imageRef = ref(storage, user?.photoURL)
        if (imageRef) {
          await deleteObject(imageRef).catch((error) => {
            console.log(error)
          })
        }
      }

      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, 'data_url')
        newImageUrl = await getDownloadURL(data?.ref)
      }

      // 프로필 업데이트
      if (user) {
        await updateProfile(user, {
          displayName: displayName || '',
          photoURL: newImageUrl || '',
        })
          .then(() => {
            toast.success('프로필이 업데이트 되었습니다.')
            navigate('/profile')
          })
          .catch((error: Error) => {
            console.log(error)
          })
      }
    } catch (err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user.photoURL)
    }
    if (user?.displayName) {
      setDisplayName(user?.displayName)
    }
  }, [user?.displayName, user?.photoURL])

  return (
    <div className="post">
      <PostHeader />

      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder={t('NAME_PLACEHOLDER')}
            onChange={onChange}
            value={displayName}
          />

          {imageUrl && (
            <div className="post-form__attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="post-form__clear-btn"
              >
                {t('BUTTON_DELETE')}
              </button>
            </div>
          )}

          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="submit"
              value={t('BUTTON_EDIT_PROFILE')}
              className="post-form__submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
