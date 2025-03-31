import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

// ✅ Fetch all companies
export const fetchCompanies = createAsyncThunk("company/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${COMPANY_API_END_POINT}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch companies.");
  }
});

// ✅ Fetch a single company by ID
export const fetchCompanyById = createAsyncThunk("company/fetchCompanyById", async (companyId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${COMPANY_API_END_POINT}/${companyId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Company not found.");
  }
});

// ✅ Register a new company
export const registerCompany = createAsyncThunk("company/registerCompany", async (companyData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${COMPANY_API_END_POINT}/register`, companyData, { withCredentials: true });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to register company.");
  }
});

const companySlice1 = createSlice({
  name: "company1",
  initialState: {
    companies: [], // ✅ Always start with an empty array
    company: null, // ✅ Store single company data
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies || []; // ✅ Ensure it's an array
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch a single company by ID
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; // ✅ Store only one company
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Register a new company
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        const newCompany = action.payload.company;

        if (newCompany) {
          state.companies = [...state.companies, newCompany]; // ✅ Ensure immutability
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice1.reducer;
