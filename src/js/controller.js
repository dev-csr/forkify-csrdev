import * as modal from './modal';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if(module.hot){
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(modal.getSearchResultsPage());

    bookmarksView.update(modal.state.bookmarks);

    await modal.loadRecipe(id);
    // recipeView.render(modal.state.recipe);
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await modal.loadSearchResults(query);
    // resultsView.render(modal.state.search.results);
    resultsView.render(modal.getSearchResultsPage(1));

    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err);
  }
};
controlSearchResults();

const controlPagination = function (goToPage) {
  resultsView.render(modal.getSearchResultsPage(goToPage));

  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  // Update the receipe servings(in state)
  modal.updateServings(newServings);

  // Update the recipe view
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);

  // Update recipe view
  recipeView.update(modal.state.recipe);

  // Render bookmarks
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await modal.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(modal.state.bookmarks);

    // Close from window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandleClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
