import FilterView from './view/filter-view.js';
import {render} from './render.js';
import UserRankView from './view/user-rank-view.js';
import StatisticsView from './view/statistics-view.js';
import RenderComponentsPresenter from './presenter/render-components-presenter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const statisticsContainerElement = document.querySelector('.footer__statistics');
const renderComponentsPresenter = new RenderComponentsPresenter();

render(new FilterView(), siteMainElement);
render(new UserRankView, siteHeaderElement);
render(new StatisticsView(), statisticsContainerElement);

renderComponentsPresenter.init(siteMainElement);
