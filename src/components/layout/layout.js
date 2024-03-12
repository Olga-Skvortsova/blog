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
  const { user } = useSelector((state) => state.loginUserReducer);

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
        <button onClick={clearErrors} className={classNames(styles.header__button, styles.header__buttonSignIn)}>
          Sign In
        </button>
      </NavLink>
      <NavLink to={'/sign-up'}>
        <button onClick={clearErrors} className={classNames(styles.header__button, styles.header__buttonSignUp)}>
          Sign Up
        </button>
      </NavLink>
    </div>
  );

  const logined = (
    <div className={styles.header__infoWrapper}>
      <NavLink to={'/new-article'}>
        <button onClick={clearErrors} className={classNames(styles.header__button, styles.header__buttonCreateArticle)}>
          Create article
        </button>
      </NavLink>
      <div className={styles.header__profile}>
        <NavLink to={'/profile'}>
          <h6 onClick={clearErrors}>{user.username}</h6>
        </NavLink>
        <div className={styles.header__avatar}>
          <div className={styles.header__imgWrapper}>
            <img src={user.image ? user.image : null}></img>
          </div>
        </div>
      </div>
      <button onClick={logOut} className={classNames(styles.header__button, styles.header__buttonLogOut)}>
        Log Out
      </button>
    </div>
  );

  return (
    <>
      <header className={styles.header}>
        <NavLink className={styles.header__link} to={'/'}>
          <h6 onClick={clearErrors}>Realworld Blog</h6>
        </NavLink>
        {Object.keys(user).length === 0 ? notLogined : logined}
      </header>
      <Outlet />
    </>
  );
}
