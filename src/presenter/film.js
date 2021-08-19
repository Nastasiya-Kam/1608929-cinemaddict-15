// import FilmDetailsView from './view/film-details.js';

class Film {
  // constructor {

  // }


  // const openFilmDetails = (film) => {
  //   const filmDetailsComponent = new FilmDetailsView(film);

  //   site.appendChild(filmDetailsComponent.getElement());
  //   site.classList.add('hide-overflow');

  //   filmDetailsComponent.setOnFilmDetailsClick((evt) => {
  //     if (evt.target.tagName === 'BUTTON') {
  //       evt.target.classList.toggle('film-details__control-button--active');
  //     }
  //   });

  //   const onFilmDetailsEscKeydown = (evt) => {
  //     if (isEscEvent(evt)) {
  //       evt.preventDefault();
  //       document.removeEventListener('keydown', onFilmDetailsEscKeydown);
  //       site.classList.remove('hide-overflow');
  //       site.removeChild(filmDetailsComponent.getElement());
  //     }
  //   };

  //   document.addEventListener('keydown', onFilmDetailsEscKeydown);

  //   filmDetailsComponent.setOnCloseButtonClick(() => {
  //     document.removeEventListener('keydown', onFilmDetailsEscKeydown);
  //     site.classList.remove('hide-overflow');
  //     site.removeChild(filmDetailsComponent.getElement());
  //   });

  //   // !Одновременно может быть открыт только один попап.
  //   // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
  //   // !Несохранённые изменения (неотправленный комментарий) пропадают.
  // };
}

export default Film;
