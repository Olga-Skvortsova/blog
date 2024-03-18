import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { updateUser } from '../../store/loginUserReducer';

import styles from './profile.module.sass';

export default function Profile() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { user, statusOfUpdateUser, errorOfUpdateUser } = useSelector((state) => state.loginUserReducer);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data) => {
    if (Object.values(data).some((el) => el)) {
      dispatch(updateUser({ data, user }));
    }
  };

  useEffect(() => {
    if (statusOfUpdateUser === 'resolved') {
      success();
      reset();
    }
  }, [statusOfUpdateUser]);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'User details updated',
    });
  };
  const isOkay = (
    <div className={styles.box}>
      {contextHolder}
      <h5 className={styles.box__h5}>Edit profile</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.box__info}>
          <p className={styles.box__infoP}>Username</p>
          <input
            {...register('username', {
              minLength: { value: 3, message: 'Username must contain at least 3 symbols' },
              maxLength: { value: 20, message: 'Username must contain no more than 20 symbols' },
              pattern: {
                value: /^[a-z][a-z0-9]*$/,
                message: 'You can use only English letters and numbers',
              },
            })}
            placeholder="Username"
            type="text"
            className={classNames(
              styles.box__input,
              errors.username ? styles.box__inputError : '',
              errorOfUpdateUser ? errorOfUpdateUser.payload.errors.username && styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.username && <p className={styles.box__error}>{errors?.username?.message}</p>}</div>
          <div>
            {errorOfUpdateUser
              ? errorOfUpdateUser.payload.errors.username && (
                  <p className={styles.box__error}>{errorOfUpdateUser.payload.errors.username}</p>
                )
              : null}
          </div>

          <p className={styles.box__infoP}>Email address</p>
          <input
            {...register('email', {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
            placeholder="Email address"
            type="email"
            className={classNames(
              styles.box__input,
              errors.email ? styles.box__inputError : '',
              errorOfUpdateUser ? errorOfUpdateUser.payload.errors.email && styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.email && <p className={styles.box__error}>{errors?.email?.message}</p>}</div>
          <div>
            {errorOfUpdateUser
              ? errorOfUpdateUser.payload.errors.email && (
                  <p className={styles.box__error}>{errorOfUpdateUser.payload.errors.email}</p>
                )
              : null}
          </div>

          <p className={styles.box__infoP}>New password</p>
          <input
            {...register('password', {
              minLength: { value: 6, message: 'Password must contain at least 6 symbols' },
              maxLength: { value: 40, message: 'Password must contain no more than 40 symbols' },
            })}
            placeholder="New password"
            type="password"
            className={classNames(
              styles.box__input,
              errors.password ? styles.box__inputError : '',
              errorOfUpdateUser ? errorOfUpdateUser.payload.errors.password && styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.password && <p className={styles.box__error}>{errors?.password?.message}</p>}</div>
          <div>
            {errorOfUpdateUser
              ? errorOfUpdateUser.payload.errors.password && (
                  <p className={styles.box__error}>{errorOfUpdateUser.payload.errors.password}</p>
                )
              : null}
          </div>

          <p className={styles.box__infoP}>Avatar image (url)</p>
          <input
            {...register('avatar', {
              pattern: {
                value:
                  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                message: 'Invalid url format',
              },
            })}
            placeholder="Avatar image"
            type="text"
            className={classNames(
              styles.box__input,
              errors.avatar ? styles.box__inputError : '',
              errorOfUpdateUser ? errorOfUpdateUser.payload.errors.image && styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.avatar && <p className={styles.box__error}>{errors?.avatar?.message}</p>}</div>
          <div>
            {errorOfUpdateUser
              ? errorOfUpdateUser.payload.errors.image && (
                  <p className={styles.box__error}>{errorOfUpdateUser.payload.errors.image}</p>
                )
              : null}
          </div>
        </div>
        <div className={styles.box__create}>
          <button type="submit" disabled={!isValid}>
            Create
          </button>
        </div>
      </form>
    </div>
  );

  let content;
  if (errorOfUpdateUser) {
    if (errorOfUpdateUser.payload.errors.message === 'Not Found') {
      content = <h2 className={styles.error}>Got error...</h2>;
    } else {
      content = isOkay;
    }
  } else {
    content = isOkay;
  }

  return statusOfUpdateUser === 'loading' ? (
    <div className={styles.loading}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  ) : (
    content
  );
}
