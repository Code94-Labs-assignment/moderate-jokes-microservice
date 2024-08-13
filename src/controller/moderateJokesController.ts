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
  logger.info("Controller - login: Start", { body: JSON.stringify(req.body) });
  try {
    const response = await loginService(req.body);
    logger.info(`Controller - login: Success - ${JSON.stringify(response)}`);
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Controller - login: Error - ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getPendingJokes = async (req: Request, res: Response) => {
  logger.info("Controller - getPendingJokes: Start");
  try {
    const response = await getPendingJokesService();
    logger.info(
      `Controller - getPendingJokes: Success - ${JSON.stringify(response)}`,
    );
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Controller - getPendingJokes: Error - ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const updateJoke = async (req: Request, res: Response) => {
  logger.info("Controller - updateJoke: Start", {
    id: req.params.id,
    body: JSON.stringify(req.body),
  });
  try {
    const response = await updateJokeService(req.params.id, req.body);
    logger.info(
      `Controller - updateJoke: Success - ${JSON.stringify(response)}`,
    );
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Controller - updateJoke: Error - ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const approveJoke = async (req: Request, res: Response) => {
  logger.info(`Controller - approveJoke: Start - id: ${req.params.id}`);
  try {
    const response = await approveJokeService(req.params.id);
    logger.info(
      `Controller - approveJoke: Success - ${JSON.stringify(response)}`,
    );
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Controller - approveJoke: Error - ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const rejectJoke = async (req: Request, res: Response) => {
  logger.info(`Controller - rejectJoke: Start - id: ${req.params.id}`);
  try {
    const response = await rejectJokeService(req.params.id);
    logger.info(
      `Controller - rejectJoke: Success - ${JSON.stringify(response)}`,
    );
    res.status(response.code).send(response);
  } catch (error: any) {
    logger.error(`Controller - rejectJoke: Error - ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).send({ message: "Internal Server Error" });
  }
};
