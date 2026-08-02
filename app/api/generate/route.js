import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { url, tone = "professional", formatLength = "detailed" } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey !== "sk-proj-your-openai-api-key-here") {
      const openai = new OpenAI({ apiKey });

      const prompt = `You are an elite content strategist AI. Take the content concept or topic represented by this URL: "${url}". 
Target tone of voice: "${tone}".
Desired output depth: "${formatLength}".

Generate a JSON object containing high-converting social media and newsletter copy with this exact schema:
{
  "linkedin": {
    "title": "Short punchy headline for LinkedIn",
    "content": "Full formatted LinkedIn post with emojis, key points, numbered bullets, tone: ${tone}, depth: ${formatLength}, and clear call-to-action."
  },
  "twitter": {
    "title": "Viral Thread Breakdown (5-6 Posts)",
    "content": "A 5-6 part Twitter/X thread formatted as 1/6, 2/6, 3/6, 4/6, 5/6, 6/6 with hooks and strong conclusions."
  },
  "newsletter": {
    "title": "Weekly Newsletter Issue Title",
    "content": "Formatted email newsletter draft including Subject Line, friendly builder opening, core key takeaways from ${url}, and link CTA."
  }
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional AI content repurposing engine. Output strictly valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const resultText = response.choices[0].message.content;
      const parsedData = JSON.parse(resultText);

      return NextResponse.json(parsedData);
    }

    // Fallback dynamic generator if OPENAI_API_KEY is not configured
    let topicName = "Modern Technology & Growth";
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname.replace(/[-_]/g, " ").replace(/\//g, " ").trim();
      if (pathname) {
        topicName = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      } else {
        topicName = parsedUrl.hostname.replace("www.", "");
      }
    } catch {
      topicName = url;
    }

    const fallbackData = {
      linkedin: {
        title: `The Shift Toward Autonomous Systems (${topicName})`,
        content: `🚀 Analyzing key insights from: ${url}\n\nTone: ${tone.toUpperCase()} | Length: ${formatLength.toUpperCase()}\n\nHere are core strategic transitions happening right now:\n\n1️⃣ Micro-services reduction: Deployment bottlenecks drop by 42% when modular event-driven pipelines are applied correctly.\n2️⃣ Edge-computed state management: Moving logic closer to the user cuts payload latency down sub-50ms thresholds.\n3️⃣ Automated CI/CD guardrails: Manual testing is rapidly being replaced by synthetic heuristic checks.\n\nWhat is your team's biggest operational focus this quarter?\n\n👇 Drop your thoughts below.`
      },
      twitter: {
        title: `Viral Thread Breakdown: ${topicName} (6 Posts)`,
        content: `1/6 Breakout analysis on "${topicName}" (${tone} tone | ${formatLength} depth) 🧵👇\n\n2/6 Bottlenecks aren't a hardware failure—they are a structural design flaw. Monoliths force total deployment locks. Break them down into modular event streams.\n\n3/6 Latency kills conversion. Edge computing isn't an enterprise buzzword; it's a baseline requirement. Push state calculations to the closest node.\n\n4/6 The biggest risk isn't breaking production; it's moving too slow to matter. Synthetic heuristic checks replace manual human QA cycles instantly.\n\n5/6 By implementing automated pipelines, teams see up to a 42% decrease in deployment failure rates.\n\n6/6 Check out the complete source here: ${url} and let us know what strategy your team is deploying!`
      },
      newsletter: {
        title: `Weekly Engineering Dispatch: ${topicName}`,
        content: `Subject: Why your scaling strategy is failing (and how to fix it)\n\nHello Builder,\n\nIf you've been watching modern backend evolution, you know that standard server configurations no longer cut it. This week, we broke down telemetry data across distributed applications parsed directly from: ${url}\n\nThe clear winner? Edge-native modular code execution.\n\nInside this week's technical brief, we analyze how teams reduce deployment failures by 40% using automated micro-pipelines. Read the full brief on our portal today.`
      }
    };

    return NextResponse.json(fallbackData);

  } catch (error) {
    console.error("API /api/generate error:", error);
    return NextResponse.json({ error: "Failed to generate content matrix: " + error.message }, { status: 500 });
  }
}
