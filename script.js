const PASSCODE = "090919";
const lockScreen = document.querySelector("#lockScreen");
const page = document.querySelector("#birthdayPage");
const digits = [...document.querySelectorAll(".passcode input")];
const error = document.querySelector("#lockError");

function unlock() {
  const entered = digits.map((input) => input.value).join("");
  if (entered === PASSCODE) {
    lockScreen.classList.add("is-open");
    lockScreen.setAttribute("aria-hidden", "true");
    page.classList.add("is-visible");
    page.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      document.querySelector("#birthdayTitle").focus();
    }, 500);
    return;
  }
  error.textContent = "That doesn’t look right — give it another try.";
  digits.forEach((input) => (input.value = ""));
  digits[0].focus();
}

digits.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(-1);
    error.textContent = "";
    if (input.value && digits[index + 1]) digits[index + 1].focus();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value && digits[index - 1]) digits[index - 1].focus();
    if (event.key === "Enter") unlock();
    if (event.key.length === 1 && !/\d/.test(event.key)) event.preventDefault();
  });
  input.addEventListener("paste", (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    pasted.split("").forEach((digit, i) => (digits[i].value = digit));
    digits[Math.min(pasted.length, 5)].focus();
  });
});

document.querySelector("#unlockButton").addEventListener("click", unlock);
document.querySelectorAll(".number-pad button").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key;
    if (key === "clear") {
      digits.forEach((digit) => (digit.value = ""));
      error.textContent = "";
      digits[0].focus();
      return;
    }
    if (key === "backspace") {
      const lastFilled = [...digits].reverse().find((digit) => digit.value);
      if (lastFilled) lastFilled.value = "";
      error.textContent = "";
      (lastFilled || digits[0]).focus();
      return;
    }
    const emptyDigit = digits.find((digit) => !digit.value);
    if (emptyDigit) {
      emptyDigit.value = key;
      error.textContent = "";
      const nextDigit = digits[digits.indexOf(emptyDigit) + 1];
      (nextDigit || emptyDigit).focus();
    }
  });
});
function blowCandles(event) {
  event.currentTarget.classList.add("blown");
  document.querySelector("#birthdayTitle").textContent = "Yay!! Happy Birthdayyy";
  document.querySelector("#birthdaySubtitle").textContent = "Wish granted! Today is all about you ♡";
  document.querySelector("#birthdayReveal").classList.add("revealed");
  document.querySelector("#cakeMessage").textContent = "Wish granted! Happy Birthday ♡";
  window.setTimeout(() => document.querySelector("#giftTitle").scrollIntoView({ behavior: "smooth", block: "center" }), 1200);
}

document.querySelector("#cakeButton").addEventListener("click", blowCandles);

const giftChoiceSection = document.querySelector("#giftChoiceSection");
function showGiftChoices() {
  giftChoiceSection.hidden = false;
  requestAnimationFrame(() => giftChoiceSection.classList.add("visible"));
  giftChoiceSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#yesGift").addEventListener("click", () => {
  document.querySelector("#giftTitle").textContent = "Yay! Choose your gift";
  document.querySelector("#giftPrompt").hidden = true;
  document.querySelector("#giftMessage").textContent = "Pick a little surprise ♡";
  showGiftChoices();
});
document.querySelector("#noGift").addEventListener("click", () => {
  document.querySelector("#giftTitle").textContent = "Please try again";
  document.querySelector("#giftPrompt").hidden = true;
  document.querySelector("#tryAgain").hidden = false;
  document.querySelector("#giftMessage").textContent = "You know you want to ♡";
});
document.querySelector("#tryAgain").addEventListener("click", () => {
  document.querySelector("#giftTitle").textContent = "Yay! Choose your gift";
  document.querySelector("#tryAgain").hidden = true;
  document.querySelector("#giftMessage").textContent = "Pick a little surprise ♡";
  showGiftChoices();
});

const giftDetails = {
  letter: {
    title: "A little love note",
    text: "I hope you know how much happiness you bring into my life. Thank you for every laugh, every little adventure, and for being exactly who you are. I love you more than words can say. ♡",
  },
  flowers: {
    title: "Some flowers for you!!",
    text: "A bouquet for the person who makes ordinary days feel a little more beautiful. Sending you the biggest hug and all my love. 💐",
  },
};

document.querySelectorAll(".gift-option").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.gift === "photos") {
      document.querySelector("#memoryTitle").scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector("#birthdayPage").classList.add("album-open");
      return;
    }
    const detail = giftDetails[button.dataset.gift];
    document.querySelector("#giftDetailTitle").textContent = detail.title;
    document.querySelector("#giftDetailText").textContent = detail.text;
    const panel = document.querySelector("#giftDetail");
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("visible"));
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
document.querySelector("#closeGiftDetail").addEventListener("click", () => {
  const panel = document.querySelector("#giftDetail");
  panel.classList.remove("visible");
  window.setTimeout(() => (panel.hidden = true), 250);
});
