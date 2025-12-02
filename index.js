const express = require("express");
const app = express();
const path = require("path");

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public 폴더 제공
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────────
// 1) 문제 리스트 (원하면 여기만 수정하면 됨)
// ─────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: "2 + 2 = ?",
    answer: "4",
    explanation: "기본적인 덧셈 문제입니다. 2와 2를 더하면 4입니다."
  },
  {
    id: 2,
    question: "3 × 5 = ?",
    answer: "15",
    explanation: "3을 5번 더한 값이므로 3×5 = 15 입니다."
  },
  {
    id: 3,
    question: "10 - 7 = ?",
    answer: "3",
    explanation: "10에서 7을 빼면 3이 남습니다."
  },
  {
    id: 4,
    question: "사회복지사 1급 시험 과목 수는? (숫자만)",
    answer: "8",
    explanation: "현재 기준으로 8과목으로 구성되어 있습니다."
  }
];

// 특정 ID로 문제 찾기
function findQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id);
}

// ─────────────────────────────
// 2) 랜덤 문제 보내는 API
// ─────────────────────────────
app.get("/api/question", (req, res) => {
  const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
  const q = QUESTIONS[randomIndex];

  // 정답은 보내지 않고, id와 문제만 보냄
  res.json({
    id: q.id,
    question: q.question
  });
});

// ─────────────────────────────
// 3) 정답 체크 API
// ─────────────────────────────
app.post("/api/check-answer", (req, res) => {
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    return res.json({
      correct: false,
      feedback: "문제나 정답이 제대로 전달되지 않았어요."
    });
  }

  const q = findQuestionById(Number(questionId));
  if (!q) {
    return res.json({
      correct: false,
      feedback: "해당 문제를 찾을 수 없습니다."
    });
  }

  // 문자열 비교: 앞뒤 공백 제거 + 소문자로 비교
  const user = String(answer).trim().toLowerCase();
  const correct = String(q.answer).trim().toLowerCase();

  if (user === correct) {
    return res.json({
      correct: true,
      feedback: `정답입니다! 👍\n\n해설: ${q.explanation}`
    });
  } else {
    return res.json({
      correct: false,
      feedback: `아쉽네요! ❌\n\n정답: ${q.answer}\n해설: ${q.explanation}`
    });
  }
});

// ─────────────────────────────
// 4) 기본 페이지
// ─────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─────────────────────────────
// 5) 서버 실행
// ─────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
