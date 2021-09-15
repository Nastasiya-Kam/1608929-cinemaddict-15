import SiteMenuView from '../view/site-menu';
import {render, replace, remove} from '../utils/dom.js';
import {UpdateType} from '../const.js';
import {FilterType, filter} from '../utils/filter.js';

class SiteMenu {
  constructor(changeMenu, filterContainer, filterModel, filmsModel) {
    this._changeMenu = changeMenu;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._siteMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleStatisticsClick = this._handleStatisticsClick.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevSiteMenuComponent = this._siteMenuComponent;

    this._siteMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._siteMenuComponent.setOnFilterTypeClick(this._handleFilterTypeClick);
    this._siteMenuComponent.setOnStatsClick(this._handleStatisticsClick);

    if (prevSiteMenuComponent === null) {
      render(this._filterContainer, this._siteMenuComponent);
      return;
    }

    replace(this._siteMenuComponent, prevSiteMenuComponent);
    remove(prevSiteMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleStatisticsClick() {
    if (this._filterModel.getFilter() === null) {
      return;
    }

    this._changeMenu(UpdateType.STATISTICS_OPENED);
    this._filterModel.setFilter(UpdateType.FILTER_CHANGED, null);
  }

  _handleFilterTypeClick(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    const prevFilterType = this._filterModel.getFilter();

    this._filterModel.setFilter(UpdateType.FILTER_CHANGED, filterType);

    if (prevFilterType === null) {
      this._changeMenu(UpdateType.FILTER_CHANGED);
    }
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        typeFilter: FilterType.ALL,
        href: '#all',
        isActive: true,
        title: 'All movies',
        hasCount: -1,
      },
      {
        typeFilter: FilterType.WATCH_LIST,
        href: '#watchlist',
        isActive: false,
        title: 'Watchlist',
        hasCount: filter[FilterType.WATCH_LIST](films).length,
      },
      {
        typeFilter: FilterType.WATCHED,
        href: '#history',
        isActive: false,
        title: 'History',
        hasCount: filter[FilterType.WATCHED](films).length,
      },
      {
        typeFilter: FilterType.FAVORITE,
        href: '#favorites',
        isActive: false,
        title: 'Favorites',
        hasCount: filter[FilterType.FAVORITE](films).length,
      },
    ];
  }
}

export default SiteMenu;
