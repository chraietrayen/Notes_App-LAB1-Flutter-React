// src/services/note-service.js
import { Query } from "appwrite";
import { listDocuments } from "./database-service";
import client from "./appwrite-config";
import { Databases, ID } from "appwrite";
import { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "@env";

const databases = new Databases(client);

// Get all notes, potentially filtered by userId
export const getNotes = async (userId = null) => {
  try {
    // Create query array - initially empty
    const queries = [];

    // If userId is provided, add a filter to only get notes for that user
    if (userId) {
      queries.push(Query.equal("userId", userId));
    }

    // Add sorting by createdAt in descending order (newest first)
    queries.push(Query.orderDesc("createdAt"));

    // Use the listDocuments function from database-service
    const notes = await listDocuments(queries);
    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Create a new note
export const createNote = async (data) => {
  try {
    console.log('createNote called with data:', data);
    console.log('Database ID:', APPWRITE_DATABASE_ID);
    console.log('Collection ID:', APPWRITE_COLLECTION_ID);
    
    // Add timestamps to the note data
    const noteData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating document with noteData:', noteData);
    
    // Create a document in the database
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(), // Generate a unique ID
      noteData
    );

    console.log('Document created successfully:', response);
    return response;
  } catch (error) {
    console.error("Error creating note:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};

// Delete a note by ID
export const deleteNote = async (noteId) => {
  try {
    console.log('deleteNote called with ID:', noteId);
    console.log('Database ID:', APPWRITE_DATABASE_ID);
    console.log('Collection ID:', APPWRITE_COLLECTION_ID);
    
    // Delete the document with the specified ID
    const response = await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId
    );

    console.log('Document deleted successfully:', response);
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};

// Update an existing note
export const updateNote = async (noteId, data) => {
  try {
    // Add updated timestamp
    const noteData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Update the document in the database
    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId,
      noteData
    );

    return response;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};
