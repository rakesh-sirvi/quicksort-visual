const container = document.getElementById("container");
const delay_input = document.getElementById("delay");
const qty_input = document.getElementById("qty");

let array = Array.from({ length: qty_input.value }, (_, idx) => idx);

let process = false;

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

shuffle(array);

let delay = delay_input.value / 10;

delay_input.addEventListener("input", (e) => (delay = e.target.value / 10));

qty_input.addEventListener("change", (e) => {
  array = Array.from({ length: e.target.value }, (_, idx) => idx);
  shuffle(array);
  display();
});

function display() {
  container.innerHTML = "";
  array.forEach((val) => {
    const point = document.createElement("div");
    const span = document.createElement("span");
    point.className = "point";
    point.style.width = `${container.offsetWidth / array.length}px`;
    point.style.height = `${val * (container.offsetHeight / array.length)}px`;
    point.setAttribute("data-value", val);
    span.style.backgroundColor = `hsl(${(val + 1) % 360},100%,50%)`;
    span.className = "dot";
    point.appendChild(span);
    container.appendChild(point);
  });
}

display();

function swap(nodeA, nodeB) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parentA = nodeA.parentNode;
      const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
      nodeB.parentNode.insertBefore(nodeA, nodeB);
      parentA.insertBefore(nodeB, siblingA);
      resolve();
    }, delay);
  });
}

async function partition(left, right) {
  let items = document.querySelectorAll("#container > .point");
  let pivot = items[right];
  let i = left - 1;
  for (let j = left; j <= right; j++) {
    if (!process) return;
    if (
      parseInt(items[j].getAttribute("data-value")) <
      parseInt(pivot.getAttribute("data-value"))
    ) {
      i++;
      await swap(items[i], items[j]);
      items = document.querySelectorAll("#container > .point");
    }
  }
  await swap(items[i + 1], items[right]);
  return i + 1;
}

async function quickSort(left, right) {
  if (!process) return;
  if (left < right) {
    let pi = await partition(left, right);
    await quickSort(left, pi - 1);
    await quickSort(pi + 1, right);
  }
}

document.getElementById("start").addEventListener("click", async (e) => {
  e.target.setAttribute("disabled", "");
  qty_input.setAttribute("disabled", "");
  process = true;
  await quickSort(
    0,
    document.querySelectorAll("#container > .point").length - 1
  );
  process = false;
  e.target.removeAttribute("disabled");
  qty_input.removeAttribute("disabled")
});

document.getElementById("stop").addEventListener("click", () => {
  process = false;
});
