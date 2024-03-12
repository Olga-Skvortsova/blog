import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';

import { enterUser } from '../../store/loginUserReducer';

import styles from './signIn.module.sass';

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { statusOfEnterUser, errorOfEnterUser } = useSelector((state) => state.loginUserReducer);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data) => {
    dispatch(enterUser(data));
  };

  useEffect(() => {
    if (statusOfEnterUser === 'resolved') {
      reset();
      navigate('/');
    }
  }, [statusOfEnterUser]);

  return (
    <div className={styles.box}>
      <h5 className={styles.box__h5}>Sign In</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.box__info}>
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
              errorOfEnterUser ? styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.email && <p className={styles.box__error}>{errors?.email?.message}</p>}</div>
          <div>{errorOfEnterUser ? <p className={styles.box__error}>Wrong email or password</p> : null}</div>
          <p className={styles.box__infoP}>Password</p>
          <input
            {...register('password', {
              required: 'This field is required',
            })}
            placeholder="Password"
            type="password"
            className={classNames(
              styles.box__input,
              errors.password ? styles.box__inputError : '',
              errorOfEnterUser ? styles.box__inputError : ''
            )}
          ></input>
          <div>{errors?.password && <p className={styles.box__error}>{errors?.password?.message}</p>}</div>
          <div>{errorOfEnterUser ? <p className={styles.box__error}>Wrong email or password</p> : null}</div>
        </div>
        <div className={styles.box__create}>
          <button type="submit" disabled={!isValid}>
            Login
          </button>
          <p>
            Don’t have an account?
            <span> </span>
            <NavLink className={styles.box__link} to={'/sign-up'}>
              Sign Up.
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
}
