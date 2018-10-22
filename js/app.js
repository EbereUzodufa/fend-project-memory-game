//Declaration of variables
let playedSec = 0;
let playedMins = 0;
let playedhrs = 0;
let stopGame = false;
window.onload = function() {
    setInterval(function() {
        if (stopGame !== true) {
            playedSec++;
            if (playedSec === 60) {
                playedMins++;
                playedSec = 0;
            }
            if (playedMins === 60) {
                hours++;
                playedMins = 0;
                playedSec = 0;
            }
            updateDisplayTime();
        }

    }, 1000);
};

const updateDisplayTime = function(){
	$('.timer').html(playedhrs + ':' + playedMins + ':' + playedSec);
}


/*
 * Create a list that holds all of your cards
 */
let myCards = [];
let myCardNames = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];
let listOfOpenCards = [];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
$('.deck').each(function() {
    $(this).find('li').each(function() {
        myCards.push($(this));
    });
});

let cardTemp = 0;

myCardNames = shuffle(myCardNames);

let cardNo = 0;
$('.deck').each(function() {
    $(this).find('li').find('i').each(function() {
        $(this).removeAttr('class');
        $(this).addClass(myCardNames[cardNo]);
        cardNo++;
    });
});

$('.deck').each(function() {
    $(this).find('li').find('i').each(function() {
        let cardTempClass = $($(myCards[cardTemp][0]).find('i')[0]).attr('class');
        $(this).removeAttr('class');
        $(this).addClass(cardTempClass);
        cardTemp++;
    });
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        cardTemporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        cardTemporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = cardTemporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let gameMoves = 0;
let gameScore;

let scores = function(){
	gameScore = ((100/gameMoves) * 50);
	gameScore = (Math.round(gameScore * 100))/100;
}

removeProperties = function(prop) {
    setTimeout(function() {
        prop.removeClass('show open animated wobble');
        listOfOpenCards[0].removeClass('show open animated wobble');
        listOfOpenCards = [];
    }, 400);
};

showCardOnClick = function(clickEvent) {
    clickEvent.on('click', function() {
        gameMoves++;
        $('.moves').html(gameMoves);
        if ((listOfOpenCards.length % 2) === 0) {
            $(this).addClass('show open animated wobble');
            $(this).off('click');
            listOfOpenCards.push($(this));
        } else if (listOfOpenCards.length !== 0) {
            $(this).addClass('show open animated wobble');

            let thisCard = $(this);
            for (let i = 0; i < listOfOpenCards.length; i++) {
                if (listOfOpenCards[i].find('i').attr('class') === thisCard.find('i').attr('class')) {
                    thisCard.removeClass('animated wobble');
                    thisCard.addClass('show match animated rubberBand');
                    listOfOpenCards[i].removeClass('animated wobble');
                    listOfOpenCards[i].addClass('show match animated rubberBand');
                    console.log('Cards match');
                    $(this).off('click');
                    listOfOpenCards = [];
                    break;
                } else {
                    thisCard.addClass('show open animated wobble');
                    removeProperties(thisCard);
                    listOfOpenCards[0].on('click', showCardOnClick(listOfOpenCards[0]));
                    console.log('Cards did not match');
                }
            }
        }
        if ($('.deck').find('.match').length === 16) {
        	scores();
            setTimeout(function() {
                $('.deck').each(function() {
                    swal({
                        title: 'Congratulations',
                        type: 'success',
                        text: 'You have won the game. It took ' + gameMoves + ' moves, so your Score is ' + gameScore + '. Time taken to complete this game is ' + playedhrs + ' Hours ' + playedMins + ' Minutes and ' + playedSec + ' Seconds. Nice Job!!',
                        allowOutsideClick: false,
                        showCancelButton: true,
                        confirmButtonText: 'Play Again',
                        confirmButtonColor: '#02ccba',
                        cancelButtonText: 'Close',
                        cancelButtonColor: '#aa7ecd'
                    }).then(function() {
                        location.reload();
                    }, function(dismiss) {
                        console.log('Yes');
                    });

                });
            }, 300);
            stopGame = true;
            $('.timer').hide();
            $('.timer').html('0:0:0');
            $('.timer').show();
        }


    });
};

for (let i = 0; i < myCards.length; i++) {
    myCards[i].on('click', showCardOnClick(myCards[i]));
}

$('.restart').on('click', function() {
    location.reload();
});