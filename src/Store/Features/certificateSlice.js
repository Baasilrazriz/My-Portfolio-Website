import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  setDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

// Helper function to ensure collection exists
const ensureCollectionExists = async () => {
  try {
    const portfolioRef = doc(db, 'portfolio', 'certificates');
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (!portfolioSnap.exists()) {
      await setDoc(portfolioRef, {
        initialized: true,
        createdAt: new Date().toISOString(),
        totalCertificates: 0,
        lastUpdated: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('Error ensuring collection exists:', error);
    throw error;
  }
};

// Async thunk for adding certificate
export const addCertificate = createAsyncThunk(
  'certificates/addCertificate',
  async (certificateData, { rejectWithValue }) => {
    try {
      // Ensure collection exists first
      await ensureCollectionExists();
      
      // Add certificate to the certificates collection
      const certificatesRef = collection(db, 'portfolio', 'certificates', 'items');
      const timestamp = new Date().toISOString();
      
      const docRef = await addDoc(certificatesRef, {
        ...certificateData,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return { 
        id: docRef.id, 
        ...certificateData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
    } catch (error) {
      console.error('Add certificate failed:', error);
      
      // More specific error handling
      if (error.code === 'permission-denied') {
        return rejectWithValue('Permission denied. Please check Firestore security rules.');
      } else if (error.code === 'unavailable') {
        return rejectWithValue('Service temporarily unavailable. Please try again.');
      } else if (error.code === 'invalid-argument') {
        return rejectWithValue('Invalid data provided. Please check your input.');
      }
      
      return rejectWithValue(error.message || 'Failed to add certificate');
    }
  }
);

// Async thunk for fetching certificates
export const fetchCertificates = createAsyncThunk(
  'certificates/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      // Ensure collection exists first
      await ensureCollectionExists();

      // Now fetch certificates from subcollection
      const certificatesRef = collection(db, 'portfolio', 'certificates', 'items');
      const q = query(certificatesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const certificates = [];
      querySnapshot.forEach((doc) => {
        certificates.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return certificates;
    } catch (error) {
      console.error('Fetch certificates failed:', error);
      
      if (error.code === 'permission-denied') {
        return rejectWithValue('Permission denied. Please check Firestore security rules.');
      }
      
      return rejectWithValue(error.message || 'Failed to fetch certificates');
    }
  }
);

// Async thunk for updating certificate
export const updateCertificate = createAsyncThunk(
  'certificates/updateCertificate',
  async ({ id, certificateData }, { rejectWithValue }) => {
    try {
      const certificateRef = doc(db, 'portfolio', 'certificates', 'items', id);
      
      // Check if certificate exists
      const certificateSnap = await getDoc(certificateRef);
      
      if (!certificateSnap.exists()) {
        throw new Error('Certificate not found');
      }

      const updatedData = {
        ...certificateData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(certificateRef, updatedData);
      
      return { 
        id, 
        ...certificateSnap.data(),
        ...updatedData 
      };
    } catch (error) {
      console.error('Update certificate failed:', error);
      
      if (error.code === 'permission-denied') {
        return rejectWithValue('Permission denied. Please check Firestore security rules.');
      }
      
      return rejectWithValue(error.message || 'Failed to update certificate');
    }
  }
);

// Async thunk for deleting certificate
export const deleteCertificate = createAsyncThunk(
  'certificates/deleteCertificate',
  async (certificateId, { rejectWithValue }) => {
    try {
      const certificateRef = doc(db, 'portfolio', 'certificates', 'items', certificateId);
      
      // Check if certificate exists before deleting
      const certificateSnap = await getDoc(certificateRef);
      
      if (!certificateSnap.exists()) {
        throw new Error('Certificate not found');
      }

      await deleteDoc(certificateRef);
      return certificateId;
    } catch (error) {
      console.error('Delete certificate failed:', error);
      
      if (error.code === 'permission-denied') {
        return rejectWithValue('Permission denied. Please check Firestore security rules.');
      }
      
      return rejectWithValue(error.message || 'Failed to delete certificate');
    }
  }
);

// Async thunk for initializing collection
export const initializeCertificatesCollection = createAsyncThunk(
  'certificates/initializeCollection',
  async (_, { rejectWithValue }) => {
    try {
      await ensureCollectionExists();
      
      return {
        initialized: true,
        message: 'Certificates collection initialized successfully'
      };
    } catch (error) {
      console.error('Initialize collection failed:', error);
      
      if (error.code === 'permission-denied') {
        return rejectWithValue('Permission denied. Please check Firestore security rules.');
      }
      
      return rejectWithValue(error.message || 'Failed to initialize collection');
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificates',
  initialState: {
    items: [],
    filteredCertificates: [],
    loading: false,
    error: null,
    success: null,
    initialized: false,
    totalCount: 0,
    uploading: false,
    filters: {
      category: 'All',
      searchTerm: ''
    },
    pagination: {
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 6
    },
    stats: {
      total: 0,
      categories: 0,
      recent: 0,
      verified: 0
    }
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
    updateStats: (state) => {
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      
      state.stats = {
        total: state.items.length,
        categories: [...new Set(state.items.map(cert => cert.category))].length,
        recent: state.items.filter(cert => {
          const certDate = new Date(cert.issueDate || cert.createdAt);
          return certDate > sixMonthsAgo;
        }).length,
        verified: state.items.filter(cert => cert.verified !== false).length
      };
    },
    applyFilters: (state) => {
      let filtered = [...state.items];
      
      // Apply category filter
      if (state.filters.category !== 'All') {
        filtered = filtered.filter(cert => cert.category === state.filters.category);
      }
      
      // Apply search filter
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(cert => 
          cert.name?.toLowerCase().includes(searchLower) ||
          cert.organization?.toLowerCase().includes(searchLower) ||
          cert.category?.toLowerCase().includes(searchLower)
        );
      }
      
      state.filteredCertificates = filtered;
      state.pagination.totalItems = filtered.length;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize Collection
      .addCase(initializeCertificatesCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeCertificatesCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.success = action.payload.message;
      })
      .addCase(initializeCertificatesCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Certificate
      .addCase(addCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
        state.success = 'Certificate added successfully!';
      })
      .addCase(addCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Certificates
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredCertificates = action.payload;
        state.totalCount = action.payload.length;
        state.initialized = true;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Certificate
      .addCase(updateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(cert => cert.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = 'Certificate updated successfully!';
      })
      .addCase(updateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Certificate
      .addCase(deleteCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(cert => cert.id !== action.payload);
        state.filteredCertificates = state.filteredCertificates.filter(cert => cert.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        state.success = 'Certificate deleted successfully!';
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilter, 
  setSearchTerm, 
  setPage, 
  clearError, 
  clearSuccess, 
  setUploading,
  updateStats,
  applyFilters
} = certificateSlice.actions;

export default certificateSlice.reducer;