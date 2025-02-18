const axios = require('axios');

// Function to generate AI content using RapidAPI
async function generateAIContent(prompt) {
  const url = 'https://chat-gpt26.p.rapidapi.com/';
  const options = {
    method: 'POST',
    headers: {
      // Replace with your actual RapidAPI key
      'x-rapidapi-key': 'd95138bcccmsh5d35a3a49ecb578p17c5b4jsn72168f34851e',
      'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
  };

  try {
    // Send request to AI API
    const response = await axios(url, options);
    console.log('ai response', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { generateAIContent };
