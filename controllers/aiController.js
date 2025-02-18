// Import AI model
const aiModel = require('../models/aiModel');

// Render AI app page with form to take prompt
exports.getAIApp = (req, res) => {
  const user = req.session.user;
  console.log(user);
  
  res.render('aiapp', { user, content: '' });
};

// Handle AI content generation
exports.generateAIContent = async (req, res) => {
  let { prompt } = req.body;
  const user = req.session.user;
  console.log(user);

  // Generate content using AI model
  const generatedContent = await aiModel.generateAIContent(prompt);

  // Show error if content generation fails
  if (!generatedContent) {
    return res.render('aiApp', {
      error: 'Failed to generate code',
      content: '',
    });
  }

  // Render AI app page with generated content
  res.render('aiapp', { content: generatedContent, user });
};
