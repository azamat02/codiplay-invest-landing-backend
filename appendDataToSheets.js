async function appendValues(spreadsheetId, range, valueInputOption, _values) {
    const {GoogleAuth} = require('google-auth-library');
    const {google} = require('googleapis');
  
    const auth = new GoogleAuth({
        keyFile: "credentials.json",
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
  
    const service = google.sheets({version: 'v4', auth});

    const resource = {
      values: _values,
    };

    try {
        const result = await service.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        })
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {appendValues}
