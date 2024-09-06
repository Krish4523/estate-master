import axios from "axios";

export async function submitForm({
  data,
  endpoint,
  setLoading,
  setErrorMessage,
  onSuccess,
  onError,
}) {
  try {
    setLoading(true);
    console.log(endpoint);
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    for (const [key, value] of Array.from(formData.entries())) {
      console.log(`${key}, ${value}`);
    }

    // Send a POST request with the form data
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Form submitted successfully:", response.data);

    // Call the onSuccess callback if provided
    if (onSuccess) {
      onSuccess(response.data);
    } 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      const message =
        error.response?.data?.error || "An unexpected error occurred.";
      setErrorMessage(message);
      console.error("Error:", message);
    } else {
      // Handle other errors
      setErrorMessage("An unexpected error occurred.");
      console.error("Error:", error);
    }

    // Call the onError callback if provided
    if (onError) {
      onError(error);
    }
  } finally {
    setLoading(false);
  }
}
