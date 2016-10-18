/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiGame = __webpack_require__(1);
	const HanoiView = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  new HanoiView(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	      // move all the discs to the last or second tower
	      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	  }

	  move(startTowerIdx, endTowerIdx) {
	      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	        return true;
	      } else {
	        return false;
	      }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class HanoiView {
	  constructor(game, $el) {
	    this.game = game;
	    this.$el = $el;
	    this.setupTowers();
	    this.render();
	    this.first = false;
	  }

	  setupTowers() {
	    this.$el.empty();
	    this.$el.addClass("group");

	    for (let towerNum = 0; towerNum < 3; towerNum++) {
	      let $tower = $("<ul>");
	      $tower.data("idx", towerNum);
	        if (towerNum === 0) {
	        for (let id = 1; id < 4; id++) {
	          let $li = $("<li>");
	          $li.addClass(`disk-${id}`);
	          $tower.append($li);
	        }
	      }
	      else {
	        for (let id = 1; id < 4; id++) {
	          let $li = $("<li>");
	          $tower.append($li);
	        }
	      }
	      this.$el.append($tower);
	    }
	  }

	  render() {
	    this.clickTower();
	  }

	  clickTower() {
	    $("ul").on("click", event => {
	      if (this.first === false){
	        this.firstClick(event);
	      }
	      else {
	        this.secondClick(event);
	      }
	    });
	  }

	  firstClick(event) {
	    const $firstClick = $(event.currentTarget);
	    $firstClick.addClass("selected");
	    this.first = $firstClick;
	  }

	  secondClick(event) {
	    const $secondClick = $(event.currentTarget);
	    let result = this.game.move(this.first.data("idx"),
	        $secondClick.data("idx"));
	    this.first.removeClass("selected");
	    if (result === false){
	      window.alert("invalid move! you suck!");
	    }
	    else {
	      let firstChildren = this.first.children();
	      let secondChildren = $secondClick.children();
	      let className = this.findFirstTop(firstChildren).context.className;
	      this.findFirstTop(firstChildren).removeAttr('class');
	      this.findSecondTop(secondChildren).addClass(className);
	      setTimeout(() => {if (this.game.isWon()) {
	        window.alert("Congrats, you win! You rock!");
	      }}, 10);
	    }
	    this.first = false;

	  }

	  findFirstTop(children) {
	    for (var i = 0; i < children.length; i++) {
	      if ($(children[i]).context.className !== "") {
	        console.log(children[i]);
	        return $(children[i]);
	      }
	    }
	  }

	  findSecondTop(children) {
	    for (var i = children.length-1; i >= 0; i--) {
	      console.log($(children[i]).context.className);
	      if ($(children[i]).context.className === "") {
	        console.log(children[i]);
	        return $(children[i]);
	      }
	    }
	  }

	}



	module.exports = HanoiView;


/***/ }
/******/ ]);