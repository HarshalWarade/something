import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

export const fetchCompanies = createAsyncThunk("company/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${COMPANY_API_END_POINT}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch companies.");
  }
});

export const fetchCompanyById = createAsyncThunk("company/fetchCompanyById", async (companyId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${COMPANY_API_END_POINT}/${companyId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Company not found.");
  }
});

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
    companies: [],
    company: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies || []; 
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; 
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        const newCompany = action.payload.company;

        if (newCompany) {
          state.companies = [...state.companies, newCompany];
        }
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice1.reducer;
