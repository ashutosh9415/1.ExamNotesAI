const Gemini_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const parseJsonResponse = (text) => {
  if (!text) return null;

  const cleanText = text
    .replace(/```json/gim, "")
    .replace(/```/g, "")
    .trim();

  const jsonText = cleanText.match(/\{[\s\S]*\}/)?.[0] || cleanText;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini returned invalid JSON:");
    console.error(cleanText);
    throw new Error("Gemini returned invalid JSON");
  }
};

export const generateGeminiResponse = async (prompt) => {
const models = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
];



  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await fetch(
        `${Gemini_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `Gemini ${model} Error:`,
          JSON.stringify(data, null, 2)
        );

        lastError = new Error(
          data?.error?.message || `Gemini ${model} request failed`
        );

        if (
          response.status === 429 ||
          response.status === 500 ||
          response.status === 502 ||
          response.status === 503 ||
          response.status === 504
        ) {
          continue;
        }

        throw lastError;
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("")
        .trim();

      if (!text) {
        console.error(
          `No text returned from Gemini ${model}:`,
          JSON.stringify(data, null, 2)
        );

        lastError = new Error(`No text returned from ${model}`);
        continue;
      }

      return parseJsonResponse(text);
    } catch (error) {
      console.error(`Gemini ${model} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || "Unknown Gemini error"
    }`
  );
};