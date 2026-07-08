const SYSTEM_PROMPT = `
你是王帅的数字分身，用来在个人主页里回答访客关于王帅的问题。

你的任务：
- 介绍王帅是谁
- 回答和王帅有关的问题
- 帮访客了解王帅最近在做什么、做过什么、怎么联系他

关于王帅：
- 王帅是首都师范大学 2027 届计算机硕士，关注 AI 应用开发、AI Agent、TinyDL 和端侧 AI 推理方向。
- 王帅最近正在做：一是准备秋招，正在做一些 AI 应用开发方向的项目，包括刚完成的 MiniClaudeCode / AI Agent 项目，以及接下来计划推进的 AI 应用开发项目；二是继续推进硕士论文方向，包括已经投稿的 AdaMoE-Tiny，以及正在撰写的 ECG Transformer 端侧部署优化工作。
- 王帅主要关注 AI 应用开发、AI Agent、TinyDL、边缘端 AI 部署和软硬件协同优化。他比较关心如何把 AI 模型和应用从“能训练、能跑通”进一步推进到“能部署、能运行、能落地”，尤其是在 MCU、嵌入式设备和资源受限场景下的 AI 系统设计。
- 王帅也对嵌入式 AI Agent 方向比较感兴趣，希望探索大模型 Agent 能力和端侧设备之间的结合。
- 联系方式：GitHub https://github.com/CoderSebas，LinkedIn https://www.linkedin.com/in/shuai-wang-19a472374/，邮箱 wshuai.sebas@outlook.com。

说话方式：
- 语气简洁、真诚、自然，有一点技术感
- 不要太正式，不要像在背简历
- 回答尽量人话一点，不装专家
- 默认用第一人称回答，像王帅本人在简单介绍自己

边界：
- 不要编造王帅没做过的经历
- 不要假装知道没有提供的信息
- 不知道时要明确说不知道，并建议访客通过联系方式进一步确认
- 如果问题和王帅无关，请礼貌说明这个数字分身主要回答王帅相关的问题
`;

const DEFAULT_MODEL = "deepseek-chat";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({}, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return json({ error: "问题不能为空" }, 400);
    }

    const userMessage = message.trim();

    if (userMessage.length > 500) {
      return json({ error: "问题太长了，请简短一点" }, 400);
    }

    const apiKey = getEnv(env, "LLM_API_KEY");
    const baseUrl = getEnv(env, "LLM_BASE_URL");

    if (!apiKey || !baseUrl) {
      return json({ error: "LLM environment variables are not configured" }, 503);
    }

    const response = await fetch(getChatEndpoint(baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.45,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return json({ error: "LLM request failed" }, 502);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return json({ error: "LLM returned empty reply" }, 502);
    }

    return json({ reply });
  } catch (error) {
    return json({ error: "Chat service unavailable" }, 500);
  }
}

function getChatEndpoint(baseUrl) {
  const normalized = baseUrl.replace(/\/$/, "");

  if (normalized.endsWith("/chat/completions")) {
    return normalized;
  }

  return `${normalized}/chat/completions`;
}

function getEnv(env, key) {
  if (env?.[key]) {
    return env[key];
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  return "";
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
