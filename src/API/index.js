import axiosInstance from "../Context/axiosInstance.js";

// LOGIN USER

export async function loginUser({ email, password }) {
  try {
    const response = await axiosInstance.post("/users/auth", { email, password });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user || {}));

      if (response.data.user?.user_id) {
        localStorage.setItem("user_id", response.data.user.user_id);
      }
    }

    return response.data; 
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Network error. Please try again later."
    };
  }
}


// CREATE SUPERVISOR
export async function createSupervisor(newSupervisor) {
  try {
    const response = await axiosInstance.post("/users/create", newSupervisor);
    if (Array.isArray(response.data)) {
      const [data, statusCode] = response.data;

      return {
        data,
        status: statusCode, 
      };
    }

    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("Supervisor create error:", error);

    return {
      data: {
        success: false,
        message:
          error.response?.data?.[0]?.message ||
          error.response?.data?.message ||
          error.message ||
          "Network error while creating supervisor.",
      },
      status: error.response?.status || 500,
    };
  }
}


// RELEASE TICKET
export async function releaseTicket({ surveyId, notes }) {
  try {
    const response = await axiosInstance.post("/tickets/create_ticket", {
      survey_id: surveyId,
      type: "correction",
      notes,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error releasing ticket.",
    };
  }
}

// GET ALL SURVEYS
export async function getAllSurveys() {
  try {
    const response = await axiosInstance.get("/survey/get_all");
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }
}

// GET ALL TICKETS

export async function getAllTickets() {
  try {
    const response = await axiosInstance.get("/tickets/");

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching tickets.",
    };
  }
}


// APPROVE SURVEY
export async function approveSurvey(surveyId) {
  try {
    const response = await axiosInstance.patch(`/survey/${surveyId}/approve`, {});
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error approving survey.",
    };
  }
}

// CLOSE TICKET
export async function closeTicket(ticketId) {
  try {
    const response = await axiosInstance.patch(`/tickets/${ticketId}/close`, {
      closed_at: new Date().toISOString(),
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Error closing ticket.",
    };
  }
}


// GET Massage
export async function getMessages(ticketId, token) {
  try {
    const response = await axiosInstance.get(`/tickets/${ticketId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching messages:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching messages.",
    };
  }
}

// POST Massage
export async function postMessage(ticketId, message, token) {
  try {
    const response = await axiosInstance.post(
      `/tickets/${ticketId}/messages`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Error sending message.",
    };
  }
}

// Supervisors get
export const getSupervisors = async () => {
  try {
    const response = await axiosInstance.get("/users/?role=Supervisor");
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    throw error;
  }
};

// get survoyers
export const getSurveyors = async () => {
  try {
    const response = await axiosInstance.get("/users/?role=Surveyor");
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching surveyors:", error);
    throw error;
  }
};

// GET TICKET ID DETAILS (user info new/old data)
export async function getSurveyDetails(ticketId) {
  try {
    const response = await axiosInstance.get(`/tickets/${ticketId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching survey details:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Error fetching survey details.",
    };
  }
}



// GET ROLES
export async function getRoles() {
  try {
    const response = await axiosInstance.get("/users/roles"); 
    const data = Array.isArray(response.data) ? response.data : [];
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch roles.",
    };
  }
}

// GET ALL CONSUMER BY ID
export async function getConsumers() {
  try {
    const response = await axiosInstance.get("/consumers");
    return response.data; 
  } catch (error) {
    console.error("Error fetching consumers:", error);
    throw new Error(error.response?.data?.message || "Error fetching consumers.");
  }
}




