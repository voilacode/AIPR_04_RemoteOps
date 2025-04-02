const fetch = require("node-fetch");

exports.suggestPriority = async (deadline, dependencies) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    let priority = "Low";
    if (daysRemaining <= 2) priority = "High";
    else if (daysRemaining <= 5) priority = "Medium";

    if (dependencies.length > 5) priority = "High"; 

    return priority;
};

exports.recommendDeadline = async (deadline, dependencies) => {
    const adjustmentDays = dependencies ? dependencies.length * 1 : 0;
    const newDeadline = new Date(deadline);
    newDeadline.setDate(newDeadline.getDate() + adjustmentDays);
    return newDeadline.toISOString().split("T")[0];
};

exports.optimizeWorkflow = async (tasks) => {
    // AI-driven task workflow optimization
    return tasks.map(task => ({
        ...task,
        priority: task.priority || "Medium",
        adjusted_deadline: task.adjusted_deadline || task.deadline
    }));
};

exports.getTaskRecommendation = async (tasks, userPrompt) => {
    if (!tasks || tasks.length === 0) return "No tasks found.";

    const taskSummary = tasks.map((task, index) => 
        `${index + 1}. ${task.title} - Deadline: ${task.deadline}, Priority: ${task.priority || 'Unknown'}`
    ).join("\n");

    const prompt = `
    You are a smart AI assistant managing tasks.
    The user asked: "${userPrompt}"
    
    Tasks:
    ${taskSummary}

    Consider workload balancing, urgent deadlines, and interdependencies.
    Provide a clear and professional response.
    `;

    const url = 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
            'x-rapidapi-host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o',
            max_tokens: 100,
            temperature: 0.9
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("AI API Error:", error);
        return "Failed to get AI recommendation.";
    }
};