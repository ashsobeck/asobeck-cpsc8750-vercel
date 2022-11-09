import * as Chess from 'js-chess-engine';

import styles from '../styles/Chess.module.css';

// maps js-chess-engine's codes to text chess pieces
const GLYPHS = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟︎",
};

export default function ChessPage() {
  console.log(styles);
  return (
    <div className={styles.main}>
      <div className={styles['chess-container']}>
            <div ref={makeGame}/>
          </div>
    </div>
  );
}

const makeGame = ( div ) => {
  const board = document.createElement('table');
  board.className = styles.board
  fillInBoard(board);

  div.appendChild(board);

  const game = new Chess.Game();
  let gameState = game.exportJson();
  
  Object.keys(gameState.pieces).forEach(square => {
    const el = document.getElementById(square);

    const piece = gameState.pieces[square];
    el.innerText = GLYPHS[piece];
  });

  let selected = null;
 
  const onClick = ( event ) => {
    const square = event.target.id;
    console.log('clicked ' + square);
    console.log(selected);

    if (selected && gameState?.moves[selected]?.includes(square)) {
      game.move(selected, square);
      gameState.moves[selected].forEach(option => {
        const el = document.getElementById(option);
        el.classList.remove(styles.isMoveOption);
      })
      gameState = game.exportJson();
      // update the text by clearing out the old square
      document.getElementById(selected).innerText = "";
      // and putting the piece on the new square
      document.getElementById(square).innerText = GLYPHS[gameState.pieces[square]];
      
      
      selected = null;
      // ai move
      const [movedFrom, movedTo] = Object.entries(game.aiMove())[0];
      // update the ai's piece by clearing out the old square
      document.getElementById(movedFrom).innerText = "";
      // and putting the ai's piece on the new square
      document.getElementById(movedTo).innerText = GLYPHS[gameState.pieces[movedTo]];
      gameState = game.exportJson();
    }
    else if (gameState.moves[square] != selected && selected) {
      gameState?.moves[selected]?.forEach(option => {
        const el = document.getElementById(option);
        console.log('removing');
        el.classList.remove(styles.isMoveOption);
      })
      // gameState = game.exportJson();
      console.log(selected);
      selected = square;
      gameState?.moves[square]?.forEach(option => {
        const el = document.getElementById(option);
        el.classList.add(styles.isMoveOption);
      })
    }
    else if (gameState.moves[square]) {
      // clicked on a piece that can move,
      // set the selection to that piece
      selected = square;
      // console.log(styles);
      gameState?.moves[square]?.forEach(option => {
        const el = document.getElementById(option);
        el.classList.add(styles.isMoveOption);
      })
      // selected = null;
    }
    else if (selected) {
      // they tried to move a piece to a random spot on the board
      return;
    }
    console.log(selected);
  }

  Array.from(
    board.getElementsByClassName(styles.square)
  ).forEach(el => el.onclick = onClick);
}

const fillInBoard = ( board ) => {
  const COLNAMES = " ABCDEFGH";

  const body = document.createElement('tbody');

  // make each row in the table
  for (let r = 8; r >= 1; r--) {
    const row = document.createElement('tr');

    // number each row
    const rowLabel = document.createElement('td');
    rowLabel.innerText = r.toString();
    row.appendChild(rowLabel);

    // add the board squares
    for (let c = 1; c <= 8; c++) {
      const colName = COLNAMES[c];

      const square = document.createElement('td');
      square.id = colName + r;

      // color alternating squares
      const color = (r + c) % 2 ? styles.white : styles.black;
      square.className = styles.square + ' ' + color;

      row.appendChild(square);
    }

    body.appendChild(row);
  }

  // put column numbers on the bottom
  const footer = document.createElement('tr');
  for (let c = 0; c <= 8; c++) {
    const label = document.createElement('td');
    label.innerText = COLNAMES[c];

    footer.appendChild(label);
  }

  body.appendChild(footer);

  board.appendChild(body);
}

