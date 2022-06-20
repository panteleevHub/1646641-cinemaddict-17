import {render} from './framework/render.js';
import UserRankView from './view/user-rank-view.js';
import StatisticsView from './view/statistics-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import {commentsModel} from './fish/film-card.js';
import FilterModel from './model/filter-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new UserRankView(filterPresenter.filters), siteHeaderElement);
render(new StatisticsView(filmsModel.films), statisticsContainerElement);

filterPresenter.init();
boardPresenter.init();
