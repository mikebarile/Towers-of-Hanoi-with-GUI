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
