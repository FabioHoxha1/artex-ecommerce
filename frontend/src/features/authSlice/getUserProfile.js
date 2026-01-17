import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getUserProfile = createAsyncThunk("authSlice/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""

    if (!LoginToken) {
      return rejectWithValue("Please login to view your profile")
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
    const response = await axios.get(`${serverUrl}/api/v1/user/profile`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${LoginToken}`,
      },
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failed to fetch profile")
  }
})
