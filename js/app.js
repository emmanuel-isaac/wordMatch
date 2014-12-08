var wordMatch = {
  word: "",
  definitionUrl: "",

  searchClick: function (e) {
    e.preventDefault();
    this.word = $('input').val().toLowerCase();
    console.log(this.word);
    if (this.validator()) {
      this.definition();
      this.thesaurus();
    }
  },

  returnWord: function () {
    this.definitionUrl = "http://api.wordnik.com:80/v4/word.json/" + this.word + "/definitions/";
    return this.definitionUrl;
  },

  returnThesaurusUrl: function () {
    this.thesaurusUrl = "http://words.bighugelabs.com/api/2/f5c79d25e5e8f8723ee62b695a8a7987/" + this.word + "/json";
    return this.thesaurusUrl;
  },

  action: function () {
    $('button').click(wordMatch.searchClick.bind(wordMatch));
  },

  definitionData: {
    limit: 3,
    includeRelated: "true",
    sourceDictionaries: "all",
    api_key: "724583fdf72680c36d0010ad78b03b1c4f3ea7b27c651f094"
  },

  definitionCallback: function (response) {
    console.log(response);
    var definitionHTML = '<ul>';
    $.each (response, function (i, definition) {
      definitionHTML += '<li>';
      definitionHTML += '<p>';
      definitionHTML += definition.text;
      definitionHTML += '</p></li>';
    });
    definitionHTML += '</ul>';
    $('.def').html(definitionHTML);
  },

  thesaurusCallback: function (response) {
    console.log(response);
    thesaurusHTML = '<ul>';
    partNames = Object.keys(response);
    console.log(partNames); 
    var thesaurusHTML = '<ul>';
    $.each(response, function (i, partOfSpeech) {
      if (partOfSpeech.hasOwnProperty('syn')) {
        thesaurusHTML += '<li>';
        thesaurusHTML += '<p>';
        thesaurusHTML += '<span>';
        thesaurusHTML += 'Synonym: ';
        thesaurusHTML += '</span>';
        for (var i = 0; i < partOfSpeech.syn.length; i++) {
          thesaurusHTML += partOfSpeech.syn[i] + ', ';
        }
        thesaurusHTML += '</p></li>';
      }

      if (partOfSpeech.hasOwnProperty('ant')) {
        thesaurusHTML += '<li>';
        thesaurusHTML += '<p>';
        thesaurusHTML += '<span>';
        thesaurusHTML += 'Antonym: ';
        thesaurusHTML += '</span>';
        for (var i = 0; i < partOfSpeech.ant.length; i++) {
          thesaurusHTML += partOfSpeech.ant[i] + ', ';
        }
        thesaurusHTML += '<br></p></li>';
      }
    }); 

    if (response.hasOwnProperty('noun')) {
      thesaurusHTML += wordMatch.nounDef();
      console.log("it is a noun");
    } 

    thesaurusHTML += '</ul>';
    $('.thes').html(thesaurusHTML);
  },

  imagesUrl: "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",

  imagesData: {
    tags: this.word,
    format: "json"
  },

  imagesCallback: function (response) {
    console.log(response);
    picturesHTML = '<a href = "' + response.items[0].link + '">';
    picturesHTML += '<img src = "' + response.items[0].link + '">';
    picturesHTML += '</a>';
    $('.image').html(picturesHTML);
  },

  //getting word definition
  definition: function () {
    this.returnWord();
    $.getJSON(this.definitionUrl, this.definitionData, this.definitionCallback);
  },

  //getting thesaurus
  thesaurus: function () {
    this.returnThesaurusUrl();
    $.getJSON(this.thesaurusUrl, this.thesaurusCallback);
  },

  //validator function
  validator: function () {
    if (this.word.trim() != "") {
      return true;
    } else {
      alert("please make a valid entry");
    }
  },

  nounDef: function () {
    var nounHTML = '<li><p class="define">';
    nounHTML += '"' + this.word + '"' + " is used as a Noun";
    nounHTML += '<br>';
    nounHTML += "A noun is the name of any person, animal place, or thing";
    nounHTML += '<br>';
    nounHTML += "For more on Nouns, ";
    nounHTML += '<a href="http://www.edb.utexas.edu/minliu/pbl/ESOL/help/libry/speech.htm#noun">';
    nounHTML += "click here";
    nounHTML += '</a></p></li>';
    return nounHTML;
  }
};

wordMatch.action();
