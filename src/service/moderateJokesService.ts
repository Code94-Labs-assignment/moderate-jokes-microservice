import axios from "axios";
import { responseFormate } from "../models/response";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../jwt/jwt";
import { appConfig } from "../configs/appConfig";
import logger from "../utils/logger";

const submitJokesServiceUrl = appConfig.submitServiceUrl;
const deliverJokesServiceUrl = appConfig.deliverServiceUrl;

export const loginService = async (loginData: {
  email: string;
  password: string;
}): Promise<responseFormate> => {
  logger.info("Service - loginService: Start", {
    loginData: JSON.stringify(loginData),
  });
  try {
    const isAuthenticated = await authenticateUser(
      loginData.email,
      loginData.password,
    );
    if (isAuthenticated) {
      const token = await generateAccessToken({ email: loginData.email });
      const response = {
        code: 200,
        message: "Login successful",
        data: { token },
      };
      logger.info(
        `Service - loginService: Success - ${JSON.stringify(response)}`,
      );
      return response;
    } else {
      const response = { code: 401, message: "Unauthorized", data: null };
      logger.warn(
        `Service - loginService: Unauthorized - ${JSON.stringify(response)}`,
      );
      return response;
    }
  } catch (error: any) {
    logger.error(`Service - loginService: Error - ${error.message}`, {
      stack: error.stack,
    });
    return {
      code: 500,
      message: "Error during login",
      error: error.message,
    } as responseFormate;
  }
};

export const getPendingJokesService = async (): Promise<responseFormate> => {
  logger.info("Service - getPendingJokesService: Start");
  try {
    const response = await axios.get(`${submitJokesServiceUrl}/pending`);
    const result = {
      code: 200,
      message: "Pending jokes retrieved",
      data: response.data.data,
    };
    logger.info(
      `Service - getPendingJokesService: Success - ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error: any) {
    logger.error(`Service - getPendingJokesService: Error - ${error.message}`, {
      stack: error.stack,
    });
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
  logger.info("Service - updateJokeService: Start", {
    id,
    jokeData: JSON.stringify(jokeData),
  });
  try {
    const response = await axios.put(
      `${submitJokesServiceUrl}/${id}/update`,
      jokeData,
    );
    const result = {
      code: 200,
      message: "Joke updated successfully",
      data: response.data,
    };
    logger.info(
      `Service - updateJokeService: Success - ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error: any) {
    logger.error(`Service - updateJokeService: Error - ${error.message}`, {
      stack: error.stack,
    });
    return { code: 500, message: "Error updating joke", error: error.message };
  }
};

export const approveJokeService = async (
  id: string,
): Promise<responseFormate> => {
  logger.info(`Service - approveJokeService: Start - ${id}`);
  try {
    const approveResponse = await axios.put(
      `${appConfig.submitServiceUrl}/${id}/approve`,
    );
    logger.info(
      `Service - approveJokeService: Approve response - ${JSON.stringify(approveResponse.data)}`,
    );

    const savePayload = {
      setup: approveResponse.data.data.setup,
      punchline: approveResponse.data.data.punchline,
      type: approveResponse.data.data.type.name,
      author: approveResponse.data.data.author,
    };

    const deliverResponse = await axios.post(
      `${appConfig.deliverServiceUrl}/approve`,
      savePayload,
    );

    const result = {
      code: 201,
      message: "Joke approved and delivered successfully",
      data: deliverResponse.data,
    };
    logger.info(
      `Service - approveJokeService: Success - ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error: any) {
    logger.error(`Service - approveJokeService: Error - ${error.message}`, {
      stack: error.stack,
    });

    // Check if the error occurred during the approval step
    if (
      error.response &&
      error.config.url.includes(appConfig.submitServiceUrl)
    ) {
      return {
        code: 500,
        message: "Error approving joke",
        error: error.message,
      };
    }

    // Check if the error occurred during the delivery step
    if (
      error.response &&
      error.config.url.includes(appConfig.deliverServiceUrl)
    ) {
      return {
        code: 500,
        message: "Error saving joke to deliver service",
        error: error.message,
      };
    }

    // General error handling if the error source is unknown
    return {
      code: 500,
      message:
        "Unknown error occurred while processing the joke approval and delivery",
      error: error.message,
    };
  }
};

export const rejectJokeService = async (
  id: string,
): Promise<responseFormate> => {
  logger.info(`Service - rejectJokeService: Start - ${id}`);
  try {
    await axios.put(`${submitJokesServiceUrl}/${id}/reject`);
    const result = {
      code: 200,
      message: "Joke rejected successfully",
      data: null,
    };
    logger.info(
      `Service - rejectJokeService: Success - ${JSON.stringify(result)}`,
    );
    return result;
  } catch (error: any) {
    logger.error(`Service - rejectJokeService: Error - ${error.message}`, {
      stack: error.stack,
    });
    return { code: 500, message: "Error rejecting joke", error: error.message };
  }
};

const authenticateUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  logger.info("Service - authenticateUser: Start", { email });
  const users = [
    {
      email: "admin@admin.com",
      password: "$2b$10$Jff9yfGOCPxprurt5Dbfj.bArM3gKo2gsNbdotFV58ug7GQRE0QO.",
    },
  ];
  const user = users.find((user) => user.email === email);
  if (!user) {
    logger.warn("Service - authenticateUser: User not found", { email });
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  logger.info("Service - authenticateUser: Password validation", {
    isPasswordValid,
  });
  return isPasswordValid;
};
