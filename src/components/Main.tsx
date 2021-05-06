import React from 'react'
import styled from 'styled-components'
import { firestore, firebase } from 'firebaseConfig'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { isKSato } from 'utils'
import { SyncLoader } from 'react-spinners'
import { CommentBox, NewCommentForm } from 'components/organisms'
import { Heading } from 'components/atoms'

const MainContainer = styled.div`
  max-width: 860px;
  margin: 0 auto;
  margin-top: 20px;
`
const CommentsContainer = styled.div`
  padding: 0.1rem 0.625rem;
`

const LoaderWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
`
const NoPostWrapper = styled.div`
  padding: 2.5rem 0.315rem;
  display: flex;
  justify-content: center;
  margin: 1.625rem;
`

interface Props {
  currentUser: firebase.User
}

const Main = ({ currentUser }: Props) => {
  const commentsRef = firestore.collection('comments')
  const query = commentsRef
    .where('deleted', '==', false)
    .orderBy('createdAt', 'desc')

  const [comments, loading, error] = useCollectionData(query, { idField: 'id' })

  const pinnedComments = comments?.filter((comment) => comment.pinned)
  const otherComments = comments?.filter((comment) => !comment.pinned)

  if (error) {
    console.log(error?.message)
  }

  return (
    <MainContainer>
      {isKSato(currentUser.uid) && <NewCommentForm currentUser={currentUser} />}
      {loading ? (
        <LoaderWrapper>
          <SyncLoader color={'#e0e0e0'} />
        </LoaderWrapper>
      ) : (
        <CommentsContainer>
          {comments?.length ? (
            <>
              {pinnedComments &&
                pinnedComments.map((comment) => (
                  <CommentBox
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                  />
                ))}

              {otherComments &&
                otherComments.map((comment) => (
                  <CommentBox
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                  />
                ))}
            </>
          ) : (
            <NoPostWrapper>
              <Heading size="h2">Nothing was posted yet....</Heading>
            </NoPostWrapper>
          )}
        </CommentsContainer>
      )}
    </MainContainer>
  )
}

export default Main
