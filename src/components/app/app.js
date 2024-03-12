import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '../layout';
import ListOfArticle from '../listOfArticle';
import OpenArticle from '../openArticle';
import Profile from '../profile';
import SignIn from '../signIn';
import SignUp from '../signUp';
import NewArticle from '../newArticle';

export default function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ListOfArticle />} />
          <Route path="articles" element={<ListOfArticle />} />
          <Route path="articles/:slug" element={<OpenArticle />} />
          <Route path="articles/:slug/edit" element={<NewArticle />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="new-article" element={<NewArticle />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}
