import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

async function createServer() {
  const app = express();
  
  // Increase timeout and add error handling
  app.use(cors());
  app.use(express.json());
  app.set('timeout', 120000); // Set timeout to 2 minutes

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: {
        timeout: 120000 // Increase HMR timeout
      }
    },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Configure Mailchimp with timeout
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
    timeout: 60000 // Set Mailchimp timeout to 1 minute
  });

  // Debug endpoint to verify Mailchimp configuration
  app.get('/api/debug-config', (req, res) => {
    // Don't send the actual API key, just check if it exists
    res.json({
      hasApiKey: !!process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
      listId: process.env.MAILCHIMP_LIST_ID
    });
  });

  // Test endpoint to verify Mailchimp connection
  app.get('/api/test-mailchimp', async (req, res) => {
    try {
      const response = await mailchimp.ping.get();
      res.json({ 
        success: true, 
        message: 'Mailchimp API connection successful!',
        status: response.health_status 
      });
    } catch (error) {
      console.error('Mailchimp test error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Mailchimp API connection failed',
        error: error.message 
      });
    }
  });

  app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    try {
      console.log('Attempting to subscribe:', email);
      console.log('Using list ID:', process.env.MAILCHIMP_LIST_ID);

      const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
        email_address: email,
        status: 'pending',
        tags: ['Landing Page Signup']
      });

      console.log('Mailchimp response:', response);

      res.status(200).json({ 
        success: true, 
        message: 'Thank you for subscribing! Please check your email to confirm.' 
      });
    } catch (error) {
      console.error('Detailed Mailchimp error:', {
        status: error.status,
        response: error.response,
        message: error.message
      });

      // Check for specific Mailchimp error cases
      if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our list.'
        });
      }

      res.status(500).json({ 
        success: false, 
        message: 'Subscription failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Serve static files from the dist directory
  app.use(express.static(join(__dirname, 'dist')));

  // Handle all other routes by serving index.html
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  });

  const PORT = process.env.PORT || 5000;
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Set timeout for the server
  server.timeout = 120000;
}

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

createServer().catch(console.error);