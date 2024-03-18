import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { loginUser } from '../../store/loginUserReducer';

import styles from './signUp.module.sass';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { statusOfLoginUser, errorOfLoginUser } = useSelector((state) => state.loginUserReducer);

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onBlur' });

  const password = watch('password');

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (statusOfLoginUser === 'resolved') {
      reset();
      navigate('/');
    }
  }, [statusOfLoginUser]);

  let isOkay = (
    <div className={styles.box}>
      <h5 className={styles.box__h5}>Create new account</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.box__info}>
          <p className={styles.box__infoP}>Username</p>
          <input
            {...register('username', {
              required: 'This field is required',
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
              errorOfLoginUser ? styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.username && <p className={styles.box__error}>{errors?.username?.message}</p>}</div>
          <div>
            {errorOfLoginUser
              ? errorOfLoginUser.payload.errors.username && (
                  <p className={styles.box__error}>{errorOfLoginUser.payload.errors.username}</p>
                )
              : null}
          </div>

          <p className={styles.box__infoP}>Email address</p>
          <input
            {...register('email', {
              required: 'This field is required',
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
              errorOfLoginUser ? styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.email && <p className={styles.box__error}>{errors?.email?.message}</p>}</div>
          <div>
            {errorOfLoginUser
              ? errorOfLoginUser.payload.errors.email && (
                  <p className={styles.box__error}>{errorOfLoginUser.payload.errors.email}</p>
                )
              : null}
          </div>

          <p className={styles.box__infoP}>Password</p>
          <input
            {...register('password', {
              required: 'This field is required',
              minLength: { value: 6, message: 'Password must contain at least 6 symbols' },
              maxLength: { value: 40, message: 'Password must contain no more than 40 symbols' },
            })}
            placeholder="Password"
            type="password"
            className={classNames(styles.box__input, errors.password ? styles.box__inputError : '')}
          ></input>
          <div>{errors?.password && <p className={styles.box__error}>{errors?.password?.message}</p>}</div>

          <p className={styles.box__infoP}>Repeat Password</p>
          <input
            {...register('repeatPassword', {
              validate: (value) => value === password || 'The passwords do not match',
              required: 'This field is required',
            })}
            placeholder="Password"
            type="password"
            className={classNames(styles.box__input, errors.repeatPassword ? styles.box__inputError : '')}
          ></input>
          <div>{errors?.repeatPassword && <p className={styles.box__error}>{errors?.repeatPassword?.message}</p>}</div>
        </div>
        <div className={styles.box__agree}>
          <label>
            <input
              {...register('agreeInput', {
                required: true,
              })}
              type="checkbox"
              value="agree"
            />
            <span></span>
            <p>I agree to the processing of my personal information</p>
          </label>
        </div>
        <div className={styles.box__create}>
          <button type="submit" disabled={!isValid}>
            Create
          </button>
          <p>
            Already have an account?
            <span> </span>
            <NavLink className={styles.box__link} to={'/sign-in'}>
              Sign In.
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
  let content;
  if (errorOfLoginUser) {
    if (errorOfLoginUser.payload.errors.message === 'Not Found') {
      content = <h2 className={styles.error}>Got error...</h2>;
    } else {
      content = isOkay;
    }
  } else {
    content = isOkay;
  }

  return statusOfLoginUser === 'loading' ? (
    <div className={styles.loading}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  ) : (
    content
  );
}
