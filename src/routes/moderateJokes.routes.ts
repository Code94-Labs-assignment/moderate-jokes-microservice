import { Router } from "express";
import {
  login,
  getPendingJokes,
  approveJoke,
  rejectJoke,
  updateJoke,
} from "../controller/moderateJokesController";
import { isAuth } from "../middleware/isAuth";

const moderateJokesRouter = Router();

/**
 * @swagger
 * /moderate-jokes/auth/login:
 *   post:
 *     summary: Moderator login
 *     description: Authenticate a moderator using email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@admin.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */
moderateJokesRouter.post("/auth/login", login);

/**
 * @swagger
 * /moderate-jokes/pending:
 *   get:
 *     summary: Get pending jokes for moderation
 *     description: Retrieve a list of pending jokes that need moderation.
 *     tags:
 *       - Jokes
 *     responses:
 *       200:
 *         description: A list of pending jokes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60c72b2f4f1a2c001c8e4f34"
 *                   setup:
 *                     type: string
 *                     example: "Why did the chicken cross the road?"
 *                   punchline:
 *                     type: string
 *                     example: "To get to the other side!"
 *                   type:
 *                     type: string
 *                     example: "Dad Jokes"
 *                   author:
 *                     type: string
 *                     example: "Anonymous"
 */
moderateJokesRouter.get("/pending", isAuth, getPendingJokes);

/**
 * @swagger
 * /moderate-jokes/{id}:
 *   put:
 *     summary: Update a joke
 *     description: Edit a joke's content or type.
 *     tags:
 *       - Jokes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The joke ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setup:
 *                 type: string
 *                 example: "Updated setup"
 *               punchline:
 *                 type: string
 *                 example: "Updated punchline"
 *               type:
 *                 type: string
 *                 example: "Programming"
 *     responses:
 *       200:
 *         description: Joke updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
moderateJokesRouter.put("/:id", isAuth, updateJoke);

/**
 * @swagger
 * /moderate-jokes/approve/{id}:
 *   post:
 *     summary: Approve a joke
 *     description: Approve a joke and submit it to the Deliver Jokes microservice.
 *     tags:
 *       - Jokes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The joke ID
 *     responses:
 *       201:
 *         description: Joke approved successfully
 *       500:
 *         description: Internal server error
 */
moderateJokesRouter.post("/approve/:id", isAuth, approveJoke);

/**
 * @swagger
 * /moderate-jokes/reject/{id}:
 *   delete:
 *     summary: Reject a joke
 *     description: Reject a joke and delete it from the Submit Jokes microservice.
 *     tags:
 *       - Jokes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The joke ID
 *     responses:
 *       200:
 *         description: Joke rejected successfully
 *       500:
 *         description: Internal server error
 */
moderateJokesRouter.delete("/reject/:id", isAuth, rejectJoke);

export default moderateJokesRouter;
