const frame4x4 = JSON.parse(localStorage.getItem('frame')) || [
  ['#00BCD4', '#FFEB3B', '#FFEB3B', '#00BCD4'],
  ['#FFEB3B', '#FFC107', '#FFC107', '#FFEB3B'],
  ['#FFEB3B', '#FFC107', '#FFC107', '#FFEB3B'],
  ['#00BCD4', '#FFEB3B', '#FFEB3B', '#00BCD4'],
];

const canvas = document.getElementById('canvas');

if (canvas.getContext) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frame4x4.forEach((row, i) => {
    row.forEach((column, j) => {
      ctx.fillStyle = `${column}`;
      ctx.fillRect(j * 128, i * 128, 128, 128);
    });
  });
}


const bucket = document.getElementById('bucket');
const chooseColor = document.getElementById('choose_color');
const pencil = document.getElementById('pencil');
pencil.classList.add('active');

const currColorInput = document.getElementById('curr-icon-input');
const currColor = document.querySelector('.curr-icon');
currColor.style.backgroundColor = '#01d53c';
const prewColor = document.querySelector('.prev-icon');
const redColor = document.querySelector('.red-icon');
const blueColor = document.querySelector('.blue-icon');

function activeButtonClick(button) {
  if (button.classList.contains('active')) {
    button.classList.remove('active');
    return;
  }
  button.classList.add('active');
}

function activeButtonKeyboard(element) {
  if (element.classList.contains('active')) {
    element.classList.remove('active');
    return;
  }
  element.classList.add('active');
}

function calcRowAndColumn(coordinates) {
  let currPosition;
  if (coordinates > 0 && coordinates < 128) {
    currPosition = 0;
  }
  if (coordinates > 128 && coordinates < 256) {
    currPosition = 1;
  }
  if (coordinates > 256 && coordinates < 384) {
    currPosition = 2;
  }
  if (coordinates > 384 && coordinates < 512) {
    currPosition = 3;
  }
  return currPosition;
}

function selectPixel(coordinates, placeInCanvas) {
  let currCanvasPlace;
  if (coordinates > 0 && coordinates < 128) {
    [currCanvasPlace] = placeInCanvas;
  }
  if (coordinates > 128 && coordinates < 256) {
    [, currCanvasPlace] = placeInCanvas;
  }
  if (coordinates > 256 && coordinates < 384) {
    [,, currCanvasPlace] = placeInCanvas;
  }
  if (coordinates > 384 && coordinates < 512) {
    [,,, currCanvasPlace] = placeInCanvas;
  }
  return currCanvasPlace;
}

// Handler for click on Current color circle in the "color section"
currColorInput.addEventListener('change', () => {
  currColor.style.backgroundColor = `${currColorInput.value}`;
});


document.addEventListener('click', (event) => {
// Canvas bucket and pencil handlers
  if (event.target === canvas) {
    const coorX = event.offsetX;
    const coorY = event.offsetY;
    let currCanvasColorRow = 0;
    let currCanvasColorColumn = 0;

    currCanvasColorRow = calcRowAndColumn(coorY);
    currCanvasColorColumn = calcRowAndColumn(coorX);

    if (bucket.classList.contains('active')) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame4x4.forEach((row, i) => {
        row.forEach((column, j) => {
          ctx.fillStyle = `${currColor.style.backgroundColor}`;
          frame4x4[i][j] = `${currColor.style.backgroundColor}`;
          ctx.fillRect(j * 128, i * 128, 128, 128);
        });
      });
      localStorage.setItem('frame', JSON.stringify(frame4x4));
    }

    if (pencil.classList.contains('active')) {
      frame4x4[currCanvasColorRow][currCanvasColorColumn] = `${currColor.style.backgroundColor}`;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame4x4.forEach((row, i) => {
        row.forEach((column, j) => {
          ctx.fillStyle = `${column}`;
          ctx.fillRect(j * 128, i * 128, 128, 128);
        });
      });
      localStorage.setItem('frame', JSON.stringify(frame4x4));
    }
  }

  // Handlers for clicks on buttons
  if (event.target.closest('#bucket') === bucket) {
    activeButtonClick(bucket);
  }
  if (event.target.closest('#choose_color') === chooseColor) {
    activeButtonClick(chooseColor);
  }
  if (event.target.closest('#pencil') === pencil) {
    activeButtonClick(pencil);
  }

  // Handlers for clicks on circles in the "color section"
  if (event.target.closest('.curr-icon') === currColor) {
    prewColor.style.backgroundColor = `${getComputedStyle(currColor).backgroundColor}`;
    currColorInput.click();
  }
  if (event.target.closest('.prev-icon') === prewColor) {
    currColor.style.backgroundColor = `${getComputedStyle(prewColor).backgroundColor}`;
  }
  if (event.target.closest('.red-icon') === redColor) {
    currColor.style.backgroundColor = `${getComputedStyle(redColor).backgroundColor}`;
  }
  if (event.target.closest('.blue-icon') === blueColor) {
    currColor.style.backgroundColor = `${getComputedStyle(blueColor).backgroundColor}`;
  }

  // Canvas handlers for choose color
  if (chooseColor.classList.contains('active')) {
    if (event.target !== canvas) {
      currColor.style.backgroundColor = `${getComputedStyle(event.target).backgroundColor}`;
      return;
    }
    const coorX = event.offsetX;
    const coorY = event.offsetY;

    const currCanvasColor = selectPixel(coorX, selectPixel(coorY, frame4x4));

    currColor.style.backgroundColor = currCanvasColor;
  }
});

// Keyboard event handlers
document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyB') {
    activeButtonKeyboard(bucket);
  }
  if (event.code === 'KeyP') {
    activeButtonKeyboard(pencil);
  }
  if (event.code === 'KeyC') {
    activeButtonKeyboard(chooseColor);
  }
});
