
const removeClass = () => {
  const allBtn = document.querySelectorAll(".lesson-btn");
  allBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
};


const displayLevelWords = (words) => {
  const cardContainer = document.getElementById("wordCardContainer");
  cardContainer.innerHTML = "";


  if (words.length === 0) {
    cardContainer.innerHTML = `
      <div class="w-full px-4 py-16 my-10 bg-gray-100 col-span-full rounded-2xl">
        <div class="max-w-3xl mx-auto text-center">
          <img class="mx-auto mb-10" src="./assets/alert-error.png" alt="">
          <p class="mb-4 text-sm text-gray-500 md:text-base">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="text-3xl font-bold text-gray-800 md:text-5xl">
            নেক্সট <span class="text-blue-500">Lesson</span> এ যান
          </h2>
        </div>
      </div>
    `;
    return;
  }

  words.forEach((word) => {
    const divForCard = document.createElement("div");
    divForCard.innerHTML = `
      <div class="bg-white border border-blue-500 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between h-full">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-800 mb-3">
            ${word.word ? word.word : "Not Defined"}
          </h3>
          <p class="text-sm text-gray-500 mb-2">Meaning / Pronunciation</p>
          <h3 class="text-lg md:text-xl font-semibold text-blue-600 break-words">
            ${word.meaning ? word.meaning : "Not Defined"} / ${word.pronunciation ? word.pronunciation : "Not Defined"}
          </h3>
        </div>

        <div class="flex items-center justify-between mt-8">
          <button
            onclick="lodwordinfo(${word.id})"
            class="w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-500 hover:text-white transition duration-300 flex items-center justify-center"
          >
            <i class="fa-solid fa-circle-info text-lg"></i>
          </button>

          <button
            onclick="pronounceWord('${word.word}')"
            class="w-12 h-12 rounded-full bg-green-100 hover:bg-green-500 hover:text-white transition duration-300 flex items-center justify-center"
          >
            <i class="fa-solid fa-volume-high text-lg"></i>
          </button>
        </div>
      </div>
    `;
    cardContainer.appendChild(divForCard);
  });
};


const loddinLessonWords = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`; // ✅ backtick fix

  fetch(url)
    .then((ref) => ref.json())
    .then((lessonWords) => {
      removeClass();
      const clickBtn = document.getElementById(`lesson-btn-${id}`); // ✅ backtick fix
      clickBtn.classList.add("active");
      displayLevelWords(lessonWords.data);
    });
};


const lodwordinfo = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`; // ✅ backtick fix

  const res = await fetch(url);
  const data = await res.json();

  displayWordDeities(data.data);
};


const displayWordDeities = (word) => {
  const infoContainer = document.getElementById("info-container");

  infoContainer.innerHTML = `
    <div class="modal-box">
      <h2 class="text-3xl font-bold mb-5">
        ${word.word} (${word.pronunciation || "Not Found"})
      </h2>

      <h3 class="font-bold">Meaning</h3>
      <p class="mb-4">${word.meaning || "Not Found"}</p>

      <h3 class="font-bold">Example</h3>
      <p class="mb-4">${word.sentence || "No Example"}</p>

      <h3 class="font-bold mb-2">Synonyms</h3>
      <div class="flex flex-wrap gap-2">
        ${
          word.synonyms
            ? word.synonyms.map((item) => `<span class="badge">${item}</span>`).join("") // ✅ backtick fix
            : "No Synonyms"
        }
      </div>

      <div class="mt-6">
        <form method="dialog">
          <button class="btn btn-primary">Complete Learning</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("word_moral").showModal();
};


const lodeLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((ref) => ref.json())
    .then((data) => displayLesson(data.data));

  const displayLesson = (lessons) => {
    const lessonContainer = document.getElementById("button-container");
    lessonContainer.innerHTML = "";

    lessons.forEach((lesson) => {
      const divForBtn = document.createElement("div");
      divForBtn.innerHTML = `
        <button
          id="lesson-btn-${lesson.level_no}"
          onclick="loddinLessonWords(${lesson.level_no})"
          class="btn btn-soft btn-primary lesson-btn"
        >
          <i class="fa-solid fa-book-open" style="color: rgb(30, 48, 80)"></i>
          Lesson- ${lesson.level_no}
        </button>
      `; // ✅ backtick fix
      lessonContainer.appendChild(divForBtn);
    });
  };
};

lodeLesson();


const pronounceWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
};


document.getElementById("loginForm").addEventListener("submit", function (e) {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (!username.checkValidity() || !password.checkValidity()) {
    e.preventDefault();
    username.reportValidity();
    if (username.checkValidity()) {
      password.reportValidity();
    }
  }
});


document.getElementById("search-btn").addEventListener("click", () => {
  removeClass();

  const input = document.getElementById("input-search");
  const inputValue = input.value.trim().toLocaleLowerCase();

  const url = "https://openapi.programming-hero.com/api/words/all";
  fetch(url)
    .then((ref) => ref.json())
    .then((data) => {
      const allWords = data.data;
      const filterWord = allWords.filter((word) =>
        word.word.toLocaleLowerCase().includes(inputValue)
      );
      displayLevelWords(filterWord); 
    });
});