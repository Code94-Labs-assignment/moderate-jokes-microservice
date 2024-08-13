import axios from "axios";
import { responseFormate } from "../models/response";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../jwt/jwt";

const submitJokesServiceUrl = "http://submit-jokes-microservice-url/api/jokes"; // Replace with actual URL
const deliverJokesServiceUrl =
  "http://deliver-jokes-microservice-url/api/jokes"; // Replace with actual URL

export const loginService = async (loginData: {
  email: string;
  password: string;
}): Promise<responseFormate> => {
  try {
    const isAuthenticated = await authenticateUser(
      loginData.email,
      loginData.password,
    );
    if (isAuthenticated) {
      const token = await generateAccessToken({ email: loginData.email });
      return {
        code: 200,
        message: "Login successful",
        data: { token },
      } as responseFormate;
    } else {
      return { code: 401, message: "Unauthorized", data: null };
    }
  } catch (error: any) {
    return {
      code: 500,
      message: "Error during login",
      error: error.message,
    } as responseFormate;
  }
};

export const getPendingJokesService = async (): Promise<responseFormate> => {
  try {
    const response = await axios.get(`${submitJokesServiceUrl}`);
    return {
      code: 200,
      message: "Pending jokes retrieved",
      data: response.data,
    };
  } catch (error: any) {
    return {
      code: 500,
      message: "Error fetching pending jokes",
      error: error.message,
    };
  }
};

export const updateJokeService = async (
  id: string,
  jokeData: any,
): Promise<responseFormate> => {
  try {
    const response = await axios.put(
      `${submitJokesServiceUrl}/${id}`,
      jokeData,
    );
    return {
      code: 200,
      message: "Joke updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return { code: 500, message: "Error updating joke", error: error.message };
  }
};

export const approveJokeService = async (
  id: string,
): Promise<responseFormate> => {
  try {
    const jokeResponse = await axios.get(`${submitJokesServiceUrl}/${id}`);
    const approvedJoke = jokeResponse.data;

    const deliverResponse = await axios.post(
      `${deliverJokesServiceUrl}`,
      approvedJoke,
    );

    await axios.delete(`${submitJokesServiceUrl}/${id}`);

    return {
      code: 201,
      message: "Joke approved and delivered successfully",
      data: deliverResponse.data,
    };
  } catch (error: any) {
    return { code: 500, message: "Error approving joke", error: error.message };
  }
};

export const rejectJokeService = async (
  id: string,
): Promise<responseFormate> => {
  try {
    await axios.delete(`${submitJokesServiceUrl}/${id}`);
    return { code: 200, message: "Joke rejected successfully", data: null };
  } catch (error: any) {
    return { code: 500, message: "Error rejecting joke", error: error.message };
  }
};

const authenticateUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  const users = [
    {
      email: "admin@admin.com",
      password: "$2b$10$Jff9yfGOCPxprurt5Dbfj.bArM3gKo2gsNbdotFV58ug7GQRE0QO.", // bcrypt hash of "admin123"
    },
  ];
  const user = users.find((user) => user.email === email);
  if (!user) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};
