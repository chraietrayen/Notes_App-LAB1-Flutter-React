import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import NoteItem from '../components/NoteItem';
import NoteInput from '../components/NoteInput';
import { getNotes, createNote, updateNote, deleteNote } from '../services/note-service';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      console.log('Fetched notes:', fetchedNotes);
      const formattedNotes = fetchedNotes.map(doc => {
        console.log('Formatting note - ID:', doc.$id, 'Content:', doc.content);
        return { id: doc.$id, title: doc.title, content: doc.content, userId: doc.userId, createdAt: doc.createdAt, updatedAt: doc.updatedAt };
      });
      console.log('Formatted notes:', formattedNotes);
      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes. Make sure Appwrite permissions are set.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const saveNote = async () => {
    console.log('saveNote called with noteText:', noteText);
    if (noteText.trim() === '') {
      console.log('Note text is empty, returning');
      return;
    }
    try {
      console.log('Creating/updating note...');
      if (editingNote) {
        console.log('Updating existing note:', editingNote.id);
        await updateNote(editingNote.id, { title: noteText.substring(0, 50), content: noteText });
        Alert.alert('Success', 'Note updated!');
      } else {
        console.log('Creating new note');
        const result = await createNote({ title: noteText.substring(0, 50), content: noteText, userId: 'user-001' });
        console.log('Note created successfully:', result);
        Alert.alert('Success', 'Note created!');
      }
      setNoteText('');
      setModalVisible(false);
      setEditingNote(null);
      console.log('Reloading notes...');
      loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note: ' + error.message);
    }
  };

  const handleDeleteNote = async (id) => {
    console.log('handleDeleteNote called with id:', id);

    const confirmAndDelete = async () => {
      try {
        console.log('Calling deleteNote with id:', id);
        await deleteNote(id);
        console.log('Delete successful, removing note from state');
        // Optimistically remove the note from local state
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (Platform.OS !== 'web') {
          Alert.alert('Success', 'Note deleted!');
        } else {
          // On web use window.alert for synchronous behavior inside confirm
          window.alert('Note deleted!');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        const message = error?.message || 'Unknown error';
        if (Platform.OS !== 'web') {
          Alert.alert('Error', 'Failed to delete note: ' + message);
        } else {
          window.alert('Failed to delete note: ' + message);
        }
      }
    };

    if (Platform.OS === 'web') {
      // window.confirm returns true/false synchronously on web
      const ok = window.confirm('Delete note? Are you sure?');
      if (ok) confirmAndDelete();
    } else {
      Alert.alert('Delete Note', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmAndDelete },
      ]);
    }
  };

  const editNoteHandler = (note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNoteText('');
    setEditingNote(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotes();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#f4511e' />
        <Text style={styles.loadingText}>Loading notes from Appwrite...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onEdit={editNoteHandler}
              onDelete={handleDeleteNote}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notes yet. Create one!</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add a note</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      
      <NoteInput
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveNote}
        noteText={noteText}
        setNoteText={setNoteText}
        isEditing={!!editingNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666'
  },
  notesList: {
    padding: 15
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  }
});
