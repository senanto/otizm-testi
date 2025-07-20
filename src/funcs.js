const scale = {
  "Kesinlikle Katılıyorum": 4,
  "Katılıyorum": 3,
  "Nötrüm": 2,
  "Katılmıyorum": 1,
  "Kesinlikle Katılmıyorum": 0
};
let currentIndex = 0;
let answers = new Array(questions.length).fill(null);
const container = document.getElementById("question-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");

function renderQuestion(index) {
  const q = questions[index];
  container.innerHTML = `
    <h5>Soru ${index + 1} / ${questions.length}</h5>
    <p>${q.text}</p>
    <div class="answers">
      ${Object.keys(scale).map(key => `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="answer" id="answer${index}_${key}" value="${key}" ${answers[index] === key ? "checked" : ""}>
          <label class="form-check-label" for="answer${index}_${key}">${key}</label>
        </div>
      `).join("")}
    </div>
  `;

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === questions.length - 1 ? "Sonucu Göster" : "İleri →";
  resultDiv.style.display = "none";
}
function saveAnswer() {
  const checkedInput = document.querySelector('input[name="answer"]:checked');
  if(!checkedInput) return false;
  answers[currentIndex] = checkedInput.value;
  return true;
}
function calculateScore() {
  let score = 0;
  for(let i = 0; i < questions.length; i++) {
    const ans = answers[i];
    if(ans === null) return null;
    let val = scale[ans];
    if(questions[i].reverse) {
      val = 4 - val;
    }
    score += val;
  }
  return score;
}
function interpretScore(score) {
  if(score === null) return "tüm soruları cevaplayın";
  const maxScore = questions.length * 4;
  const percent = (score / maxScore) * 100;
  if(percent <= 35) {
    return "otizmli değilsin";
  } else if(percent <= 65) {
    return "belki otizmli olabilirsin";
  } else {
    return "büyük ihtimalle otizmlisin uzmana basvur bayım";
  }
}
prevBtn.addEventListener("click", () => {
  saveAnswer();
  if(currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
  }
});
nextBtn.addEventListener("click", () => {
  if(!saveAnswer()) {
    alert("cevap sec");
    return;
  }
  if(currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  } else {
    const score = calculateScore();
    if(score === null) {
      alert("tüm soruları cevaplamadın");
      return;
    }
    const interpretation = interpretScore(score);
    container.innerHTML = "";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <h4>Test Sonucu</h4>
      <p>Toplam Skorunuz: <strong>${score}</strong> / ${questions.length * 4}</p>
      <p><strong>Değerlendirme:</strong> ${interpretation}</p>
    `;
  }
});

renderQuestion(currentIndex);

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  if(document.body.classList.contains("dark-theme")) {
    toggleThemeBtn.textContent = "☀️";
  } else {
    toggleThemeBtn.textContent = "🌙";
  }
});

