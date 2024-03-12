import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { message } from 'antd';
import classNames from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';

import { createArticle, updateArticle } from '../../store/createArticleReducer';

import styles from './newArticle.module.sass';

export default function NewArticle() {
  const [editArticle, setEditArticle] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.loginUserReducer);
  const { articles } = useSelector((state) => state.getArticleReducer);
  const { statusOfCreateArticle, errorOfCreateArticle, statusOfUpdateArticle, errorOfUpdateArticle } = useSelector(
    (state) => state.createArticleReducer
  );
  const { slug } = useParams();

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: slug
      ? articles.find((art) => art.slug === slug).tagList.length > 0
        ? {
            tags: articles
              .find((art) => art.slug === slug)
              .tagList.map((el) => {
                return { name: '', amount: 0 };
              }),
          }
        : { tags: [{ name: '', amount: 0 }] }
      : { tags: [{ name: '', amount: 0 }] },
  });
  const { fields, append, prepend, remove } = useFieldArray({
    name: 'tags',
    control,
  });

  const successCreate = () => {
    messageApi.open({
      type: 'success',
      content: 'New article created',
    });
  };

  const serverError = () => {
    messageApi.open({
      type: 'error',
      content: 'Server error',
    });
  };

  const notUrArticle = () => {
    messageApi.open({
      type: 'error',
      content: 'That is not your article, you cannot edit it',
    });
  };

  useEffect(() => {
    if (editArticle) {
      setValue('title', editArticle.title);
      setValue('description', editArticle.description);
      setValue('text', editArticle.body);
      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }
      editArticle.tagList.forEach((tag, index) => {
        append({ tag: tag, amount: 0 });
      });
    }
  }, [editArticle, setValue]);

  useEffect(() => {
    if (slug) {
      setEditArticle(articles.find((art) => art.slug === slug));
    } else {
      setEditArticle('');
    }
  }, []);

  useEffect(() => {
    if (statusOfCreateArticle === 'resolved') {
      reset();
      successCreate();
    } else if (statusOfCreateArticle === 'rejected') {
      if (errorOfCreateArticle.payload.errors.message === 'Not Found') {
        serverError();
      }
    }
  }, [statusOfCreateArticle]);

  useEffect(() => {
    if (statusOfUpdateArticle === 'resolved') {
      reset();
      navigate('/');
    } else if (statusOfUpdateArticle === 'rejected') {
      errorOfUpdateArticle.payload.errors ? serverError() : notUrArticle();
    }
  }, [statusOfUpdateArticle]);

  const onSubmit = (data) => {
    if (slug) {
      dispatch(updateArticle({ data, user, slug }));
    } else {
      dispatch(createArticle({ data, user }));
    }
  };

  return (
    <div className={styles.article}>
      {contextHolder}
      <h5 className={styles.article__h5}>{slug ? 'Edit article' : 'Create new article'}</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classNames(styles.article__title, styles.article__wrapper)}>
          <p>Title</p>
          <input
            {...register('title', {
              required: 'This field is required',
            })}
            type="text"
            placeholder="title"
            className={classNames(styles.article__input, errors.title ? styles.article__inputError : '')}
          ></input>
          <div>{errors?.title && <p className={styles.article__error}>{errors?.title?.message}</p>}</div>
        </div>
        <div className={classNames(styles.article__description, styles.article__wrapper)}>
          <p>Short description</p>
          <input
            {...register('description', {
              required: 'This field is required',
            })}
            type="text"
            placeholder="description"
            className={classNames(styles.article__input, errors.description ? styles.article__inputError : '')}
          ></input>
          <div>{errors?.description && <p className={styles.article__error}>{errors?.description?.message}</p>}</div>
        </div>
        <div className={classNames(styles.article__text, styles.article__wrapper)}>
          <p>Text</p>
          <textarea
            {...register('text', {
              required: 'This field is required',
            })}
            type="text"
            placeholder="text"
            className={classNames(styles.article__textarea, errors.text ? styles.article__inputError : '')}
          ></textarea>
          <div>{errors?.text && <p className={styles.article__error}>{errors?.text?.message}</p>}</div>
        </div>
        <div className={styles.article__tags}>
          <p>Tags</p>
          {fields.map((field, index) => {
            return (
              <div key={field.id + Math.random()} className={classNames(styles.article__tag)}>
                <input {...register(`tags.${index}.tag`)} type="text" placeholder="tag"></input>
                <button
                  onClick={() => {
                    remove(index);
                  }}
                  className={classNames(styles.article__tagButton, styles.article__tagButton_red)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => {
              append();
            }}
            className={classNames(styles.article__tagButton, styles.article__tagButton_blue)}
          >
            Add tag
          </button>
        </div>
        <button type="submit" disabled={!isValid} className={styles.article__buttonSend}>
          Send
        </button>
      </form>
    </div>
  );
}
