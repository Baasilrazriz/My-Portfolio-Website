import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

// Async thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projectsRef = collection(db, 'portfolio', 'projects', 'items');

      const q = query(
        projectsRef,
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projects = [];

      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching single project
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a new project
export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error adding project:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...projectData,
        updatedAt: new Date()
      });

      return {
        id,
        ...projectData,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      return projectId;
    } catch (error) {
      console.error('Error deleting project:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  projects: [],
  filteredProjects: [],
  currentProject: null,
  loading: false,
  error: null,
  filter: 'All',
  searchQuery: '',
  isModalOpen: false,
  editingProject: null
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.filteredProjects = filterProjects(state.projects, action.payload, state.searchQuery);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredProjects = filterProjects(state.projects, state.filter, action.payload);
    },
    openProjectModal: (state) => {
      state.isModalOpen = true;
      state.editingProject = null;
    },
    closeProjectModal: (state) => {
      state.isModalOpen = false;
      state.editingProject = null;
    },
    setEditingProject: (state, action) => {
      state.editingProject = action.payload;
      state.isModalOpen = true;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.filteredProjects = filterProjects(action.payload, state.filter, state.searchQuery);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProject = null;
      })

      // Add project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.filteredProjects = filterProjects(state.projects, state.filter, state.searchQuery);
        state.isModalOpen = false;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.filteredProjects = filterProjects(state.projects, state.filter, state.searchQuery);
        state.isModalOpen = false;
        state.editingProject = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.filteredProjects = filterProjects(state.projects, state.filter, state.searchQuery);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to filter projects
const filterProjects = (projects, filter, searchQuery) => {
  let filtered = projects;

  // Apply category filter
  if (filter !== 'All') {
    filtered = filtered.filter(project => project.category === filter);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(project =>
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.tech?.some(tech => tech.toLowerCase().includes(query)) ||
      project.category?.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const {
  setFilter,
  setSearchQuery,
  openProjectModal,
  closeProjectModal,
  setEditingProject,
  clearCurrentProject,
  clearError
} = projectSlice.actions;

export default projectSlice.reducer;