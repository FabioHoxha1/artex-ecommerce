import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const updateUserProfile = createAsyncThunk(
  "authSlice/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""

      if (!LoginToken) {
        return rejectWithValue("Please login to update your profile")
      }

      const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
      const response = await axios.patch(`${serverUrl}/api/v1/user/profile`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${LoginToken}`,
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update profile")
    }
  },
)
