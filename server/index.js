const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const pdf = require("pdf-parse");

require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
console.log("✅ Loaded OpenAI key:", process.env.OPENAI_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "zorianakovalchuk14010416@gmail.com",
    pass: "pnaq yzia qovs abwg",
  },
});

app.post("/send-verification", async (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: "StudyCraftAI <zorianakovalchuk14010416@gmail.com>",
    to: email,
    subject: "Your StudyCraftAI Verification Code",
    text: `Hello! 👋\n\nYour verification code is: ${code}\n\nPlease enter it in the app to continue.\n\nThanks!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

const extractTextFromPdf = async (fileUrl) => {
  try {
    const pdfResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });
    const pdfData = await pdf(pdfResponse.data);
    return pdfData.text.slice(0, 6000);
  } catch (err) {
    console.error("❌ Failed to extract PDF:", err.message);
    return null;
  }
};

app.post("/generate-summary", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const text = await extractTextFromPdf(fileUrl);

    if (!text) {
      return res.status(400).json({ error: "PDF extraction failed" });
    }

    const prompt = `
Read the following academic or educational document and do the following:

1. Detect the primary language of the input and respond in the same language(write title and summary in that language).
2. Generate a clear and informative title summarizing the overall topic.
3. Write a **detailed structured summary** (NOT just 2 sentences). Include:
   - Introduction to the topic
   - Key points, arguments, or theories (as bullet points)
   - Conclusions if available

Respond ONLY in the following JSON format:
{
  "title": "Your generated title here",
  "summary": "Your detailed multi-paragraph summary here with line breaks"
}

TEXT:
${text}
`;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = response.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      console.error("❌ JSON parse error from OpenAI:", e.message);
      console.log("🧾 Response content:", aiText);
      return res.status(500).json({ error: "AI response not valid JSON" });
    }

    const { title, summary } = parsed;

    if (!title || !summary) {
      return res.status(400).json({ error: "Incomplete AI response" });
    }

    res.json({ title, summary });
  } catch (err) {
    console.error("❌ Summary generation error:", err.message);
    res.status(500).json({ error: "Summary generation failed" });
  }
});

app.post("/generate-glossary", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const text = await extractTextFromPdf(fileUrl);
    const prompt = `
From the academic or technical text below, identify and extract the most important glossary terms.Detect the primary language of the input and respond in the same language
Generate as many as you can.(at least 10)
Each glossary term should be:
- A real academic/technical keyword
- Clearly explained in context
- Written in the same language as the text

Respond in valid JSON ONLY, in the following format:
[
  {
    "term": "Term1",
    "definition": "A clear and concise explanation of Term1."
  },
  ...
]

TEXT:
${text}
`;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response.choices[0].message.content;

    const glossary = JSON.parse(rawContent);

    res.json({ glossary });
  } catch (err) {
    console.error("❌ Glossary error:", err.message);
    res.status(500).json({ error: "Glossary generation failed" });
  }
});

app.post("/generate-flashcards", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const text = await extractTextFromPdf(fileUrl);

    const prompt = `
From the text below, create as many flashcards as possible in JSON format(at least 10). Detect the primary language of the input and respond in the same language:
[
  {
    "question": "Some question",
    "answer": "Corresponding answer"
  }
]

Respond only with valid JSON in the same language as the text.⚠️ Use the same language as the input text.

TEXT:
${text}
    `;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json({ flashcards: parsed });
  } catch (err) {
    console.error("❌ Flashcards error:", err.message);
    res.status(500).json({ error: "Flashcard generation failed" });
  }
});

app.post("/generate-questions", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const text = await extractTextFromPdf(fileUrl);

    const prompt = `
From the following text, extract as many relevant quiz-style questions and answers as possible.Detect the primary language of the input and respond in the same language
Generate as many as you can.(at least 10)

Return the result as a valid JSON array in this structure:

[
  {
    "question": "Question text in original language",
    "answer": "Answer text in original language"
  }
]

Respond only with valid JSON. Do not include explanations, formatting, or notes.

TEXT:
${text}`;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content;
    const questions = JSON.parse(raw);
    res.json({ questions });
  } catch (error) {
    console.error("❌ Question generation error:", error.message);
    res.status(500).json({ error: "Question generation failed" });
  }
});
app.post("/generate-test", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      console.error("❌ Missing fileUrl");
      return res.status(400).json({ error: "fileUrl is required" });
    }

    console.log("📥 File URL received:", fileUrl);

    let pdfData;

    try {
      const pdfResponse = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      pdfData = await pdf(pdfResponse.data);
      console.log("✅ PDF downloaded and parsed");
    } catch (pdfError) {
      console.error("❌ PDF parse failed:", pdfError.message);
      return res.status(500).json({ error: "Could not extract text from PDF" });
    }

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      console.error("❌ Extracted PDF text is empty");
      return res.status(400).json({ error: "No readable text in PDF" });
    }

    const text = pdfData.text.slice(0, 7000);
    console.log("📄 Extracted PDF text sample:", text.slice(0, 200));

    const prompt = `
Generate multiple-choice quiz questions(at least 15) from the following lecture content.Detect the primary language of the input and respond in the same language.
Each question must have 4 options (A, B, C, D) and indicate the correct one.
Use this format strictly:
Q: What is ...?
A) ...
B) ...
C) ...
D) ...
Answer: B

Text:
${text}
`;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    if (
      !response ||
      !response.choices ||
      !response.choices[0]?.message?.content
    ) {
      console.error(
        "❌ Invalid OpenAI response",
        JSON.stringify(response, null, 2)
      );
      return res.status(500).json({ error: "Empty response from OpenAI" });
    }

    const raw = response.choices[0].message.content;
    console.log("🧠 Raw OpenAI response:\n", raw.slice(0, 500));

    const test = raw
      .split("Q:")
      .filter((chunk) => chunk.trim() !== "")
      .map((chunk) => {
        const [questionAndOptions, answerLine] = chunk.split("Answer:");
        const lines = questionAndOptions.trim().split("\n");
        const question = lines[0]?.trim();
        const options = lines.slice(1, 5).map((line) => line.trim());
        return {
          question,
          options,
          answer: answerLine?.trim(),
        };
      })
      .filter((q) => q.question && q.options?.length === 4 && q.answer);

    console.log(`✅ Parsed ${test.length} questions`);
    res.json({ test });
  } catch (err) {
    console.error("❌ generate-test error:", err.message, err.stack);
    res.status(500).json({ error: "Question generation failed" });
  }
});
app.post("/generate-presentation", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ error: "fileUrl is required" });

    const pdfBuffer = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const pdfData = await pdf(pdfBuffer.data);

    const text = pdfData.text.slice(0, 7000);

    const prompt = `
Create a slide-based presentation outline from this lecture.Detect the primary language of the input and respond in the same language
Generate as many as you can.(at least 5)
For each slide, provide a title and 3–5 bullet points.
Respond in this JSON format:
[
  {
    "title": "Slide title here",
    "bullets": ["point 1", "point 2", "point 3"]
  },
  ...
]

Lecture text:
${text}
`;
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message.content;

    let slides;
    try {
      slides = JSON.parse(content);
    } catch (err) {
      console.error("❌ Failed to parse slides JSON:", err);
      return res.status(500).json({ error: "Presentation parsing failed" });
    }

    res.json({ presentation: slides });
  } catch (err) {
    console.error("❌ Presentation generation failed:", err.message);
    res.status(500).json({ error: "Presentation generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
