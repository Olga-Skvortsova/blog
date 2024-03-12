import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { message } from 'antd';
import { NavLink, useParams } from 'react-router-dom';

import like from '../../img/Vector.svg';
import likefill from '../../img/filedvector.svg';
import { likeArticle, dislikeArticle, clearErrorsAndStatusOfCreate } from '../../store/createArticleReducer';

import styles from './articleInList.module.sass';
export default function ArticleInList(article) {
  const [likesCount, setLikesCount] = useState(article.favoritesCount);
  const [isLiked, setIsLiked] = useState(article.favorited);
  const { user } = useSelector((state) => state.loginUserReducer);
  const { likedArticle, statusOfLikeArticle, errorOfLikeArticle } = useSelector((state) => state.createArticleReducer);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const tags = (tagList) => {
    return tagList.map((tag) => {
      if (tag) {
        return (
          <div key={Math.random()} className={styles.article__tag}>
            {tag}
          </div>
        );
      }
      return null;
    });
  };

  const serverError = () => {
    messageApi.open({
      type: 'error',
      content: 'Server error',
    });
  };

  useEffect(() => {
    if (statusOfLikeArticle === 'resolved') {
      if (statusOfLikeArticle === 'resolved' && likedArticle && likedArticle.article.slug === article.slug) {
        setLikesCount(likedArticle.article.favoritesCount);
        setIsLiked(likedArticle.article.favorited);
      }
      dispatch(clearErrorsAndStatusOfCreate());
    } else if (statusOfLikeArticle === 'rejected') {
      errorOfLikeArticle.payload.errors ? serverError() : null;
    }
  }, [statusOfLikeArticle]);

  const likeArt = () => {
    let slug = article.slug;
    isLiked ? dispatch(dislikeArticle({ user, slug })) : dispatch(likeArticle({ user, slug }));
  };

  const reduceLength = (text, symbols) => {
    if (text.length > symbols) {
      return text.slice(0, symbols) + '...';
    } else {
      return text;
    }
  };

  return (
    <div className={styles.article}>
      {contextHolder}
      <header className={styles.article__header}>
        <NavLink className={styles.article__link} to={`/articles/${article.slug}`}>
          <h5 className={styles.article__title}>{reduceLength(article.title, 55)}</h5>
        </NavLink>
        <div onClick={likeArt} className={styles.article__likes}>
          <img src={isLiked ? likefill : like}></img>
          <p>{likesCount}</p>
        </div>
      </header>
      <div className={styles.article__tags}>{tags(article.tagList)}</div>
      <p className={styles.article__text}>{reduceLength(article.description, 200)}</p>
      <div className={styles.article__profile}>
        <h6>{article.author.username}</h6>
        <p>{format(new Date(article.updatedAt), 'MMMM d, yyyy')}</p>
        <div className={styles.article__imgWrapper}>
          <img src={article.author.image}></img>
        </div>
      </div>
    </div>
  );
}
