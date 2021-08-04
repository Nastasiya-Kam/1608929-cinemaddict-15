const createProfileTemplate = (count) => {
  let rating = '';
  const watched = count.watched;

  // todo переделать логику "изъятия" значения звания (разработать структуру в модуле user.js)
  // todo перечитать теорию про структуры
  if (watched === 0) {
    return '<section class="header__profile profile"></section>';
  } else if (watched <= 10) {
    rating = 'novice';
  } else if (watched <= 20) {
    rating = 'fan';
  } else {
    rating = 'Movie Buff';
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export {createProfileTemplate};
