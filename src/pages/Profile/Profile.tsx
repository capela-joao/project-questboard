import { useEffect, useState, type FormEvent } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import styles from './Profile.module.css';
import { useUpload } from '../../hooks/useUpload';
import { updateUser } from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import {
  getPostsByUser,
  getLikesByPost,
  isLiked,
  getCommentByPost,
} from '../../services/PostService';
import { usePost } from '../../hooks/usePost';
import { type LikeData, type CommentData } from '../../types/types';
import { rateMap } from '../../utils/enums';

interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  authorId: string;
}

const Profile = () => {
  const { user, token } = useAuthContext();
  const { uploadImage } = useUpload();
  const { updateUserInfo } = useAuth();
  const { changePost, removePost } = usePost();

  const [profileUserName, setProfileUserName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [userLikedPosts, setUserLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [likingPosts, setLikingPosts] = useState<{ [key: string]: boolean }>({});

  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

  const [showPostMenu, setShowPostMenu] = useState<{ [key: string]: boolean }>({});
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageURL, setEditImageURL] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [imageAttempted, setImageAttempted] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileUserName(user.username);
      setProfileEmail(user.email);
      setProfileBio(user.bio);
      setProfileAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id || !token) return;

      setPostsLoading(true);
      try {
        const posts = await getPostsByUser(String(user.id), token);
        setUserPosts(posts || []);

        if (posts && posts.length > 0) {
          const postIds = posts.map((post: any) => post.id);

          const likePromises = postIds.map(async (postId: string) => {
            try {
              const count = await getLikesByPost(postId, token);
              return { postId, count };
            } catch (error) {
              console.error(`Erro ao carregar likes do post ${postId}:`, error);
              return { postId, count: 0 };
            }
          });

          const userLikePromises = postIds.map(async (postId: string) => {
            try {
              const likeStatus = await isLiked(String(user.id), postId);
              return { postId, isLiked: likeStatus };
            } catch (error) {
              console.error(`Erro ao verificar like do usuário no post ${postId}:`, error);
              return { postId, isLiked: false };
            }
          });

          const commentPromises = postIds.map(async (postId: string) => {
            try {
              const postComments = await getCommentByPost(postId, token);
              return { postId, comments: postComments, count: postComments.length };
            } catch (error) {
              console.error(`Erro ao carregar comentários do post ${postId}:`, error);
              return { postId, comments: [], count: 0 };
            }
          });

          const [likeResults, userLikeResults, commentResults] = await Promise.all([
            Promise.all(likePromises),
            Promise.all(userLikePromises),
            Promise.all(commentPromises),
          ]);

          const newLikesMap: { [key: string]: number } = {};
          likeResults.forEach(({ postId, count }) => {
            newLikesMap[postId] = count;
          });

          const newUserLikedMap: { [key: string]: boolean } = {};
          userLikeResults.forEach(({ postId, isLiked }) => {
            newUserLikedMap[postId] = isLiked;
          });

          const newCommentsMap: { [key: string]: Comment[] } = {};
          const newCommentCountsMap: { [key: string]: number } = {};
          commentResults.forEach(({ postId, comments, count }) => {
            newCommentsMap[postId] = comments;
            newCommentCountsMap[postId] = count;
          });

          setLikes(newLikesMap);
          setUserLikedPosts(newUserLikedMap);
          setComments(newCommentsMap);
          setCommentCounts(newCommentCountsMap);
        }
      } catch (error) {
        console.error('Erro ao carregar posts do usuário:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user?.id, token]);

  const togglePostMenu = (postId: string) => {
    setShowPostMenu(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImageURL(post.imageURL || '');
    setEditRating(rateMap[post.rate as keyof typeof rateMap] || 0);
    setShowEditModal(true);
    setShowPostMenu({});
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
    setEditImageURL('');
    setEditRating(0);
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !token) return;

    if (imageAttempted && !editImageURL) {
      const confirmSubmit = window.confirm(
        'Você tentou adicionar uma imagem, mas ela não foi carregada. Deseja continuar sem a imagem?',
      );
      if (!confirmSubmit) {
        return;
      }
    }

    if (imageUploading) {
      alert('Aguarde o upload da imagem terminar antes de publicar.');
      return;
    }

    try {
      const editData = {
        title: editTitle,
        content: editContent,
        imageURL: editImageURL,
        rate: editRating,
      };

      await changePost(editData, editingPost.id, token);

      setUserPosts(prev =>
        prev.map(post => (post.id === editingPost.id ? { ...post, ...editData } : post)),
      );
      setImageAttempted(false);
      setImageUploading(false);
      closeEditModal();
      alert('Post atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar post:', error);
      alert('Erro ao atualizar post. Tente novamente.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!token) return;

    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await removePost(postId);

        setUserPosts(prev => prev.filter(post => post.id !== postId));

        alert('Post deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar post:', error);
        alert('Erro ao deletar post. Tente novamente.');
      }
    }

    setShowPostMenu({});
  };

  const handleLike = async (postId: string, submitLike: any, removeLike: any) => {
    if (likingPosts[postId] || !user || !token) return;

    try {
      setLikingPosts(prev => ({ ...prev, [postId]: true }));

      const isCurrentlyLiked = userLikedPosts[postId];
      const data: LikeData = {
        userId: String(user.id),
        postId: postId,
      };

      if (isCurrentlyLiked) {
        setUserLikedPosts(prev => ({ ...prev, [postId]: false }));
        setLikes(prev => ({ ...prev, [postId]: Math.max((prev[postId] || 1) - 1, 0) }));
        if (removeLike) await removeLike(data, token);
      } else {
        setUserLikedPosts(prev => ({ ...prev, [postId]: true }));
        setLikes(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        if (submitLike) await submitLike(data, token);
      }

      try {
        const [newCount, likeStatus] = await Promise.all([
          getLikesByPost(postId, token),
          isLiked(String(user.id), postId),
        ]);

        setLikes(prev => ({ ...prev, [postId]: newCount }));
        setUserLikedPosts(prev => ({ ...prev, [postId]: likeStatus }));
      } catch (syncError) {
        console.error('Erro ao sincronizar dados após like:', syncError);
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir o post:', error);

      try {
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

  const handleCommentSubmit = async (postId: string, submitComment: any) => {
    const content = commentText[postId]?.trim();

    if (!content || !user || !token || !submitComment) return;

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

  if (!user || !token) {
    return <p>Sem dados de usuário para exibir.</p>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await updateUser(
        user.id,
        {
          username: profileUserName,
          email: profileEmail,
          bio: profileBio,
          avatarUrl: profileAvatarUrl,
        },
        token,
      );
      updateUserInfo(newUser);
      alert('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err: any) {
      alert(`Erro ao atualizar perfil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_content}>
        <div className={styles.profile_header}>
          <div className={styles.banner}></div>

          <div className={styles.avatar_container}>
            {user && user.avatarUrl ? (
              <img src={user.avatarUrl} alt="profile" className={styles.avatar} />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>

          <button onClick={() => setIsEditing(true)} className={styles.btn_edit}>
            Editar Perfil
          </button>
        </div>
        <div className={styles.profile_data}>
          <h2>{user.username}</h2>
          <p>
            <i className="fa-solid fa-envelope"></i>
            {user.email}
          </p>
          <p>
            <i className="fa-solid fa-book-open-reader"></i>
            {user.bio}
          </p>
          <p>
            <i className="fa-solid fa-calendar-days"></i>
            {user.createdAt
              ? formatRelativeTime(
                  typeof user.createdAt === 'string'
                    ? user.createdAt
                    : new Date(user.createdAt).toISOString(),
                )
              : 'Data não disponível'}
          </p>
        </div>
      </div>

      <div className={styles.user_posts}>
        <h3>Meus Posts</h3>
        {postsLoading ? (
          <div className={styles.loading}>
            <p>Carregando posts...</p>
          </div>
        ) : userPosts.length === 0 ? (
          <div className={styles.loading}>
            <p>Nenhum post encontrado.</p>
          </div>
        ) : (
          <ul className={styles.post_container}>
            {userPosts.map(post => {
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
                    {user && user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="profile" />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className={styles.post_data}>
                    <div className={styles.username_date}>
                      <p>
                        <strong>{user.username || 'Usuário desconhecido'}</strong>
                        <span>• {formatRelativeTime(post.createdAt)}</span>
                      </p>
                      <div className={styles.post_menu_container}>
                        <button
                          className={styles.post_menu_btn}
                          onClick={() => togglePostMenu(post.id)}
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                        {showPostMenu[post.id] && (
                          <div className={styles.post_menu_dropdown}>
                            <button
                              className={styles.post_menu_item}
                              onClick={() => openEditModal(post)}
                            >
                              <i className="fas fa-edit"></i>
                              Editar
                            </button>
                            <button
                              className={styles.post_menu_item}
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <i className="fas fa-trash"></i>
                              Deletar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    <p>
                      Nota:{' '}
                      {typeof post.rate === 'string' ? (rateMap[post.rate] ?? 'N/A') : post.rate} /
                      5
                    </p>
                    {post.imageURL && (
                      <div className={styles.post_image}>
                        <img src={post.imageURL} alt="Imagem do post" />
                      </div>
                    )}

                    <div className={styles.post_footer}>
                      <button
                        onClick={() => handleLike(post.id, null, null)}
                        disabled={isLiking}
                        className={`${isLiked ? styles.liked : ''} ${isLiking ? styles.liking : ''}`}
                      >
                        {isLiking ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i
                            className={`fa-solid fa-heart ${isLiked ? styles.heart_liked : ''}`}
                          ></i>
                        )}
                        <span>{likeCount}</span>
                      </button>

                      <button onClick={() => toggleComments(post.id)}>
                        <i className="fa-solid fa-comment"></i>
                        <span>{commentCount} comentários</span>
                      </button>
                    </div>

                    {isShowingComments && (
                      <div className={styles.comments_section}>
                        {user && (
                          <div className={styles.comment_form}>
                            <div className={styles.comment_input_container}>
                              <div className={styles.comment_user_avatar}>
                                {user.avatarUrl ? (
                                  <img src={user.avatarUrl} alt={`Avatar de ${user.username}`} />
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
                              onClick={() => handleCommentSubmit(post.id, null)}
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

                        <div className={styles.comments_list}>
                          {isLoadingComments ? (
                            <div className={styles.comments_loading}>
                              <i className="fas fa-spinner fa-spin"></i>
                              <span>Carregando comentários...</span>
                            </div>
                          ) : (
                            <>
                              {postComments.length > 0 ? (
                                postComments.map((comment: Comment) => (
                                  <div key={comment.id} className={styles.comment_item}>
                                    <div className={styles.comment_avatar}>
                                      {user.avatarUrl ? (
                                        <img
                                          src={user.avatarUrl}
                                          alt={`Avatar de ${user.username}`}
                                        />
                                      ) : (
                                        <i className="fas fa-user"></i>
                                      )}
                                    </div>
                                    <div className={styles.comment_content}>
                                      <div className={styles.comment_header}>
                                        <strong>{user.username}</strong>
                                        <span className={styles.comment_time}>
                                          {formatRelativeTime(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className={styles.comment_text}>{comment.content}</p>
                                    </div>
                                  </div>
                                ))
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
        )}
      </div>

      {isEditing && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <form onSubmit={handleSubmit} className={styles.profile_modal}>
              <h2>Editar Perfil</h2>
              <label>
                <span>Usuário:</span>
                <input
                  type="text"
                  value={profileUserName}
                  onChange={e => setProfileUserName(e.target.value)}
                  placeholder="Digite o seu usuário"
                  required
                />
              </label>

              <label>
                <span>E-mail:</span>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  placeholder="Digite o seu e-mail"
                  required
                />
              </label>

              <label>
                <span>Bio:</span>
                <textarea
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  placeholder="Escreva um pouco sobre você..."
                  required
                />
              </label>

              <label>
                <span>Imagem de Perfil:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await uploadImage(file);
                      if (imageUrl) {
                        setProfileAvatarUrl(imageUrl);
                      } else {
                        alert('Erro ao enviar imagem');
                      }
                    }
                  }}
                />
              </label>

              <div className={styles.form_buttons}>
                <button type="submit" disabled={loading} className={styles.btn_submit}>
                  {loading ? 'Carregando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.btn_cancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingPost && (
        <div className={styles.modal_overlay} onClick={closeEditModal}>
          <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
            <div className={styles.edit_modal_data}>
              <h2>Editar Post</h2>
              <label className={styles.title_post}>
                <span>Título do post:</span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Dê um título para o seu Post."
                />
              </label>

              <div className={styles.post_review}>
                <textarea
                  placeholder="Compartilhe o que achou desse jogo..."
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
                <label className={styles.assets_button}>
                  <span>
                    <i className="fa-regular fa-image"></i>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = await uploadImage(file);
                        if (imageUrl) {
                          setEditImageURL(imageUrl);
                        } else {
                          alert('Erro ao enviar imagem');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <div className={styles.stars}>
                <p>Dê a sua nota para este jogo:</p>
                {[1.0, 2.0, 3.0, 4.0, 5.0].map(rate => (
                  <span
                    key={rate}
                    className={editRating >= rate ? styles.star_filled : styles.star_empty}
                    onClick={() => setEditRating(rate)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className={styles.form_buttons}>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={postsLoading}
                  className={styles.btn_submit}
                >
                  {postsLoading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={closeEditModal} className={styles.btn_cancel}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
