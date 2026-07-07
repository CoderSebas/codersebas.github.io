const profile = {
  current:
    "王帅最近主要在两条线上推进：一边准备秋招，继续做 AI 应用开发方向的项目，比如刚完成的 MiniClaudeCode；另一边也在推进论文相关工作，包括 AdaMoE-Tiny 和 ECG Transformer 端侧部署优化。",
  works:
    "目前比较值得聊的是 MiniClaudeCode、AdaMoE-Tiny、ECG Transformer 端侧部署优化，还有接下来计划推进的 AI 应用开发项目。他比较喜欢把 LLM 应用和端侧智能结合起来，做成能跑、能用、能继续迭代的东西。",
  contact:
    "可以通过这些方式联系王帅：GitHub 是 https://github.com/CoderSebas，LinkedIn 是 https://www.linkedin.com/in/shuai-wang-19a472374/，邮箱是 wshuai.sebas@outlook.com。",
  identity:
    "王帅是首都师范大学 2027 届计算机硕士，关注 AI Agent、LLM 应用开发、嵌入式 AI / TinyDL，以及边缘端 AI 部署。本科阶段就读于河南师范大学物联网工程专业。",
  strength:
    "王帅比较有记忆点的定位是：软硬协同型 AI 开发者。他熟悉 C/C++、Python、Linux、STM32、PyTorch、TensorFlow、TFLM、X-Cube-AI 和 CMSIS-NN，也关注真实设备上的资源、时延、部署和验证。",
  experience:
    "王帅曾在中国电子科技集团第二十八研究所参与系统测试与验证 / C++ 相关项目实践，做过功能测试、接口联调、问题排查、缺陷记录和验证材料输出。",
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

  if (includesAny(normalized, ["实习", "工作", "经历", "28", "二十八", "测试", "验证"])) {
    return profile.experience;
  }

  return "这个问题我还可以继续补充。你也可以先问几个常见问题：王帅最近在做什么？有哪些项目？怎么联系他？";
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
