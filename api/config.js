/**
 * Vercel serverless function to serve configuration data
 * This keeps sensitive information like webhook URLs secure
 */

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the webhook URL from environment variable
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({
        error: 'N8N_WEBHOOK_URL environment variable not configured'
      });
    }

    // Return the configuration
    res.status(200).json({
      webhookUrl: webhookUrl,
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Config API error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}