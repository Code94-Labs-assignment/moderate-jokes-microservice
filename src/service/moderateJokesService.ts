import { JokeRepository } from "../repository/jokeRepository";
import { responseFormate } from "../models/response";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../jwt/jwt";
const jokeRepo = new JokeRepository();

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
    const jokes = await jokeRepo.getPendingJokes();
    return { code: 200, message: "Pending jokes retrieved", data: jokes };
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
    const updatedJoke = await jokeRepo.updateJoke(id, jokeData);
    return {
      code: 200,
      message: "Joke updated successfully",
      data: updatedJoke,
    };
  } catch (error: any) {
    return { code: 500, message: "Error updating joke", error: error.message };
  }
};

export const approveJokeService = async (
  id: string,
): Promise<responseFormate> => {
  try {
    const approvedJoke = await jokeRepo.approveJoke(id);
    return {
      code: 201,
      message: "Joke approved successfully",
      data: approvedJoke,
    };
  } catch (error: any) {
    return { code: 500, message: "Error approving joke", error: error.message };
  }
};

export const rejectJokeService = async (
  id: string,
): Promise<responseFormate> => {
  try {
    await jokeRepo.rejectJoke(id);
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

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

async function hashPassword() {
  const password = "admin123"; // Replace with your password
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
}
