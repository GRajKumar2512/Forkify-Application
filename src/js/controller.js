import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // really old browsers can also support our application
import 'regenerator-runtime/runtime'; // really old browsers can also support our application
import { CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
console.log('testing the Recipe app!');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // returns the hash_id present in the url

    if (!id) return;
    recipeView.renderSpinner();

    // TASK: update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // TASK: Loading Recipe
    await model.loadRecipe(id);

    // TASK: Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // TASK: Loading Search Results
    await model.loadSearchResults(query);

    // TASK: Rendering results of the searched item
    resultsView.render(model.getSearchResultsPage());

    // TASK: Rendering the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // TASK: displays the new results with the desired page
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // TASK: displays the new updated buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // TASK: Update the recipe servings (in state)
  model.updateServings(newServings);

  // TASK: Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // TASK: Add/Remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // TASK: update recipe view
  recipeView.update(model.state.recipe);

  // TASK: Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlRecipeUpload = async function (yourRecipe) {
  try {
    // TASK: show loading spinner
    addRecipeView.renderSpinner();

    // TASK: upload the data in the API
    await model.uploadRecipe(yourRecipe);

    // TASK: Render Recipe
    recipeView.render(model.state.recipe);

    // TASK: render success message
    addRecipeView.renderSuccess();

    // TASK: render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // TASK: change the ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // TASK: close the window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // renders all the bookmarks as soon as the website get loaded
  recipeView.addHandlerRender(controlRecipes); // renders recipe
  recipeView.addHandlerUpdateServings(controlServings); // renders updated servings
  recipeView.addHandlerAddBookmark(controlAddBookmark); // renders bookmark
  searchView.addHandlerSearch(controlSearchResults); // renders search results on the sidebar
  paginationView.addHandlerClick(controlPagination); // renders the paginated results
  addRecipeView.addhandlerUpload(controlRecipeUpload); // grabs the recipe data from the FORM
};
init();
