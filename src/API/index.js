
import axiosInstance from "../Context/axiosInstance.js";

// LOGIN USER
export async function loginUser({ email, password }) {
  try {
    const response = await axiosInstance.post("/users/auth", { email, password });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user || {}));
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error. Please try again later.");
  }
}

// CREATE SUPERVISOR
export async function createSupervisor(newSupervisor) {
  try {
    const response = await axiosInstance.post("/users/create", newSupervisor);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Network error while creating supervisor.",
    };
  }
}

// RELEASE TICKET
export async function releaseTicket({ surveyorId, notes }) {
  try {
    const token = localStorage.getItem("authToken");

    const response = await axiosInstance.post(
      "/tickets/create_ticket",
      {
        survey_id: surveyorId,
        type: "correction",
        notes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error releasing ticket.",
    };
  }
}
