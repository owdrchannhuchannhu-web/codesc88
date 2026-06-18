const historyList = document.getElementById("historyList");

const openUsernameBtn = document.getElementById("openUsernameBtn");
const usernameModal = document.getElementById("usernameModal");
const closeUsernameModal = document.getElementById("closeUsernameModal");
const usernameInput = document.getElementById("usernameInput");
const confirmUsernameBtn = document.getElementById("confirmUsernameBtn");

const codeModal = document.getElementById("codeModal");
const closeCodeModal = document.getElementById("closeCodeModal");
const codeInput = document.getElementById("codeInput");
const confirmCodeBtn = document.getElementById("confirmCodeBtn");

const rewardModal = document.getElementById("rewardModal");
const closeRewardModal = document.getElementById("closeRewardModal");
const rewardPoints = document.getElementById("rewardPoints");
const txUsername = document.getElementById("txUsername");
const txCode = document.getElementById("txCode");
const txTime = document.getElementById("txTime");

const donateFab = document.getElementById("donateFab");
const donateModal = document.getElementById("donateModal");
const closeDonateModal = document.getElementById("closeDonateModal");

const rewardCards = Array.from(document.querySelectorAll(".reward-card"));

const REWARD_VALUES = [18, 28, 88, 188, 528];
const AUTO_CODE_DELAY = 2000;

const namePool = [
  "chanhnu",
  "minhtrang",
  "tuanpham",
  "ngocanh",
  "linhchi",
  "hoangvu",
  "kimngan",
  "quanghuy",
  "thanhdat",
  "thuylinh",
  "phuongvy",
  "myduyen",
  "trungkien",
  "anhthu",
  "dangkhoa",
  "haianh",
  "phamkhanh",
  "yennhi",
  "ductri",
  "maianh",
  "boday888",
  "tuoilondanhvai",
  "codonlaanh",
  "anhoiemday",
  "maylaconcho"
];

const timeOffsets = [3, 5, 8, 12, 16, 22, 35, 48, 65, 90, 120];

const state = {
  history: [],
  username: "",
  selectedCard: null,
  autoCodeTimer: null,
  typeInterval: null,
  tickerTimer: null,
  tickerRunning: false
};

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDateTime(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
}

function getDateBeforeSeconds(seconds) {
  return new Date(Date.now() - seconds * 1000);
}

function randomUsername() {
  const base = randomFrom(namePool);
  const suffixType = randomInt(1, 3);

  if (suffixType === 1) {
    return `${base}${randomInt(10, 999)}`;
  }

  if (suffixType === 2) {
    return `${base}_${randomInt(10, 99)}`;
  }

  return `${base}${randomInt(1990, 2005)}`;
}

function maskUsernameRealistic(username) {
  const value = String(username).trim();

  if (value.length <= 4) {
    return `${value}****`;
  }

  const visible = Math.min(8, Math.max(4, Math.floor(value.length * 0.7)));
  return `${value.slice(0, visible)}*****`;
}

function generateRewardNumber() {
  const base = randomFrom(REWARD_VALUES);
  return base;
}

function generateRewardNumberFromSetOnly() {
  return randomFrom(REWARD_VALUES);
}

function generateHistoryReward() {
  const base = generateRewardNumberFromSetOnly();
  return base ;
}

function generatePromoCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < 10; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

function generateTransactionCode() {
  return window.randomTxCode();
}

function randomHistoryItem(index = 0) {
  const secondsAgo = timeOffsets[index] || randomInt(4, 180);
  const username = randomUsername();

  return {
    time: formatDateTime(getDateBeforeSeconds(secondsAgo)),
    points: generateHistoryReward(),
    username: maskUsernameRealistic(username)
  };
}

function buildInitialHistory() {
  const items = [];

  for (let i = 0; i < 9; i += 1) {
    items.push(randomHistoryItem(i));
  }

  return items;
}

function renderHistory() {
  const trackHtml = state.history
    .map((item) => {
      return `
        <article class="history-item">
          <div class="history-item__top">
            <span>${window.escapeHtml(item.time)}</span>
            <span class="history-item__user">${window.escapeHtml(item.username)}</span>
          </div>
          <div class="history-item__points">
            +${window.escapeHtml(window.formatNumberVi(item.points))} điểm thưởng
          </div>
        </article>
      `;
    })
    .join("");

  historyList.innerHTML = `<div class="winners-panel__track">${trackHtml}</div>`;
}

