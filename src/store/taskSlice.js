import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const norm = (d) => {
  const x = d.data();

  return {
    id: d.id,
    ...x,
    createdAt:
      x.createdAt?.toDate?.()?.toISOString() ||
      x.createdAt ||
      new Date().toISOString(),
    updatedAt:
      x.updatedAt?.toDate?.()?.toISOString() ||
      x.updatedAt ||
      new Date().toISOString(),
  };
};

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const snap = await getDocs(
    query(collection(db, "tasks"), orderBy("createdAt", "desc"))
  );

  return snap.docs.map(norm);
});

export const fetchUsers = createAsyncThunk("tasks/fetchUsers", async () => {
  const snap = await getDocs(
    query(collection(db, "users"), where("role", "==", "user"))
  );

  return snap.docs.map((d) => ({
    uid: d.id,
    ...d.data(),
  }));
});

export const createTask = createAsyncThunk("tasks/create", async (task) => {
  const taskCode = "#TSK" + Math.floor(Math.random() * 900 + 100);

  const payload = {
    ...task,
    taskCode,
    status: "pending",
    description: task.description || "No description provided for this task.",
    history: [
      { text: "Task created by Admin", date: new Date().toISOString() },
      { text: "Task not started", date: new Date().toISOString() },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "tasks"), payload);

  return {
    id: ref.id,
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, changes }) => {
    await updateDoc(doc(db, "tasks", id), {
      ...changes,
      updatedAt: serverTimestamp(),
    });

    return {
      id,
      changes: {
        ...changes,
        updatedAt: new Date().toISOString(),
      },
    };
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/status",
  async ({ id, status }, { getState }) => {
    const task = getState().tasks.items.find((x) => x.id === id);

    const history = [
      ...(task?.history || []),
      {
        text: `Status updated to ${status}`,
        date: new Date().toISOString(),
      },
    ];

    await updateDoc(doc(db, "tasks", id), {
      status,
      history,
      updatedAt: serverTimestamp(),
    });

    return {
      id,
      changes: {
        status,
        history,
        updatedAt: new Date().toISOString(),
      },
    };
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await deleteDoc(doc(db, "tasks", id));
  return id;
});

const slice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const task = state.items.find((x) => x.id === action.payload.id);
        if (task) Object.assign(task, action.payload.changes);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.items.find((x) => x.id === action.payload.id);
        if (task) Object.assign(task, action.payload.changes);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      }),
});

export default slice.reducer;