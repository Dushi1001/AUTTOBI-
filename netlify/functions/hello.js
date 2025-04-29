// Simple Netlify function to test deployment
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from AUTTOBI API!",
      timestamp: new Date().toISOString()
    })
  };
};