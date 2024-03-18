import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logOutAction, clearErrorsAndStatus } from '../../store/loginUserReducer';
import { clearErrorsAndStatusOfCreate } from '../../store/createArticleReducer';

import styles from './layout.module.sass';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, statusOfUpdateUser, statusOfEnterUser, statusOfLoginUser } = useSelector(
    (state) => state.loginUserReducer
  );
  const { statusOfCreateArticle, statusOfUpdateArticle } = useSelector((state) => state.createArticleReducer);
  const { statusOfDeleteArticle } = useSelector((state) => state.createArticleReducer);

  const logOut = () => {
    dispatch(logOutAction());
    navigate('/');
  };

  const clearErrors = () => {
    dispatch(clearErrorsAndStatus());
    dispatch(clearErrorsAndStatusOfCreate());
  };

  const notLogined = (
    <div className={styles.header__infoWrapper}>
      <NavLink to={'/sign-in'}>
        <button
          disabled={statusOfEnterUser === 'loading' || statusOfLoginUser === 'loading' ? true : false}
          onClick={clearErrors}
          className={classNames(styles.header__button, styles.header__buttonSignIn)}
        >
          Sign In
        </button>
      </NavLink>
      <NavLink to={'/sign-up'}>
        <button
          disabled={statusOfEnterUser === 'loading' || statusOfLoginUser === 'loading' ? true : false}
          onClick={clearErrors}
          className={classNames(styles.header__button, styles.header__buttonSignUp)}
        >
          Sign Up
        </button>
      </NavLink>
    </div>
  );

  const logined = (
    <div className={styles.header__infoWrapper}>
      <NavLink to={'/new-article'}>
        <button
          disabled={
            statusOfCreateArticle === 'loading' ||
            statusOfUpdateArticle === 'loading' ||
            statusOfDeleteArticle === 'loading' ||
            statusOfUpdateUser === 'loading'
              ? true
              : false
          }
          onClick={clearErrors}
          className={classNames(styles.header__button, styles.header__buttonCreateArticle)}
        >
          Create article
        </button>
      </NavLink>
      <div className={styles.header__profile}>
        <NavLink to={'/profile'}>
          <button
            disabled={
              statusOfCreateArticle === 'loading' ||
              statusOfUpdateArticle === 'loading' ||
              statusOfDeleteArticle === 'loading' ||
              statusOfUpdateUser === 'loading'
                ? true
                : false
            }
            className={styles.header__profileButton}
            onClick={clearErrors}
          >
            {user.username}
          </button>
        </NavLink>
        <div className={styles.header__avatar}>
          <div className={styles.header__imgWrapper}>
            <img src={user.image ? user.image : null}></img>
          </div>
        </div>
      </div>
      <button
        disabled={
          statusOfCreateArticle === 'loading' ||
          statusOfUpdateArticle === 'loading' ||
          statusOfDeleteArticle === 'loading' ||
          statusOfUpdateUser === 'loading'
            ? true
            : false
        }
        onClick={logOut}
        className={classNames(styles.header__button, styles.header__buttonLogOut)}
      >
        Log Out
      </button>
    </div>
  );

  return (
    <>
      <header className={styles.header}>
        <NavLink className={styles.header__link} to={'/'}>
          <button
            disabled={
              statusOfCreateArticle === 'loading' ||
              statusOfUpdateArticle === 'loading' ||
              statusOfDeleteArticle === 'loading' ||
              statusOfUpdateUser === 'loading' ||
              statusOfEnterUser === 'loading' ||
              statusOfLoginUser === 'loading'
                ? true
                : false
            }
            className={styles.header__buttonHead}
            onClick={clearErrors}
          >
            Realworld Blog
          </button>
        </NavLink>
        {Object.keys(user).length === 0 ? notLogined : logined}
      </header>
      <Outlet />
    </>
  );
}