function animateNewHistoryItem() {
  const track = historyList.querySelector(".winners-panel__track");
  const firstItem = track ? track.querySelector(".history-item") : null;

  if (!track || !firstItem) {
    return;
  }

  const itemHeight = firstItem.offsetHeight;

  track.style.transition = "none";
  track.style.transform = `translateY(-${itemHeight}px)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      track.style.transition = "transform 0.6s ease";
      track.style.transform = "translateY(0)";
    });
  });

  window.setTimeout(() => {
    track.style.transition = "";
    track.style.transform = "";
  }, 700);
}

function prependRandomHistory() {
  state.history.unshift(randomHistoryItem());

  if (state.history.length > 9) {
    state.history.pop();
  }

  renderHistory();
  animateNewHistoryItem();
}

function queueNextTicker() {
  if (!state.tickerRunning) {
    return;
  }

  const delay = randomInt(1800, 3200);

  state.tickerTimer = window.setTimeout(() => {
    prependRandomHistory();
    queueNextTicker();
  }, delay);
}

function startHistoryTicker() {
  stopHistoryTicker();
  state.tickerRunning = true;
  queueNextTicker();
}

function stopHistoryTicker() {
  state.tickerRunning = false;

  if (state.tickerTimer) {
    window.clearTimeout(state.tickerTimer);
    state.tickerTimer = null;
  }
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function resetActiveCards() {
  rewardCards.forEach((card) => {
    card.classList.remove("is-active");
  });
}

function clearAutoCodeTimer() {
  if (state.autoCodeTimer) {
    window.clearTimeout(state.autoCodeTimer);
    state.autoCodeTimer = null;
  }
}

function clearTypingInterval() {
  if (state.typeInterval) {
    window.clearInterval(state.typeInterval);
    state.typeInterval = null;
  }
}

function clearCodeAutomation() {
  clearAutoCodeTimer();
  clearTypingInterval();
}

function typeTextToInput(input, text, minSpeed = 45, maxSpeed = 95) {
  clearTypingInterval();
  input.value = "";

  let index = 0;

  function typeNext() {
    if (index >= text.length) {
      state.typeInterval = null;
      return;
    }

    input.value += text[index];
    index += 1;

    const nextDelay = randomInt(minSpeed, maxSpeed);

    state.typeInterval = window.setTimeout(typeNext, nextDelay);
  }

  typeNext();
}

function openUsernameStep() {
  clearCodeAutomation();
  closeModal(codeModal);
  closeModal(rewardModal);
  openModal(usernameModal);
  usernameInput.focus();
  usernameInput.select();
}

function openCodeStep() {
  if (!usernameInput.value.trim()) {
    alert("Vui lòng nhập tên tài khoản.");
    return;
  }

  state.username = usernameInput.value.trim();
  closeModal(usernameModal);
  openModal(codeModal);

  codeInput.value = "";
  codeInput.focus();

  clearCodeAutomation();

  state.autoCodeTimer = window.setTimeout(() => {
    const generatedCode = generatePromoCode();
    typeTextToInput(codeInput, generatedCode);
  }, AUTO_CODE_DELAY);
}

function submitReward() {
  const code = codeInput.value.trim();

  if (!code) {
    alert("Vui lòng nhập mã code.");
    return;
  }

  clearCodeAutomation();

  const rewardValue = generateRewardNumber();
  const transactionCode = generateTransactionCode();
  const now = new Date();
  const time = formatDateTime(now);

  rewardPoints.textContent = window.formatNumberVi(rewardValue);
  txUsername.textContent = state.username;
  txCode.textContent = transactionCode;
  txTime.textContent = time;

  state.history.unshift({
    time,
    points: rewardValue,
    username: maskUsernameRealistic(state.username)
  });

  if (state.history.length > 9) {
    state.history.pop();
  }

  renderHistory();

  closeModal(codeModal);
  openModal(rewardModal);

  codeInput.value = "";
  usernameInput.value = "";
}

function closeAllPrimaryModals() {
  clearCodeAutomation();
  closeModal(usernameModal);
  closeModal(codeModal);
  closeModal(rewardModal);
}

openUsernameBtn.addEventListener("click", () => {
  state.selectedCard = null;
  resetActiveCards();
  openUsernameStep();
});

rewardCards.forEach((card) => {
  card.addEventListener("click", () => {
    resetActiveCards();
    card.classList.add("is-active");
    state.selectedCard = card.dataset.index;
    openUsernameStep();
  });
});

closeUsernameModal.addEventListener("click", () => closeModal(usernameModal));

closeCodeModal.addEventListener("click", () => {
  clearCodeAutomation();
  closeModal(codeModal);
});

closeRewardModal.addEventListener("click", () => {
  closeModal(rewardModal);
});

confirmUsernameBtn.addEventListener("click", openCodeStep);
confirmCodeBtn.addEventListener("click", submitReward);

donateFab.addEventListener("click", () => {
  openModal(donateModal);
});

closeDonateModal.addEventListener("click", () => {
  closeModal(donateModal);
});

[usernameModal, codeModal, rewardModal, donateModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal__overlay")) {
      if (modal === codeModal) {
        clearCodeAutomation();
      }

      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllPrimaryModals();
    closeModal(donateModal);
  }
});

state.history = buildInitialHistory();
renderHistory();
startHistoryTicker();
