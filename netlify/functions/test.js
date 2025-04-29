// Simple test function to verify Netlify Functions are working
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Netlify Functions are working correctly!",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  };
};
