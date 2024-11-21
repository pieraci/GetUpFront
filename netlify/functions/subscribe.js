const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Email is required' 
        })
      };
    }

    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'pending',
      tags: ['Landing Page Signup']
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for subscribing! Please check your email to confirm.'
      })
    };
  } catch (error) {
    console.error('Subscription error:', error);

    // Handle member exists error
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'This email is already subscribed to our list.'
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Subscription failed. Please try again later.'
      })
    };
  }
};