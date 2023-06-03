import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markUp = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup(); // this will return a string of html markup

    const newDOM = document.createRange().createContextualFragment(newMarkUp); // this takes a string and converts it to virtual DOM

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const actualElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const actualEl = actualElements[i];
      // console.log(newEl.isEqualNode(actualEl));  compares the new node to the actual node

      // TASK: updates changed TEXT
      if (
        !newEl.isEqualNode(actualEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        actualEl.textContent = newEl.textContent;
      }

      // TASK: updates changed ATTRIBUTES
      if (!newEl.isEqualNode(actualEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          actualEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
    <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSuccess(message = this._message) {
    const markUp = `
    <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
