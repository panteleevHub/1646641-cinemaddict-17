import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './api-services/films-api-service.js';
import CommentsApiService from './api-services/comments-api-service.js';

const AUTHORIZATION = 'Basic ig29LS24Pcl1ba0M';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const boardPresenter = new BoardPresenter(
  siteMainElement,
  filmsModel,
  commentsModel,
  filterModel,
  statisticsContainerElement,
  siteHeaderElement,
  filterPresenter
);

filterPresenter.init();
boardPresenter.init();
filmsModel.init();
