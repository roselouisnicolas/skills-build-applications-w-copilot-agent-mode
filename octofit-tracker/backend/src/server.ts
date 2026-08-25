import express from 'express';
import { Router } from 'express';
import { connectDatabase } from './config/database.js';
import { Activity } from './models/activity.js';
import { Leaderboard } from './models/leaderboard.js';
import { Team } from './models/team.js';
import { User } from './models/user.js';
import { Workout } from './models/workout.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

const apiRouter = Router();

app.use(express.json());

apiRouter.get('/users/', async (_request, response) => {
  response.json(await User.find().populate('team', 'name').lean());
});

apiRouter.get('/teams/', async (_request, response) => {
  response.json(await Team.find().populate('captain', 'displayName').populate('members', 'displayName').lean());
});

apiRouter.get('/activities/', async (_request, response) => {
  response.json(await Activity.find().populate('user', 'displayName username').sort({ completedAt: -1 }).lean());
});

apiRouter.get('/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().populate('user', 'displayName username').sort({ points: -1 }).lean());
});

apiRouter.get('/workouts/', async (_request, response) => {
  response.json(await Workout.find().sort({ difficulty: 1, title: 1 }).lean());
});

apiRouter.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Unable to load data' });
});

app.use('/api', apiRouter);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', baseUrl });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening at ${baseUrl}`);
    });
  } catch (error) {
    console.error('Unable to connect to octofit_db:', error);
    process.exit(1);
  }
}

void startServer();