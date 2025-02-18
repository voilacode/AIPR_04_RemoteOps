const aiModel = require('../models/aiModel');

exports.getAIApp = (req, res) => {
  const user = req.session.user;
  console.log(user);
  
  res.render('aiapp', { user, content: '' });
};

exports.generateAIContent = async (req, res) => {
  let { prompt } = req.body;
  const user = req.session.user;
  console.log(user);

  const generatedContent = await aiModel.generateAIContent(prompt);

  if (!generatedContent) {
    return res.render('aiApp', {
      user,
      error: 'Failed to generate code',
      content: '',
    });
  }

  res.render('aiapp', { content: generatedContent, user });
};
