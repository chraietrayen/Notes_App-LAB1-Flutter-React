NotesApp (React Native + Appwrite)

Overview

This is a cross-platform notes app (React Native with Expo) that stores notes in Appwrite. The app shows a list of notes, allows creating, updating, and deleting notes, and syncs with Appwrite.

Files of interest

- `App.js` - Navigation container (Home, Notes)
- `screens/NotesScreen.js` - Notes list UI and CRUD wiring
- `components/NoteItem.js` - Individual note item with Edit/Delete
- `components/NoteInput.js` - Modal for creating/editing notes
- `services/appwrite-config.js` - Appwrite client initialization
- `services/database-service.js` - Generic database helpers
- `services/note-service.js` - Note-specific CRUD operations

Environment

Create a `.env` file in the project root containing your Appwrite credentials:

```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=your_collection_id
APPWRITE_API_KEY=your_api_key_if_needed
```

Ensure your Appwrite collection `notes` has the attributes:
- `title` (String)
- `content` (String)
- `userId` (String)
- `createdAt` (Datetime)
- `updatedAt` (Datetime)

And that the collection permissions allow `Any` to Create/Read/Update/Delete (for client-side SDK use) or use server-side SDK with API key.

Install dependencies

```powershell
npm install
```

Run the app (Expo)

```powershell
npm start
# then press w to open web
```

Testing

- Open browser console (F12) to see logs for fetch/create/delete operations.
- Create note: Click the + FAB, enter text, Save. Check Appwrite console for document.
- Delete note: Click Delete on a note; confirm. Check console logs for delete flow and Appwrite console for deletion.

Troubleshooting

- If the app logs `Port 8081 is being used`, stop the process using that port or choose a different port.
- If create/delete fails with 401 Unauthorized: Check collection permissions in Appwrite Console.
- If environment variables read as `undefined` in the app: ensure `.env` exists and metro was started after creating it.

Notes

- The `Notes` screen uses the navigation header (configured in `App.js`) and a floating add button (FAB). This avoids duplicate headers.
- Delete has been enhanced to log IDs and errors for easier debugging.

If anything still fails, run the included test script to verify Appwrite connectivity:

```powershell
node test-create-note.js
```

If that script succeeds but the app fails, the issue is with the client environment (Metro/expo). Restart Metro and ensure `.env` is loaded.
