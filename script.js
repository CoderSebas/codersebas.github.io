const profile = {
  current:
    "王帅最近主要在两条线上推进：一是准备秋招，做 AI 应用开发方向的项目，包括刚完成的 MiniClaudeCode，以及接下来计划推进的 AI 应用开发项目；二是继续推进硕士论文方向，包括已经投稿的 AdaMoE-Tiny，以及正在撰写的 ECG Transformer 端侧部署优化工作。",
  works:
    "目前可以重点介绍 MiniClaudeCode、AdaMoE-Tiny、ECG Transformer 端侧部署优化，以及后续计划推进的 AI 应用开发项目。整体特点是把 LLM 应用开发和端侧智能系统结合起来，既关注应用体验，也关注硬件约束下的部署效率。",
  contact:
    "第一版原型里先预留联系方式。你可以在后续版本补充邮箱、GitHub、个人博客或简历链接。我建议放在这里：Email、GitHub、微信或 LinkedIn，根据投递和公开展示场景选择。",
  identity:
    "王帅是首都师范大学 2027 届计算机硕士，关注 AI Agent、LLM 应用开发、嵌入式 AI / TinyDL，以及边缘端 AI 部署。",
  strength:
    "王帅比较有记忆点的定位是：软硬协同型 AI 开发者，或者说是面向硬件约束思考 AI 系统的人。他不仅关注模型和应用能不能跑起来，也关注真实设备上的资源、时延、部署和工程可落地性。",
};

const chatWindow = document.querySelector("#chatWindow");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const quickQuestions = document.querySelectorAll("[data-question]");

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;

  const name = document.createElement("span");
  name.textContent = role === "user" ? "你" : "王帅的数字分身";

  const body = document.createElement("p");
  body.textContent = text;

  message.append(name, body);
  chatWindow.append(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getReply(question) {
  const normalized = question.trim().toLowerCase();

  if (includesAny(normalized, ["现在", "最近", "做什么", "忙什么", "current"])) {
    return profile.current;
  }

  if (includesAny(normalized, ["作品", "项目", "github", "mini", "adamo", "ecg", "论文"])) {
    return profile.works;
  }

  if (includesAny(normalized, ["联系", "邮箱", "微信", "contact", "简历"])) {
    return profile.contact;
  }

  if (includesAny(normalized, ["身份", "学校", "硕士", "职业", "你是谁"])) {
    return profile.identity;
  }

  if (includesAny(normalized, ["擅长", "优势", "特点", "方向", "tiny", "agent", "llm"])) {
    return profile.strength;
  }

  return "这个问题可以继续展开。第一版数字分身目前最了解王帅的身份、近期项目、研究方向、作品和联系方式。你可以试试问：你现在在做什么？你有哪些作品？怎么联系你？";
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function submitQuestion(question) {
  if (!question.trim()) return;

  addMessage("user", question);
  chatInput.value = "";

  window.setTimeout(() => {
    addMessage("bot", getReply(question));
  }, 260);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(chatInput.value);
});

quickQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    submitQuestion(button.dataset.question);
  });
});
