import {GoogleAuth} from 'google-auth-library'
import {google} from 'googleapis'
export async function appendValues(spreadsheetId, range, valueInputOption, _values) {

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

