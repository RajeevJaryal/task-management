import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = {
        uid: cred.user.uid,
        name: data.name,
        email: data.email,
        role: "",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", cred.user.uid), user);

      return {
        ...user,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const snap = await getDoc(doc(db, "users", cred.user.uid));

      const user = snap.exists()
        ? snap.data()
        : {
            uid: cred.user.uid,
            email: cred.user.email,
            name: "User",
            role: "",
          };

      if (user.role) {
        localStorage.setItem("role", user.role);
      }

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  "auth/load",
  async (_, { rejectWithValue }) => {
    try {
      const firebaseUser = await new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
          unsub();
          resolve(user);
        });
      });

      if (!firebaseUser) return null;

      const snap = await getDoc(doc(db, "users", firebaseUser.uid));

      const user = snap.exists()
        ? snap.data()
        : {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: "User",
            role: "",
          };

      if (user.role) {
        localStorage.setItem("role", user.role);
      }

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setUserRole = createAsyncThunk(
  "auth/role",
  async ({ uid, role }, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().auth.user;

      const updatedUser = {
        ...currentUser,
        role,
      };

      await setDoc(doc(db, "users", uid), updatedUser, { merge: true });

      localStorage.setItem("role", role);

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.clear();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
      })

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(setUserRole.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(setUserRole.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      }),
});

export default slice.reducer;