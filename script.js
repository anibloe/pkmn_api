(function() {
  var 
    names = [],
    ids = [],
    endPoints = {
      'getInfo': 'https://pokeapi.co/api/v2/pokemon/{id}?limit=2000&offset=0',   // https://pokeapi.co/
      'getMoveInfo': 'https://pokeapi.co/api/v2/move/{id}',
      'getCard': 'https://api.pokemontcg.io/v1/cards?nationalPokedexNumber={id}' // https://docs.pokemontcg.io/
    }, 
    dropdown = document.querySelector('select'),
    sprite = document.querySelector('.sprite'),
    card = document.querySelector('.card'),
    movesContainer = document.querySelector('.move_container');

  // Initialise the page on load
  makeRequest('getInfo', false, function(data) {

    // Prepare the arrays of ids and names
    data.results.forEach((pkmn) => {
      names.push(pkmn.name);
      ids.push(pkmn.url.split('/pokemon/')[1].split('/')[0]);
    });
  
    // Create the dropdown
    names.forEach((name, index) => {
      var option = document.createElement('option');
  
      option.value = ids[index];
      option.innerText = name;
  
      dropdown.appendChild(option);
    });
  
    // Give dropdown functionality
    dropdown.addEventListener('change', function(e) {
      var id = e.target.value;

      // Clear the moves
      movesContainer.innerHTML = '';

      // Retrieve information
      makeRequest('getInfo', id, function(data) {
        var frontSprite = data.sprites.front_default,
            moves = data.moves;

        if (!frontSprite) {
          sprite.classList.add('hide');
        }
        else {
          sprite.src = frontSprite;
          sprite.classList.remove('hide');
        }

        if (moves) {
          moves.forEach(function(move) {
            var moveId = move.move.url.split('/move/')[1].split('/')[0],
                moveListItem = document.createElement('div');

                moveListItem.setAttribute('data-move-id', moveId);
                moveListItem.innerText = move.move.name;
                
                moveListItem.addEventListener('click', function() {
                  makeRequest('getMoveInfo', moveId, function(data) {
                    moveListItem.insertAdjacentHTML('beforeend', '<span> - ' + data.effect_entries[0].effect + '</span>');
                  });
                });

            movesContainer.insertAdjacentElement('beforeend', moveListItem);
          });
        }

        console.log(data);
      });

      // Retrieve the image of the playing card
      makeRequest('getCard', id, function(data) {
        var cards = data.cards;

        if (cards.length > 0) {
          var rng = Math.floor(Math.random() * Math.floor(cards.length));

          card.src = data.cards[rng].imageUrl;
          card.classList.remove('hide');
        }
        else {
          card.classList.add('hide');
        }
        
        console.log(data);
      });
    });
  });

  function makeRequest(type, id, callback) {
    var request = new XMLHttpRequest(),
        ep;

    // Insert the Pokemon's national Pokedex id into the url
    ep = id ? endPoints[type].replace('{id}', id) : endPoints[type].replace('{id}', '');

    // Open and send the request
    request.open('GET', ep, true);
    request.send();
    request.onload = function() {
      var data = JSON.parse(this.response);
    
      if (request.status >= 200 && request.status < 400) {
        callback(data);
      } 
      else {
        console.log('Error:' + request.status + " - " + request.statusText);
      }
    }
  }

})();