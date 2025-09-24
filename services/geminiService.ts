import { GoogleGenAI, Type } from "@google/genai";
import { JobSeekerSituation, Message, ResumeOutput } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Service for the guided resume writing feature
export const getInitialQuestion = async (situation: JobSeekerSituation): Promise<string> => {
  try {
    const prompt = `You are "知遇 AI", a warm, empathetic, and professional career coach. Your goal is to help a job seeker write their resume by asking guiding questions.

    The user is in the following situation: "${situation}".

    Start the conversation. Your first message should be encouraging and ask an open-ended question to get them started talking about their experiences related to their situation. Keep your first message concise, friendly, and under 50 words. Respond in Chinese.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting initial question:", error);
    return "抱歉，我好像遇到了一些问题。请稍后再试。";
  }
};

export const getFollowUpQuestion = async (history: Message[]): Promise<string> => {
  const conversationHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
  try {
    const prompt = `You are "知遇 AI", a warm, empathetic, and professional career coach. You are in a conversation with a job seeker to help them write their resume.

    Here is the conversation history so far:
    ${conversationHistory}

    Your task is to:
    1. Acknowledge and validate the user's last message.
    2. Provide a short, encouraging sentence.
    3. Ask a follow-up question that digs deeper into their experience, asks for specific examples, or prompts them to reflect on their skills and achievements.
    4. Keep your response concise and conversational. Respond in Chinese.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting follow-up question:", error);
    return "抱歉，我好像遇到了一些问题。请稍后再试。";
  }
};

export const generateResumeFromChat = async (history: Message[]): Promise<string> => {
  const conversationHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
  try {
    const prompt = `You are an expert resume writer. You will be given a conversation transcript between a career coach AI and a job seeker.

    Your task is to analyze the entire conversation and synthesize the information into a professional, well-structured resume.

    - Extract key responsibilities, achievements, and skills.
    - Quantify achievements with numbers and metrics wherever possible, even if you have to make reasonable assumptions based on the context.
    - Use action verbs to start bullet points.
    - Organize the information into logical sections (e.g., Summary, Work Experience, Projects, Skills).
    - The output should be a single block of text formatted with Markdown for clarity (e.g., using ### for section headers and * for bullet points). Do not include any introductory or concluding sentences outside of the resume content itself. Respond in Chinese.
    
    Conversation History:
    ${conversationHistory}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating resume from chat:", error);
    return "生成简历时出错，请检查对话内容并重试。";
  }
};


// Service for the JD customization feature
export const customizeResumeAndGreeting = async (baseResume: string, jobDescription: string): Promise<ResumeOutput> => {
  try {
    const prompt = `You are an expert HR specialist and resume writer. Your task is to tailor a job applicant's resume for a specific role and write a compelling greeting message. Respond in Chinese.

    **Base Resume:**
    ---
    ${baseResume}
    ---

    **Job Description:**
    ---
    ${jobDescription}
    ---
    
    **Instructions:**
    1.  **Extract Company and Position:** First, identify the company name and the specific position/job title from the Job Description.
    2.  **Customize Resume:** Analyze the Job Description and rewrite the Base Resume. The new resume must:
        - Emphasize the skills and experiences from the Base Resume that are most relevant to the Job Description.
        - Integrate keywords and terminology from the Job Description naturally.
        - Rephrase bullet points to highlight achievements and impact, aligning them with the requirements of the new role.
        - Maintain a professional tone and format.
        - The output should be a single block of text formatted with Markdown.

    3.  **Write Greeting Message:** Based on the tailored resume and the Job Description, write a greeting message following this template:
        "您好，看了贵公司的岗位JD，对您发布的[岗位名称]岗位很感兴趣。我有[年限]的[核心经验]经验，具备[核心能力1]、[核心能力2]，擅长[技能]，有[项目/成就]的经验。与贵公司的岗位匹配度高，如果您觉得合适，可以回复一下，给您发我的简历和作品集，谢谢!"
        - Fill in the bracketed parts using information from the Job Description and the candidate's resume. The message must be concise, professional, and under 150 words.
    `;
    
    const schema = {
      type: Type.OBJECT,
      properties: {
        customizedResume: {
          type: Type.STRING,
          description: "The full text of the customized resume, formatted in Markdown. (in Chinese)"
        },
        greetingMessage: {
          type: Type.STRING,
          description: "A compelling greeting message for the application, following the specified template. (in Chinese)"
        },
        companyName: {
          type: Type.STRING,
          description: "The name of the company from the job description. (in Chinese)"
        },
        positionName: {
          type: Type.STRING,
          description: "The name of the job position from the job description. (in Chinese)"
        }
      },
      required: ["customizedResume", "greetingMessage", "companyName", "positionName"]
    };
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as ResumeOutput;

  } catch (error) {
    console.error("Error customizing resume:", error);
    return {
      customizedResume: "生成定制化简历时出错，请检查输入内容并重试。",
      greetingMessage: "生成打招呼消息时出错，请稍后重试。",
      companyName: "未知公司",
      positionName: "未知岗位"
    };
  }
};