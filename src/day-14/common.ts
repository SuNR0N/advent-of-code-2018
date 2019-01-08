export interface Board {
  recipes: number[],
  firstIndex: number,
  secondIndex: number,
}

export function createRecipes(board: Board): Board {
  const {
    firstIndex,
    recipes,
    secondIndex,
  } = board;
  const sum = recipes[firstIndex] + recipes[secondIndex];
  recipes.push(
    ...`${sum}`
      .split('')
      .map(Number)
  );
  const len = recipes.length;
  const newFirstIndex = (1 + recipes[firstIndex] + firstIndex) % len;
  const newSecondIndex = (1 + recipes[secondIndex] + secondIndex) % len;
  return {
    firstIndex: newFirstIndex,
    recipes,
    secondIndex: newSecondIndex,
  };
}