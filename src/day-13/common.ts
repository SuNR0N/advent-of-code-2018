export interface Cart {
  x: number;
  y: number;
  cartSymbol: string;
  trackSymbol: string;
  directions: Directons[];
}

export interface Tile {
  x: number;
  y: number;
  trackSymbol: string;
}

export enum Directons {
  LEFT,
  STRAIGHT,
  RIGHT,
};

export function getInitialCartPositions(track: string[][]): Cart[] {
  const cartRegExp = /^[\^v<>]$/;
  const carts: Cart[] = [];
  track.forEach((line, rowIndex) => {
    const len = line.length;
    for (let colIndex = 0; colIndex < len; colIndex++) {
      const symbol = line[colIndex];
      if (cartRegExp.test(symbol)) {
        carts.push({
          x: rowIndex,
          y: colIndex,
          cartSymbol: symbol,
          trackSymbol: getTrackSymbol(track, rowIndex, colIndex, symbol),
          directions: [
            Directons.LEFT,
            Directons.STRAIGHT,
            Directons.RIGHT,
          ],
        });
      }
    }
  });
  return carts;
}

function getTrackSymbol(track: string[][], r: number, c: number, cartSymbol: string): string {
  const left = track[r][c - 1] || '';
  const right = track[r][c + 1] || '';
  const top = track[r - 1] && track[r - 1][c] || '';
  const bottom = track[r + 1] && track[r + 1][c] || '';
  let trackSymbol = '';
  const verticalRegExp = /^\|$/;
  const horizontalRegExp = /^-$/;
  const intersectionRegExp = /^\+$/;
  const cornersVerticalRegExp = /^[|\\/]$/;
  const cornersHorizontalRegExp = /^[-\\/]$/;
  switch (cartSymbol) {
    case '^':
      if (
        top.match(cornersVerticalRegExp) && bottom.match(cornersVerticalRegExp) ||
        top.match(intersectionRegExp) && bottom.match(cornersVerticalRegExp) ||
        bottom.match(intersectionRegExp) && top.match(cornersVerticalRegExp)
      ) {
        trackSymbol = '|';
      } else if (top.match(verticalRegExp) && left.match(horizontalRegExp)) {
        trackSymbol = '/';
      } else if (top.match(verticalRegExp) && right.match(horizontalRegExp)) {
        trackSymbol = '\\';
      }
      break;
    case 'v':
      if (
        top.match(cornersVerticalRegExp) && bottom.match(cornersVerticalRegExp) ||
        top.match(intersectionRegExp) && bottom.match(cornersVerticalRegExp) ||
        bottom.match(intersectionRegExp) && top.match(cornersVerticalRegExp)
      ) {
        trackSymbol = '|';
      } else if (bottom.match(verticalRegExp) && right.match(horizontalRegExp)) {
        trackSymbol = '/';
      } else if (bottom.match(verticalRegExp) && left.match(horizontalRegExp)) {
        trackSymbol = '\\';
      }
      break;
    case '<':
      if (
        left.match(cornersHorizontalRegExp) && right.match(cornersHorizontalRegExp) ||
        left.match(intersectionRegExp) && right.match(cornersHorizontalRegExp) ||
        right.match(intersectionRegExp) && left.match(cornersHorizontalRegExp)
      ) {
        trackSymbol = '-';
      } else if (left.match(horizontalRegExp) && bottom.match(verticalRegExp)) {
        trackSymbol = '\\';
      } else if (left.match(horizontalRegExp) && top.match(verticalRegExp)) {
        trackSymbol = '/';
      }
      break;
    case '>':
      if (
        left.match(cornersHorizontalRegExp) && right.match(cornersHorizontalRegExp) ||
        left.match(intersectionRegExp) && right.match(cornersHorizontalRegExp) ||
        right.match(intersectionRegExp) && left.match(cornersHorizontalRegExp)
      ) {
        trackSymbol = '-';
      } else if (right.match(horizontalRegExp) && top.match(verticalRegExp)) {
        trackSymbol = '\\';
      } else if (right.match(horizontalRegExp) && bottom.match(verticalRegExp)) {
        trackSymbol = '/';
      }
      break;
    default:
      break;
  }
  return trackSymbol;
}

export function updateCartOrder(carts: Cart[]): void {
  carts.sort((a, b) => {
    const diff = a.x - b.x;
    return diff === 0 ? a.y - b.y : diff;
  });
}

export function getNextTile(cart: Cart, track: string[][]): Tile {
  const tile: Tile = {
    trackSymbol: '',
    x: cart.x,
    y: cart.y,
  };
  switch (cart.cartSymbol) {
    case '^':
      tile.x = cart.x - 1;
      tile.y = cart.y;
      break;
    case 'v':
      tile.x = cart.x + 1;
      tile.y = cart.y;
      break;
    case '<':
      tile.x = cart.x;
      tile.y = cart.y - 1;
      break;
    case '>':
      tile.x = cart.x;
      tile.y = cart.y + 1;
      break;
    default:
      break;
  }
  tile.trackSymbol = track[tile.x][tile.y];
  return tile;
}

export function moveCart(cart: Cart, nextTile: Tile, track: string[][]): void {
  if (cart.cartSymbol === 'X') {
    return;
  }
  switch (nextTile.trackSymbol) {
    case '/':
      if (cart.cartSymbol === 'v') {
        cart.cartSymbol = '<';
      } else if (cart.cartSymbol === '>') {
        cart.cartSymbol = '^';
      } else if (cart.cartSymbol === '<') {
        cart.cartSymbol = 'v';
      } else {
        cart.cartSymbol = '>';
      }
      break;
    case '-':
      cart.cartSymbol = cart.cartSymbol === '<' ? '<' : '>';
      break;
    case '\\':
      if (cart.cartSymbol === 'v') {
        cart.cartSymbol = '>';
      } else if (cart.cartSymbol === '>') {
        cart.cartSymbol = 'v';
      } else if (cart.cartSymbol === '<') {
        cart.cartSymbol = '^';
      } else {
        cart.cartSymbol = '<';
      }
      break;
    case '|':
      cart.cartSymbol = cart.cartSymbol === '^' ? '^' : 'v';
      break;
    case '+':
      const nextDirection = cart.directions.shift()!;
      cart.directions.push(nextDirection);
      if (nextDirection === Directons.LEFT) {
        if (cart.cartSymbol === '^') {
          cart.cartSymbol = '<';
        } else if (cart.cartSymbol === 'v') {
          cart.cartSymbol = '>';
        } else if (cart.cartSymbol === '<') {
          cart.cartSymbol = 'v';
        } else {
          cart.cartSymbol = '^';
        }
      } else if (nextDirection === Directons.RIGHT) {
        if (cart.cartSymbol === '^') {
          cart.cartSymbol = '>';
        } else if (cart.cartSymbol === 'v') {
          cart.cartSymbol = '<';
        } else if (cart.cartSymbol === '<') {
          cart.cartSymbol = '^';
        } else {
          cart.cartSymbol = 'v';
        }
      }
      break;
    case '<':
    case '>':
    case 'v':
    case '^':
      cart.cartSymbol = 'X';
      break;
    default:
      break;
  }
  track[cart.x][cart.y] = cart.trackSymbol;
  track[nextTile.x][nextTile.y] = cart.cartSymbol;
  cart.x = nextTile.x;
  cart.y = nextTile.y;
  cart.trackSymbol = nextTile.trackSymbol;
}