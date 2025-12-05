// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://zmvyiloxuaxkxshhlqqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdnlpbG94dWF4a3hzaGhscXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjUzOTYsImV4cCI6MjA4MDQwMTM5Nn0.FzGzvCV5AZx_CGHGOTIwgN8vhWONciia0Y0Dgdve-s8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
const db = {
  // User Management
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Flashcard Decks
  async getDecks(userId) {
    const { data, error } = await supabase
      .from('decks')
      .select('*, flashcards(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createDeck(userId, deckName) {
    const { data, error } = await supabase
      .from('decks')
      .insert([{ user_id: userId, name: deckName }])
      .select()
      .single();
    return { data, error };
  },

  async deleteDeck(deckId) {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', deckId);
    return { error };
  },

  // Flashcards
  async createFlashcard(deckId, question, answer) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ deck_id: deckId, question, answer }])
      .select()
      .single();
    return { data, error };
  },

  async updateFlashcard(flashcardId, question, answer) {
    const { data, error } = await supabase
      .from('flashcards')
      .update({ question, answer })
      .eq('id', flashcardId)
      .select()
      .single();
    return { data, error };
  },

  async deleteFlashcard(flashcardId) {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);
    return { error };
  },

  // Notebooks
  async getNotebooks(userId) {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createNotebook(userId, name, type, color = '667eea,764ba2') {
    const { data, error } = await supabase
      .from('notebooks')
      .insert([{ user_id: userId, name, type, pages: [], color }])
      .select()
      .single();
    return { data, error };
  },

  async updateNotebook(notebookId, pages) {
    const { data, error } = await supabase
      .from('notebooks')
      .update({ pages })
      .eq('id', notebookId)
      .select()
      .single();
    return { data, error };
  },

  async deleteNotebook(notebookId) {
    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', notebookId);
    return { error };
  }
};

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'index.html';
  }
});