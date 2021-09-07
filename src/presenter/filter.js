import FilterView from '../view/site-menu';
import {render, replace, remove} from '../utils/dom.js';
import {UpdateType} from '../const.js';
import {FilterType, filter} from '../utils/filter.js';

class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setOnFilterTypeChange(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.CHANGE_FILTER, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.films;

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

export default Filter;
