import { google } from "googleapis";
import http from "node:http";


// const gAuth = new google.auth.GoogleAuth({
//     keyFile: "secret.json",
//     scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
// });

const gAuth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        // type: "service_account",
        // project_id: "teste-sheets-v4",
        // client_id: "110551494180054222557",
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
});



// const privateKey = process.env.GOOGLE_PRIVATE_KEY;

// const gAuth = new google.auth.GoogleAuth({
//     credentials: {
//         "type": "service_account",
//         "project_id": "teste-sheets-v4",
//         "private_key_id": "70d02ec51c99f4288ca2b59d8d036040cea200fa",
//         "private_key": privateKey.replace(/\\n/g, '\n'),
//         "client_email": "teste-sheet@teste-sheets-v4.iam.gserviceaccount.com",
//         "client_id": "110551494180054222557",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/teste-sheet%40teste-sheets-v4.iam.gserviceaccount.com"
//       },
//       scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
// })

// console.log(gAuth)

const gDrive = google.drive({
    version: "v3",
    auth: await gAuth.getClient(),
});


// functions
async function getFolders() {
    const rootFolderId = process.env.ROOT_FOLDER_ID;
    const gFolders = await gDrive.files.list({
        q: `'${rootFolderId}' 
                    in parents
                    and mimeType = 'application/vnd.google-apps.folder'`,
        fields: "files(id, name)",
    });
    return gFolders.data.files ? gFolders.data.files : false;
}

const folders = await getFolders()
console.log(folders)

// export const authClient = await gAuth.getClient();


const host = 'localhost';
const port = process.env.PORT || 8000;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(folders));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});