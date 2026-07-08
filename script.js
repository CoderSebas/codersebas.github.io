const profile = {
  unknown:
    "这个我现在还不确定，不想替王帅乱说。你可以通过 GitHub、LinkedIn 或邮箱联系他进一步确认。",
  current:
    "我最近主要在两条线上推进。一条是准备秋招，同时做 AI 应用开发方向的项目，比如刚完成的 MiniClaudeCode / AI Agent 项目；另一条是继续推进硕士论文，包括已经投稿的 AdaMoE-Tiny，以及正在写的 ECG Transformer 端侧部署优化工作。",
  works:
    "目前可以聊的作品主要有 MiniClaudeCode / AI Agent 项目、AdaMoE-Tiny，以及 ECG Transformer 端侧部署优化相关工作。后面我也计划继续推进 AI 应用开发项目。更具体的细节如果页面里没写，我就不展开编了。",
  contact:
    "可以这样联系我：GitHub 是 https://github.com/CoderSebas，LinkedIn 是 https://www.linkedin.com/in/shuai-wang-19a472374/，邮箱是 wshuai.sebas@outlook.com。",
  identity:
    "我是王帅，首都师范大学 2027 届计算机硕士。现在主要关注 AI 应用开发、AI Agent、TinyDL 和端侧 AI 推理方向。",
  strength:
    "我比较长期关注 AI 应用开发、AI Agent、TinyDL、边缘端 AI 部署和软硬件协同优化。相比只把模型训练出来，我更关心它怎么在 MCU、嵌入式设备和资源受限场景里部署、运行和落地。",
  agent:
    "我对嵌入式 AI Agent 方向挺感兴趣，想探索大模型 Agent 能力和端侧设备之间的结合。简单说，就是不只让 Agent 会对话，还希望它能和真实设备、约束环境、部署流程接起来。",
  experience:
    "我有一段中国电子科技集团第二十八研究所的实习经历，主要参与系统测试与验证、C++ 相关项目实践，包括功能测试、接口联调、问题排查、缺陷记录和验证材料输出。",
  education:
    "我的教育背景是：2024 - 2027 在首都师范大学读计算机硕士；2022 - 2024 在河南师范大学学习物联网工程。",
};

const chatWindow = document.querySelector("#chatWindow");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const quickQuestions = document.querySelectorAll("[data-question]");
const activityList = document.querySelector("#activityList");
const activityToggle = document.querySelector(".activity-toggle");

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

  if (isOffTopic(normalized)) {
    return profile.unknown;
  }

  if (includesAny(normalized, ["现在", "最近", "做什么", "忙什么", "秋招", "current"])) {
    return profile.current;
  }

  if (includesAny(normalized, ["作品", "项目", "github", "mini", "miniclaude", "adamo", "ecg", "论文", "paper"])) {
    return profile.works;
  }

  if (includesAny(normalized, ["联系", "邮箱", "邮件", "linkedin", "linkdin", "微信", "contact", "简历"])) {
    return profile.contact;
  }

  if (includesAny(normalized, ["身份", "职业", "你是谁", "介绍", "about"])) {
    return profile.identity;
  }

  if (includesAny(normalized, ["学校", "硕士", "本科", "教育", "学历", "大学"])) {
    return profile.education;
  }

  if (includesAny(normalized, ["agent", "智能体", "端侧设备", "嵌入式 agent"])) {
    return profile.agent;
  }

  if (includesAny(normalized, ["擅长", "优势", "特点", "方向", "tiny", "tinyml", "tinydl", "llm", "部署", "边缘", "嵌入式", "mcu", "软硬件"])) {
    return profile.strength;
  }

  if (includesAny(normalized, ["实习", "工作", "经历", "28", "二十八", "测试", "验证"])) {
    return profile.experience;
  }

  return profile.unknown;
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function isOffTopic(text) {
  const offTopicKeywords = ["天气", "股票", "彩票", "八卦", "新闻", "翻译", "写代码", "数学题", "帮我做作业"];
  return includesAny(text, offTopicKeywords);
}

async function askLLM(question) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  let response;

  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: question }),
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error("LLM request failed");
  }

  const data = await response.json();

  if (!data.reply) {
    throw new Error("LLM returned empty reply");
  }

  return data.reply;
}

async function submitQuestion(question) {
  if (!question.trim()) return;

  addMessage("user", question);
  chatInput.value = "";

  try {
    const reply = await askLLM(question);
    addMessage("bot", reply);
  } catch (error) {
    addMessage("bot", getReply(question));
  }
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

if (activityList && activityToggle) {
  const activityToggleLabel = activityToggle.querySelector(".activity-toggle-label");

  activityToggle.addEventListener("click", () => {
    const isExpanded = activityList.classList.toggle("is-expanded");

    activityToggle.setAttribute("aria-expanded", String(isExpanded));
    activityToggleLabel.textContent = isExpanded ? "收起" : "显示全部";
  });
}
