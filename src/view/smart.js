import Abstract from './abstract';

// Создайте абстрактный класс Smart, унаследовав его от Abstract, с несколькими методами:
class Smart extends Abstract {


  // абстрактный метод restoreHandlers, его нужно будет реализовать в наследнике. Его задача — восстанавливать обработчики событий после перерисовки;
  restoreHandlers() {
    throw new Error('Smart method not implemented: restoreHandlers');
  }

  // обычный метод updateElement, его задачи:
  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    // удалить старый DOM-элемент компонента;
    this.removeElement();
    // создать новый DOM-элемент;
    const newElement = this.getElement();
    // поместить новый элемент вместо старого;
    parent.replaceChild(newElement, prevElement);
    // восстановить обработчики событий, вызвав restoreHandlers.
    this.restoreHandlers();
  }

  // обычный метод updateData, который будет обновлять данные и, если нужно, вызывать метод updateElement.
  updateData(update) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
      {},
      this._data,
      update,
    );
    this.updateElement();
  }

}

export default Smart;
