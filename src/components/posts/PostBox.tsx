import FollowingBox from 'components/following/FollowingBox'
import AuthContext from 'context/AuthContext'
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { db, storage } from 'firebaseApp'
import useTranslation from 'hooks/useTranslation'
import { PostProps } from 'pages/home'
import { useContext } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaRegComment, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface PostBoxProps {
  post: PostProps
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const imageRef = ref(storage, post?.imageUrl)

  const t = useTranslation()

  const handleDelete = async () => {
    const confirm = window.confirm('해당 게시글을 삭제하시겠습니까?')

    if (confirm) {
      // 이미지 삭제
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error: Error) => {
          console.log(error)
        })
      }

      await deleteDoc(doc(db, 'posts', post.id))
      toast.success('게시글을 삭제했습니다.')
      navigate('/')
    }
  }

  // 좋아요
  const toggleLike = async () => {
    const postRef = doc(db, 'posts', post.id)

    // 좋아요 했으면 취소
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      })
    }
    // 좋아요 안했으면 좋아요 추가
    else {
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      })
    }
  }

  return (
    <div className="post__box" key={post?.id}>
      <div className="post__box-profile">
        <div className="post__flex">
          {post?.profileUrl ? (
            <img
              src={post?.profileUrl}
              alt="profile"
              className="post__box-profile-img"
            />
          ) : (
            <FaUserCircle className="post__box-profile-icon" />
          )}

          <div className="post__flex--between">
            <div className="post__flex">
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>

            {/* 팔로우 */}
            <FollowingBox post={post} />
          </div>
        </div>

        {/* 콘텐트 */}
        <Link to={`/posts/${post?.id}`}>
          <div className="post__box-content">{post?.content}</div>

          {/* 이미지 */}
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="post"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
        </Link>

        {/* 해시태그 */}
        <div className="post-form__hashtags-outputs">
          {post?.hashTags?.map((tag, index) => (
            <span className="post-form__hashtags-tag" key={index}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="post__box-footer">
        {user?.uid === post?.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              {t('BUTTON_DELETE')}
            </button>
            <Link to={`/posts/edit/${post?.id}`} className="post__edit">
              {t('BUTTON_EDIT')}
            </Link>
          </>
        )}

        <button type="button" className="post__likes" onClick={toggleLike}>
          {user?.uid && post?.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}

          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </div>
    </div>
  )
}
