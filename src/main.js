import FilterView from './view/filter-view.js';
import {render} from './render.js';
import UserRankView from './view/user-rank-view.js';
import StatisticsView from './view/statistics-view.js';
import RenderingComponentsPresenter from './presenter/rendering-components-presenter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');
const renderingComponentsPresenter = new RenderingComponentsPresenter();

render(new FilterView(), siteMainElement);
render(new UserRankView, siteHeaderElement);
render(new StatisticsView(), statisticsContainerElement);

renderingComponentsPresenter.init(siteMainElement);
