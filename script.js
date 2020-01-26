(function() {
  var request = new XMLHttpRequest(),
    names = [],
    ids = [],
    endPoint = 'https://pokeapi.co/api/v2/pokemon/{id}?limit=2000&offset=0',
    dropdown = document.querySelector('select'),
    image = document.querySelector('img');

  makeRequest(0, function(data) {

    data.results.forEach((pkmn) => {
      names.push(pkmn.name);
      ids.push(pkmn.url.split('/pokemon/')[1].split('/')[0]);
    });
  
    names.forEach((name, index) => {
      var option = document.createElement('option');
  
      option.value = ids[index];
      option.innerText = name;
  
      dropdown.appendChild(option);
    });
  
    dropdown.addEventListener('change', function(e) {
      var id = e.target.value;
      makeRequest(id, function(data) {
        image.src = data.sprites.front_default;
        console.log(data);
      });
    });
  });

  function makeRequest(id, callback) {
    var ep;

    ep = id ? endPoint.replace('{id}', id) : endPoint.replace('{id}', '');

    request.open('GET', ep, true);

    request.onload = function() {
      
      var data = JSON.parse(this.response);
    
      if (request.status >= 200 && request.status < 400) {
        callback(data);
      } 
      else {
        console.log('error');
      }
    }
    request.send();
  }

})();