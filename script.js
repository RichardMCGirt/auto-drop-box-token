const axios = require('axios');

// Constants for Dropbox
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const CLIENT_ID = 'wal8feypzdqliah';
const CLIENT_SECRET = 'kndy54sizvqovxv';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

// Constants for Airtable
const AIRTABLE_API_KEY = 'YpatXTUS9m8os14OO1.6a81b7bc4dd88871072fe71f28b568070cc79035bc988de3d4228d52239c8238';
const AIRTABLE_BASE_ID = 'appO21PVRA4Qa087I';
const AIRTABLE_TABLE_ID = 'tbl6EeKPsNuEvt5yJ';
const RECORD_ID = 'YOUR_RECORD_ID'; // The ID of the record you want to update
const FIELD_NAME = 'dropbox token'; // The name of the field where the token is stored

async function refreshAccessToken() {
  try {
    const response = await axios.post(DROPBOX_TOKEN_URL, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    if (response.status === 200) {
      const newAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      // Update the new access token in Airtable
      await updateAirtableToken(newAccessToken);

      console.log('Access token refreshed successfully.');
      return { newAccessToken, expiresIn };
    } else {
      throw new Error(`Failed to refresh token: ${response.data.error_description}`);
    }
  } catch (error) {
    console.error(`Error refreshing access token: ${error.message}`);
  }
}

async function updateAirtableToken(newToken) {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/${RECORD_ID}`;
    const headers = {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };
    const data = {
      fields: {
        [FIELD_NAME]: newToken,
      },
    };

    const response = await axios.patch(url, data, { headers });

    if (response.status === 200) {
      console.log('Airtable token updated successfully.');
    } else {
      throw new Error(`Failed to update Airtable token: ${response.data.error}`);
    }
  } catch (error) {
    console.error(`Error updating Airtable: ${error.message}`);
  }
}

// Example usage
(async () => {
  const { newAccessToken, expiresIn } = await refreshAccessToken();

  // Here you can implement logic to use the new access token
  // For example, check if the token is expired and refresh it as needed
})();
