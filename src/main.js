import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import UserRankView from './view/user-rank-view.js';
import StatisticsView from './view/statistics-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import {generateFilterData} from './fish/filter.js';
import {commentsModel} from './fish/film-card.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, commentsModel);

const filters = generateFilterData(filmsModel.films);

render(new FilterView(filters), siteMainElement);
render(new UserRankView(filters), siteHeaderElement);
render(new StatisticsView(filmsModel.films), statisticsContainerElement);

boardPresenter.init();
