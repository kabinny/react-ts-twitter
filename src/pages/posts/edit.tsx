import PostEditForm from 'components/posts/PostEditForm'
import PostHeader from 'components/posts/PostHeader'

export default function PostEditPage() {
  return (
    <div className="post">
      <PostHeader />
      <PostEditForm />
    </div>
  )
}
