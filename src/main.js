import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import UserRankView from './view/user-rank-view.js';
import StatisticsView from './view/statistics-view.js';
import RenderComponentsPresenter from './presenter/render-components-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');

const filmCardsModel = new FilmCardsModel();
const renderComponentsPresenter = new RenderComponentsPresenter(siteMainElement, filmCardsModel);

render(new FilterView(), siteMainElement);
render(new UserRankView, siteHeaderElement);
render(new StatisticsView(), statisticsContainerElement);

renderComponentsPresenter.init();
