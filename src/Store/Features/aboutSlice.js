import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

// Async thunk for updating about info (with create if not exists)
export const updateAboutInfo = createAsyncThunk(
  'about/updateAboutInfo',
  async (aboutData, { rejectWithValue }) => {
    try {
      const aboutRef = doc(db, 'portfolio', 'about');
      
      // Check if document exists first
      const aboutSnap = await getDoc(aboutRef);
      
      if (aboutSnap.exists()) {
        // Document exists, update it
        await updateDoc(aboutRef, aboutData);
      } else {
        // Document doesn't exist, create it
        await setDoc(aboutRef, aboutData);
      }
      
      return aboutData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching about info
export const fetchAboutInfo = createAsyncThunk(
  'about/fetchAboutInfo',
  async (_, { rejectWithValue }) => {
    try {
      const aboutRef = doc(db, 'portfolio', 'about');
      const aboutSnap = await getDoc(aboutRef);
      
      if (aboutSnap.exists()) {
        return aboutSnap.data();
      } else {
        // Return default data if document doesn't exist
        const defaultData = {
          name: "Muhammad Basil Irfan",
          title: "Full Stack Developer",
          dob: "June 30, 2003",
          location: "Karachi, Sindh, Pakistan",
          email: "baasilrazriz@gmail.com",
          phone: "+923237184249",
          about: "Passionate Full Stack Developer with 3+ years of experience creating innovative digital solutions. I specialize in MERN stack development and love turning complex problems into elegant, user-friendly applications.",
          education: "Bachelor's in Computer Science",
          languages: "English, Urdu, Hindi",
          interests: "Web Development, UI/UX Design, Open Source",
          certifications: "AWS Certified, React Developer Certified",
          Profilepic: "",
        };
        
        // Create the document with default data
        await setDoc(aboutRef, defaultData);
        return defaultData;
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    name: "",
    title: "",
    dob: "",
    location: "",
    email: "",
    phone: "",
    about: "",
    education: "",
    languages: "",
    interests: "",
    certifications: "",
    Profilepic: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update About Info
      .addCase(updateAboutInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAboutInfo.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(updateAboutInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch About Info
      .addCase(fetchAboutInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutInfo.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchAboutInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = aboutSlice.actions;
export default aboutSlice.reducer;