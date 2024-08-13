import { Request, Response } from "express";
import {
  loginService,
  getPendingJokesService,
  approveJokeService,
  rejectJokeService,
  updateJokeService,
} from "../service/moderateJokesService";
import logger from "../utils/logger";

export const login = async (req: Request, res: Response) => {
  try {
    const response = await loginService(req.body);
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getPendingJokes = async (req: Request, res: Response) => {
  try {
    const response = await getPendingJokesService();
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Error fetching pending jokes: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const updateJoke = async (req: Request, res: Response) => {
  try {
    const response = await updateJokeService(req.params.id, req.body);
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Error updating joke: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const approveJoke = async (req: Request, res: Response) => {
  try {
    const response = await approveJokeService(req.params.id);
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Error approving joke: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const rejectJoke = async (req: Request, res: Response) => {
  try {
    const response = await rejectJokeService(req.params.id);
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Error rejecting joke: ${error.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
