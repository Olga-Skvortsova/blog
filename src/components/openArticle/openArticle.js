import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Popconfirm } from 'antd';
import Markdown from 'markdown-to-jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import like from '../../img/Vector.svg';
import likefill from '../../img/filedvector.svg';
import {
  deleteArticle,
  likeArticle,
  dislikeArticle,
  clearErrorsAndStatusOfCreate,
} from '../../store/createArticleReducer';

import styles from './openArticle.module.sass';

export default function OpenArticle() {
  const { articles } = useSelector((state) => state.getArticleReducer);
  const { user } = useSelector((state) => state.loginUserReducer);
  const { articleToSlug, likedArticle, statusOfDeleteArticle, errorOfDeleteArticle, statusOfLikeArticle } = useSelector(
    (state) => state.createArticleReducer
  );
  const [messageApi, contextHolder] = message.useMessage();

  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [article, setArticle] = useState(
    articleToSlug
      ? articleToSlug.slug === slug
        ? articleToSlug
        : articles.filter((el) => {
            if (el.slug === slug) {
              return el;
            }
          })[0]
      : articles.filter((el) => {
          if (el.slug === slug) {
            return el;
          }
        })[0]
  );

  const matchingArticle = useSelector((state) =>
    state.getArticleReducer.articles.find((article) => article.slug === slug)
  );

  const [likesCount, setLikesCount] = useState(matchingArticle ? matchingArticle.favoritesCount : 0);
  const [isLiked, setIsLiked] = useState(matchingArticle ? matchingArticle.favorited : false);

  const serverError = () => {
    messageApi.open({
      type: 'error',
      content: 'Server error',
    });
  };

  const notAuthorized = () => {
    messageApi.open({
      type: 'error',
      content: 'Unauthorized user cannot like',
    });
  };

  useEffect(() => {
    if (statusOfDeleteArticle === 'resolved') {
      message.success('Article deleted');
      dispatch(clearErrorsAndStatusOfCreate());
      navigate('/');
    } else if (statusOfDeleteArticle === 'rejected') {
      errorOfDeleteArticle.payload.errors ? serverError() : null;
    }
  }, [statusOfDeleteArticle]);

  useEffect(() => {
    if (statusOfLikeArticle === 'resolved' && likedArticle && likedArticle.article.slug === article.slug) {
      setLikesCount(likedArticle.article.favoritesCount);
      setIsLiked(likedArticle.article.favorited);
    }
  }, [likedArticle, statusOfLikeArticle, article.slug]);

  const tags = (tagList) => {
    return tagList.map((tag) => {
      if (tag) {
        return (
          <div key={tag} className={styles.article__tag}>
            {tag}
          </div>
        );
      }
      return null;
    });
  };

  const likeArt = () => {
    if (Object.keys(user).length > 0) {
      let slug = article.slug;
      isLiked ? dispatch(dislikeArticle({ user, slug })) : dispatch(likeArticle({ user, slug }));
    } else {
      notAuthorized();
    }
  };

  const handleEdit = () => {
    dispatch(clearErrorsAndStatusOfCreate());
    navigate(`/articles/${article.slug}/edit`);
  };

  const confirm = () => {
    dispatch(deleteArticle({ user, slug }));
  };
  const cancel = () => {
    message.error('The article has not been deleted');
  };

  return statusOfDeleteArticle === 'loading' ? (
    <div className={styles.loading}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  ) : (
    <div className={styles.articleWrapper}>
      {contextHolder}
      <div className={styles.article}>
        <header className={styles.article__header}>
          <h5 className={styles.article__title}>{article.title}</h5>
          <div onClick={likeArt} className={styles.article__likes}>
            <img src={isLiked ? likefill : like}></img>
            <p>{likesCount}</p>
          </div>
        </header>
        <div className={styles.article__tags}>{tags(article.tagList)}</div>
        <p className={styles.article__text}>{article.description}</p>
        <div className={styles.article__profile}>
          <h6>{article.author.username}</h6>
          <p>{format(new Date(article.updatedAt), 'MMMM d, yyyy')}</p>
          <div className={styles.article__imgWrapper}>
            <img src={article.author.image}></img>
          </div>
          <div className={styles.article__button}>
            <Popconfirm
              title="Delete the task"
              description="Are you sure?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              placement={'right'}
              cancelText="No"
            >
              {Object.keys(user).length > 0 ? (
                user.username === article.author.username ? (
                  <button className={styles.article__button_red}> Delete </button>
                ) : null
              ) : null}
            </Popconfirm>
            {Object.keys(user).length > 0 ? (
              user.username === article.author.username ? (
                <button className={styles.article__button_green} onClick={handleEdit}>
                  Edit
                </button>
              ) : null
            ) : null}
          </div>
        </div>
        <div className={styles.article__fullText}>
          <Markdown>{article.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
