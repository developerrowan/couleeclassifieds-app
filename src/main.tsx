import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faBars,
  faPenToSquare,
  faTrash,
  faArrowLeft,
  faEnvelope,
  faLock,
  faUserGroup,
  faChartLine,
  faSignature,
  faComment,
  faPencil
} from '@fortawesome/free-solid-svg-icons';

import App from './App';

import './assets/styles/index.css';

library.add(
  faUser,
  faBars,
  faPenToSquare,
  faTrash,
  faArrowLeft,
  faEnvelope,
  faLock,
  faUserGroup,
  faChartLine,
  faSignature,
  faComment,
  faPencil
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
