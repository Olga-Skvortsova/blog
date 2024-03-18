import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { getArticle } from '../../store/getArticleReducer';
import ArticleInList from '../articleInList';

import styles from './listOfArticle.module.sass';

export default function ListOfArticle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const dispatch = useDispatch();
  const { articles, numberOfArticles, statusOfGetArticles, errorOfGetArticle } = useSelector(
    (state) => state.getArticleReducer
  );
  const { user } = useSelector((state) => state.loginUserReducer);

  const [articlesListContent, setArticlesListContent] = useState(null);

  useEffect(() => {
    dispatch(getArticle({ page, user }));
  }, []);

  useEffect(() => {
    if (articles) {
      setArticlesListContent(articles.map((article) => <ArticleView key={article.slug} article={article} />));
    }
  }, [articles]);

  const handleChange = (event, value) => {
    setSearchParams({ page: value.toString() });
    dispatch(getArticle({ page: value, user }));
  };

  const ArticleView = ({ article }) => {
    return (
      <li>
        <ArticleInList {...article} />
      </li>
    );
  };

  let content;
  if (errorOfGetArticle) {
    content = <h2 className={styles.error}>Got error...</h2>;
  } else {
    content = (
      <div className={styles.blockArticles}>
        <div className={styles.blockArticles__articles}> {articlesListContent} </div>
        <div className={styles.blockArticles__pagination}>
          <Stack spacing={2}>
            <Pagination
              page={page}
              onChange={handleChange}
              size="small"
              count={Math.floor(numberOfArticles / 5)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        </div>
      </div>
    );
  }

  return statusOfGetArticles === 'loading' ? (
    <div className={styles.loading}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  ) : (
    content
  );
}
