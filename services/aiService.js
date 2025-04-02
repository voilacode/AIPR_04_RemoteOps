exports.suggestPriority = async (deadline, dependencies) => {
    const urgencyScore = new Date(deadline) - new Date();
    const dependencyFactor = dependencies ? dependencies.length * 2 : 0;
    return urgencyScore < 0 ? "High" : dependencyFactor > 5 ? "Medium" : "Low";
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