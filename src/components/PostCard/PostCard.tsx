import { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/UserService';
import { getLikesByPost, isLiked, getCommentByPost } from '../../services/PostService';
import styles from './PostCard.module.css';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { type LikeData, type CommentData } from '../../types/types';
import { useAuthContext } from '../../contexts/authContext';
import { useNotifications } from '../../hooks/useNotification';

type PostCardProps = {
  posts: any[] | undefined;
  submitLike: (data: LikeData, token: string) => Promise<void>;
  removeLike: (data: LikeData, token: string) => Promise<void>;
  submitComment: (data: CommentData, token: string) => Promise<void>;
  loading: boolean;
};

interface Profile {
  username: string;
  bio: string;
  avatarUrl: string;
}

interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  authorId: string;
}

const PostCard = ({
  posts = [],
  loading,
  submitLike,
  removeLike,
  submitComment,
}: PostCardProps) => {
  const [userData, setUserData] = useState<{ [key: string]: Profile }>({});
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [userLikedPosts, setUserLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [likingPosts, setLikingPosts] = useState<{ [key: string]: boolean }>({});
  const [dataLoading, setDataLoading] = useState(false);

  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

  const { checkForNewNotifications } = useNotifications();

  const { user, token } = useAuthContext();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!posts.length || !token) return;

      setDataLoading(true);

      try {
        const uniqueUserIds = [...new Set(posts.map(post => post.authorId))];
        const postIds = posts.map(post => post.id);

        const userPromises = uniqueUserIds.map(async userId => {
          try {
            const profile = await getUserProfile(String(userId));
            return { userId, profile };
          } catch (error) {
            console.error(`Erro ao carregar usuário ${userId}`, error);
            return { userId, profile: null };
          }
        });

        const likePromises = postIds.map(async postId => {
          try {
            const count = await getLikesByPost(postId, token);
            return { postId, count };
          } catch (error) {
            console.error(`Erro ao carregar likes do post ${postId}`, error);
            return { postId, count: 0 };
          }
        });

        const commentPromises = postIds.map(async postId => {
          try {
            const postComments = await getCommentByPost(postId, token);
            return { postId, comments: postComments, count: postComments.length };
          } catch (error) {
            console.error(`Erro ao carregar comentários do post ${postId}`, error);
            return { postId, comments: [], count: 0 };
          }
        });

        const userLikePromises = postIds.map(async postId => {
          try {
            if (!user) return { postId, isLiked: false };

            const likeStatus = await isLiked(String(user.id), postId);
            return { postId, isLiked: likeStatus };
          } catch (error) {
            console.error(`Erro ao verificar like do usuário no post ${postId}`, error);
            return { postId, isLiked: false };
          }
        });

        const [userResults, likeResults, commentResults, userLikeResults] = await Promise.all([
          Promise.all(userPromises),
          Promise.all(likePromises),
          Promise.all(commentPromises),
          Promise.all(userLikePromises),
        ]);

        const newUserMap: { [key: number]: Profile } = {};
        userResults.forEach(({ userId, profile }) => {
          if (profile) {
            newUserMap[userId] = profile;
          }
        });

        const newLikesMap: { [key: string]: number } = {};
        likeResults.forEach(({ postId, count }) => {
          newLikesMap[postId] = count;
        });

        const newCommentsMap: { [key: string]: Comment[] } = {};
        const newCommentCountsMap: { [key: string]: number } = {};
        commentResults.forEach(({ postId, comments, count }) => {
          newCommentsMap[postId] = comments;
          newCommentCountsMap[postId] = count;
        });

        const newUserLikedMap: { [key: string]: boolean } = {};
        userLikeResults.forEach(({ postId, isLiked }) => {
          newUserLikedMap[postId] = isLiked;
        });

        const allCommentUserIds = new Set<string>();
        Object.values(newCommentsMap).forEach(postComments => {
          postComments.forEach(comment => {
            allCommentUserIds.add(String(comment.userId));
          });
        });

        const missingUserIds = [...allCommentUserIds].filter(userId => !newUserMap[Number(userId)]);

        if (missingUserIds.length > 0) {
          const commentUserPromises = missingUserIds.map(async userId => {
            try {
              const profile = await getUserProfile(userId);
              return { userId: Number(userId), profile };
            } catch (error) {
              console.error(`Erro ao carregar perfil do usuário ${userId}:`, error);
              return { userId: Number(userId), profile: null };
            }
          });

          const commentUserResults = await Promise.all(commentUserPromises);
          commentUserResults.forEach(({ userId, profile }) => {
            if (profile) {
              newUserMap[userId] = profile;
            }
          });
        }

        setUserData(newUserMap);
        setLikes(newLikesMap);
        setComments(newCommentsMap);
        setCommentCounts(newCommentCountsMap);
        setUserLikedPosts(newUserLikedMap);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [posts, token]);

  const handleLike = async (postId: string) => {
    if (likingPosts[postId]) return;

    try {
      if (!user) {
        console.warn('Usuário não autenticado.');
        return;
      }

      if (!token) throw new Error('Token de autenticação ausente.');

      setLikingPosts(prev => ({ ...prev, [postId]: true }));

      const isCurrentlyLiked = userLikedPosts[postId];

      if (isCurrentlyLiked) {
        const data: LikeData = {
          userId: String(user.id),
          postId: postId,
        };

        await removeLike(data, token);

        setUserLikedPosts(prev => ({ ...prev, [postId]: false }));
        setLikes(prev => ({ ...prev, [postId]: Math.max((prev[postId] || 1) - 1, 0) }));
      } else {
        const data: LikeData = {
          userId: String(user.id),
          postId: postId,
        };

        await submitLike(data, token);

        setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
        setLikes(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));

        const post = posts.find(p => p.id === postId);
        if (post && String(user.id) !== String(post.authorId)) {
          setTimeout(() => {
            checkForNewNotifications();
          }, 1000);
        }
      }

      const [newCount, likeStatus] = await Promise.all([
        getLikesByPost(postId, token),
        isLiked(String(user.id), postId),
      ]);

      setLikes(prev => ({ ...prev, [postId]: newCount }));
      setUserLikedPosts(prev => ({ ...prev, [postId]: likeStatus }));
    } catch (error) {
      console.error('Erro ao curtir/descurtir o post:', error);

      try {
        if (!token) throw new Error('Token de autenticação ausente.');

        if (!user) {
          console.warn('Usuário não autenticado.');
          return;
        }
        const [newCount, likeStatus] = await Promise.all([
          getLikesByPost(postId, token),
          isLiked(String(user.id), postId),
        ]);

        setLikes(prev => ({ ...prev, [postId]: newCount }));
        setUserLikedPosts(prev => ({ ...prev, [postId]: likeStatus }));
      } catch (syncError) {
        console.error('Erro ao sincronizar estado após falha:', syncError);
      }
    } finally {
      setLikingPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  const loadComments = async (postId: string) => {
    if (!token) return;

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));

      const postComments: Comment[] = await getCommentByPost(postId, token);

      const commentUserIds = [
        ...new Set(postComments.map((comment: Comment) => String(comment.userId))),
      ];
      const newUserProfiles: { [key: number]: Profile } = { ...userData };

      for (const userId of commentUserIds) {
        const userIdNumber = Number(userId);
        if (!newUserProfiles[userIdNumber]) {
          try {
            const profile = await getUserProfile(userId);
            newUserProfiles[userIdNumber] = profile;
          } catch (error) {
            console.error(`Erro ao carregar perfil do usuário ${userId}:`, error);
          }
        }
      }

      setUserData(newUserProfiles);
      setComments(prev => ({ ...prev, [postId]: postComments }));
      setCommentCounts(prev => ({ ...prev, [postId]: postComments.length }));
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = async (postId: string) => {
    const isCurrentlyShowing = showComments[postId];

    if (!isCurrentlyShowing) {
      await loadComments(postId);
    }

    setShowComments(prev => ({ ...prev, [postId]: !isCurrentlyShowing }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentText[postId]?.trim();

    if (!content || !user || !token) return;

    try {
      setSubmittingComment(prev => ({ ...prev, [postId]: true }));

      const commentData: CommentData = {
        userId: String(user.id),
        postId: postId,
        content: content,
      };

      await submitComment(commentData, token);

      setCommentText(prev => ({ ...prev, [postId]: '' }));

      await loadComments(postId);
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentTextChange = (postId: string, value: string) => {
    setCommentText(prev => ({ ...prev, [postId]: value }));
  };

  if (loading || dataLoading) {
    return (
      <div className={styles.loading}>
        <p>Carregando posts...</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={styles.loading}>
        <p>Nenhum post encontrado.</p>
      </div>
    );
  }

  return (
    <ul className={styles.post_container}>
      {posts.map(post => {
        const userProfile = userData[post.authorId];
        const likeCount = likes[post.id] ?? 0;
        const isLiked = userLikedPosts[post.id] ?? false;
        const isLiking = likingPosts[post.id] ?? false;
        const postComments = comments[post.id] || [];
        const commentCount = commentCounts[post.id] ?? 0;
        const isShowingComments = showComments[post.id] ?? false;
        const isLoadingComments = loadingComments[post.id] ?? false;
        const isSubmittingComment = submittingComment[post.id] ?? false;
        const currentCommentText = commentText[post.id] || '';

        return (
          <li key={post.id} className={styles.post_content}>
            <div className={styles.profile}>
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={`Avatar de ${userProfile.username}`} />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
            <div className={styles.post_data}>
              <div className={styles.username_date}>
                <p>
                  <strong>{userProfile?.username || 'Usuário desconhecido'}</strong>
                  <span>• {formatRelativeTime(post.createdAt)}</span>
                </p>
              </div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Nota: {post.rate}</p>
              {post.imageURL && (
                <div className={styles.post_image}>
                  <img src={post.imageURL} alt="Imagem do post" />
                </div>
              )}

              <div className={styles.post_footer}>
                <button
                  onClick={() => handleLike(post.id)}
                  disabled={isLiking}
                  className={`${isLiked ? styles.liked : ''} ${isLiking ? styles.liking : ''}`}
                >
                  {isLiking ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className={`fa-solid fa-heart ${isLiked ? styles.heart_liked : ''}`}></i>
                  )}
                  <span>{likeCount}</span>
                </button>

                <button onClick={() => toggleComments(post.id)}>
                  <i className="fa-solid fa-comment"></i>
                  <span>{commentCount} comentários</span>
                </button>
              </div>

              {}
              {isShowingComments && (
                <div className={styles.comments_section}>
                  {}
                  {user && (
                    <div className={styles.comment_form}>
                      <div className={styles.comment_input_container}>
                        <div className={styles.comment_user_avatar}>
                          {userData[user.id]?.avatarUrl ? (
                            <img
                              src={userData[user.id].avatarUrl}
                              alt={`Avatar de ${userData[user.id].username}`}
                            />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                        <textarea
                          value={currentCommentText}
                          onChange={e => handleCommentTextChange(post.id, e.target.value)}
                          placeholder="Escreva um comentário..."
                          className={styles.comment_textarea}
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        disabled={!currentCommentText.trim() || isSubmittingComment}
                        className={styles.comment_submit_btn}
                      >
                        {isSubmittingComment ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          'Comentar'
                        )}
                      </button>
                    </div>
                  )}

                  {}
                  <div className={styles.comments_list}>
                    {isLoadingComments ? (
                      <div className={styles.comments_loading}>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Carregando comentários...</span>
                      </div>
                    ) : (
                      <>
                        {postComments.length > 0 ? (
                          postComments.map((comment: Comment) => {
                            const commentUser = userData[comment.userId];
                            return (
                              <div key={comment.id} className={styles.comment_item}>
                                <div className={styles.comment_avatar}>
                                  {commentUser?.avatarUrl ? (
                                    <img
                                      src={commentUser.avatarUrl}
                                      alt={`Avatar de ${commentUser.username}`}
                                    />
                                  ) : (
                                    <i className="fas fa-user"></i>
                                  )}
                                </div>
                                <div className={styles.comment_content}>
                                  <div className={styles.comment_header}>
                                    <strong>
                                      {commentUser?.username || 'Usuário desconhecido'}
                                    </strong>
                                    <span className={styles.comment_time}>
                                      {formatRelativeTime(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className={styles.comment_text}>{comment.content}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className={styles.no_comments}>
                            Nenhum comentário ainda. Seja o primeiro a comentar!
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PostCard;
