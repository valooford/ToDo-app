import './index.css';

let b = 3;

const funcAdd = (a) => {
  b += a;
  return b;
};

// eslint-disable-next-line no-console
console.log(funcAdd(3));

function* aFunc() {
  yield 1;
}

const it = aFunc();

// eslint-disable-next-line no-console
console.log(it.next());
