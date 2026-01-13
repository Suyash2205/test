import { useEffect, useState } from "react";

export default function App() {
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(15);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({});
  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, [level]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          nextLevel(false);
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function generateQuestion() {
    const ops = ["+", "-", "*", "/"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === "+") { a = rand(10, 99); b = rand(10, 99); ans = a + b; }
    if (op === "-") { a = rand(50, 99); b = rand(1, 40); ans = a - b; }
    if (op === "*") { a = rand(2, 12); b = rand(2, 10); ans = a * b; }
    if (op === "/") { ans = rand(2, 10); b = rand(2, 10); a = ans * b; }

    const wrong = ans + rand(-10, 10);
    const opts = shuffle([ans, wrong]);

    setQuestion({ text: `${a} ${op} ${b}`, answer: ans });
    setOptions(opts);
  }

  function nextLevel(correct) {
    if (correct) {
      setScore(s => s + 10);
      setProgress(p => Math.min(100, p + 10));
    }
    setLevel(l => l + 1);
    setTime(15);
    generateQuestion();
  }

  return (
    <div className="game">
      <div className="top-bar">
        <div className="rank">1st</div>
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="timer">{time}s</div>
        <div className="coins">🪙 {score}</div>
      </div>

      <div className="card">
        <div className="level">Level {level}</div>
        <div className="question">{question.text}</div>
      </div>

      <div className="options">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => nextLevel(opt === question.answer)}
            className="option-btn"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
