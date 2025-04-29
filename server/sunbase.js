import fetch from 'node-fetch';

const SUNBASE_API_URL = process.env.SUNBASE_API_URL;
const SUNBASE_API_KEY = process.env.SUNBASE_API_KEY;
const SUNBASE_API_SECRET = process.env.SUNBASE_API_SECRET;

// Helper for API authentication
async function getAuthToken() {
  const response = await fetch(`${SUNBASE_API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: SUNBASE_API_KEY,
      secret: SUNBASE_API_SECRET
    })
  });
  
  if (!response.ok) {
    throw new Error(`Sunbase authentication failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.token;
}

// Initialize KYC verification process
export async function initiateKyc(userId, userDetails) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${SUNBASE_API_URL}/kyc/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        external_id: userId.toString(),
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        redirect_url: process.env.KYC_REDIRECT_URL || 'https://your-app.netlify.app/kyc-complete'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to initiate KYC: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      kycId: data.kyc_id,
      verificationUrl: data.verification_url
    };
  } catch (error) {
    console.error('KYC initiation error:', error);
    throw error;
  }
}

// Check KYC verification status
export async function checkKycStatus(kycId) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${SUNBASE_API_URL}/kyc/status/${kycId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check KYC status: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      status: data.status,
      verificationDetails: data.verification_details || {}
    };
  } catch (error) {
    console.error('KYC status check error:', error);
    throw error;
  }
}

// Webhook handler for KYC status updates
export function handleKycWebhook(webhookData) {
  // Process webhook data from Sunbase
  const { kyc_id, status, verification_details } = webhookData;
  
  // Return processed data to be stored in database
  return {
    kycId: kyc_id,
    status,
    verificationDetails: verification_details
  };
}
