// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Config } from '../../config/apiConfig';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   flatNumber: string;
//   wing: string;
//   floor?: string;
//   role: string;
//   isEmailVerified: boolean;
//   profileImage?: string;
//   lastLogin?: Date;
//   emergencyContact?: string;
//   vehicleDetails?: string;
// }

// interface UserState {
//   users: User[]; 
//   currentUser: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   users: [],
//   currentUser: null,
//   token: null,
//   loading: false,
//   error: null,
// };

// export const registerUser = createAsyncThunk(
//   'users/register',
//   async (
//     userData: { name: string; email: string; password: string; phone?: string; flatNumber: string; wing: string; floor?: string; emergencyContact?: string; vehicleDetails?: string },
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await axios.post(`${Config.API_BASE_URL}/auth/register`, userData);
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   },
// );

// export const loginUser = createAsyncThunk(
//   'users/login',
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${Config.API_BASE_URL}/auth/login`, credentials, {
//         timeout: 2000, 
//       });
//       if (!response.data.success) {
//         return rejectWithValue(response.data.message || 'Login failed');
//       }
//       console.log('Login response:', response.data);
//       return response.data.data;
//     } catch (error: any) {
//       console.error('Login error:', error.message, error.response?.data);
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Network error or server unreachable',
//       );
//     }
//   },
// );

// export const logoutUser = createAsyncThunk(
//   'users/logout',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { users } = getState() as { users: UserState };
//       const token = users.token;
//       if (token) {
//         await axios.post(`${Config.API_BASE_URL}/auth/logout`, {}, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       return null;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Logout failed');
//     }
//   },
// );

// const userSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     addUser: (state, action: PayloadAction<User>) => {
//       state.users.push(action.payload);
//     },
//     updateMembership: (
//       state,
//       action: PayloadAction<{ id: string; status: 'pending' | 'active' | 'inactive' }>,
//     ) => {
//       const user = state.users.find((u) => u.id === action.payload.id);
//       if (user) {
//         user.role = action.payload.status;
//       }
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
//         state.loading = false;
//         state.users.push(action.payload.user);
//         state.currentUser = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
//         console.log("stare =>", state);
//         console.log("stare =>", action.payload);
//         state.loading = false;
//         state.currentUser = action.payload.user;
//         state.token = action.payload.token;
//         if (!state.users.some((u) => u.id === action.payload.user.id)) {
//           state.users.push(action.payload.user);
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.currentUser = null;
//         state.token = null;
//         state.users = [];
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { addUser, updateMembership, clearError } = userSlice.actions;
// export default userSlice.reducer;




import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../../config/apiConfig';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  flatNumber: string;
  wing: string;
  floor?: string;
  role: string;
  isEmailVerified: boolean;
  profileImage?: string;
  lastLogin?: Date;
  emergencyContact?: string;
  vehicleDetails?: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Added for explicit auth status
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const registerUser = createAsyncThunk(
  'users/register',
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      flatNumber: string;
      wing: string;
      floor?: string;
      emergencyContact?: string;
      vehicleDetails?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${Config.API_BASE_URL}/auth/register`, userData);
      await AsyncStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  },
);

export const loginUser = createAsyncThunk(
  'users/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Config.API_BASE_URL}/auth/login`, credentials, {
        timeout: 2000,
      });
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }
      await AsyncStorage.setItem('token', response.data.data.token);
      console.log('Login response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Login error:', error.message, error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Network error or server unreachable',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { users } = getState() as { users: UserState };
      const token = users.token;
      if (token) {
        await axios.post(
          `${Config.API_BASE_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
      await AsyncStorage.removeItem('token');
      return null;
    } catch (error: any) {
      await AsyncStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  },
);

export const checkAuth = createAsyncThunk(
  'users/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${Config.API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Token verification failed');
      }
      return response.data.data; // Expect { user, token }
    } catch (error: any) {
      await AsyncStorage.removeItem('token');
      return rejectWithValue(error.message || 'Invalid or expired token');
    }
  },
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateMembership: (
      state,
      action: PayloadAction<{ id: string; status: 'pending' | 'active' | 'inactive' }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.role = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (!state.users.some((u) => u.id === action.payload.user.id)) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (!state.users.some((u) => u.id === action.payload.user.id)) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.token = null;
        state.isAuthenticated = false;
        state.users = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (!state.users.some((u) => u.id === action.payload.user.id)) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { addUser, updateMembership, clearError } = userSlice.actions;
export default userSlice.reducer;
