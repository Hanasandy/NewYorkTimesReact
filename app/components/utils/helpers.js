// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// Helper functions for making API Calls
var helper = {

  // This function serves our purpose of running the query to geolocate.
  runQuery: function(term, start, end) {
    var article  = term;
    var startYear = "19500101";
    var endYear = "20170101";
    var key = "aec8cc50d1f74f8db17a2aecdc079ef7";
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + article +"&begin_date="+ startYear +"&end_date="+endYear+ "&api-key=" + key;
    return axios.get(queryURL);
  },
  
  getArticle: function(url) {
    return axios.get(url);
  },
  
  deleteArticle: function(url) {
    return axios.post(url);
  },
  createArticle: function(url, data){
    console.log(url + data)
    return axios.post(url, data);
  }
};

// We export the API helper
module.exports = helper;