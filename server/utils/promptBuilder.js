export const buildPrompt = ({
    topic,
    classLevel,
    examType,
    revisionMode,
    includeDiagram,
    includeChart,
}) => {
    return ` 
    You are a STRICT JSON generator for an exam preparation system.

    ⚠️ VERY IMPORTANT:
    - Output MUST be vailid JSON
    - Your response will be parsed using JSON.parse()
    - INVALID JSON will cause system failure
    - Use ONLY double quotes "
    - NO comments, ON trailling commas
    - Escape line breaks using \\n
    - Do NOT use emojis inside text values

    TASK:
    Convert the given topic into exam-focused notes.

    INPUT:
    Topic: ${topic}
    Class Level: ${classLevel || "Not specified"}
    Exam Type: ${examType || "General"}
    Revision Mode: ${revisionMode ? "ON" : "OFF"}
    Include Diagram ${includeDiagram ? "ON" : "OFF"}
    Include Charts: ${includeChart ? "ON" : "OFF"}

    GLOBAL CONTENT RULES:
    - Use clear, simple, exam-oriented language
    - Notes MUST be Markdown formatted
    - Headings and bulled points only

    REVISION MODE RULES (CRITICAL):
    - If REVISION MODE is ON:
        - Notes must be VERY SHORT
        - Only bullet points
        - One-line answers only
        - Definitions, formulas, keywords
        - NO explanations
        - Content must feel like:
            - last-day revision
            - 5-minute exam cheat sheet
        - revisionPoints MUST summarize ALL important facts

    - If REVISION MODE is OFF:
        - Notes must be DETAILED but enam-focused
        - Each topic should include:
            - definition
            - short explanation
            - examples (if applicable)
        - Paragraph length: max 2-6 lines
        - No storytelling, no extra theory
    
    IMPROTANCE RULES:
        - Divide sub-topics into THree categories:
            - ⭐ Very Important Topics
            - ⭐⭐ Important Topic
            - ⭐⭐⭐ Frequently Asked Topics
        - All three categories MUST be present 
        - Base importance on exam frequency and weightage

    DIAGRAM RULES:
    - If INCLUDE DIAGRAM is YES:
        - diagram.data MUST be a SINGLE STRING
        - Valid Mermaid syntax only 
        - Must start with: graph TD
        - Wrap EVERY node lable in square brackets[]
        - Do NOT use special characters inside labels
    - If INCLUDE DIAGRAM is NO:
        - diagram.data NUST be ""
        
    CHART RULES (RECHARTS):
    - if INCLUDE CHARTS is YES:
        - charts array MUST NOT be empty
        - Generate at least ONE chart
        - Choose chart based on topic type:
            - THEORT topic → bar or pie (importance / ewightage)
            - PROCESS topic → bar or line (steps / stages)
        - Use numeric value ONLY
        - Labels must be short and exam-oriented
    - if INCLUDE CHART is NO:
        - charts MUST be []
        
        
    CHART TYPES ALLOWED:
    - bar
    - line
    - pie

    CHART OBJECT FORMAT:
    {
        "type": "bar | line | pie", 
        "title": "string",
        "data" :[
            {"name": "string", "value" :10}       
        ]
    }
    
    STRICT JSON FORMAT (DO NOT CHANGE):

    {
        "subTopics":{
        "⭐": [],
        "⭐⭐": [],
        "⭐⭐⭐": []
        },
        "importance": "⭐ | ⭐⭐ | ⭐⭐⭐",
        "notes" : "string",
        "revisionPoints": [],
        "questions":{
            "short":[],
            "long": [],
            "diagram": ""
        },
        "diagram":{
            "type": "flowchart | graph | process",
            "data": ""            
        },
        "charts": []
    }
    
    RETURN ONLY VALID JSON.
    `;
};