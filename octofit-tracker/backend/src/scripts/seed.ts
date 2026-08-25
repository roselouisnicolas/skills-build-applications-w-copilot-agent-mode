import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Activity } from '../models/activity.js';
import { Leaderboard } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

// Seed the octofit_db database with test data.
const seed = async (): Promise<void> => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Leaderboard.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.create([
    { username: 'maya.chen', email: 'maya.chen@example.com', displayName: 'Maya Chen', passwordHash: 'seeded-password-1' },
    { username: 'jon.bell', email: 'jon.bell@example.com', displayName: 'Jon Bell', passwordHash: 'seeded-password-2' },
    { username: 'sofia.rossi', email: 'sofia.rossi@example.com', displayName: 'Sofia Rossi', passwordHash: 'seeded-password-3' },
  ]);

  const teams = await Team.create([
    { name: 'Peak Performers', description: 'Consistent training and friendly competition.', color: '#ef8354', captain: users[0]._id, members: [users[0]._id, users[1]._id] },
    { name: 'Morning Momentum', description: 'Starting strong before the workday begins.', color: '#2d9d78', captain: users[2]._id, members: [users[2]._id] },
  ]);

  await User.bulkWrite([
    { updateOne: { filter: { _id: users[0]._id }, update: { team: teams[0]._id } } },
    { updateOne: { filter: { _id: users[1]._id }, update: { team: teams[0]._id } } },
    { updateOne: { filter: { _id: users[2]._id }, update: { team: teams[1]._id } } },
  ]);

  await Activity.create([
    { user: users[0]._id, type: 'running', durationMinutes: 34, distanceKm: 5.2, calories: 410, completedAt: new Date('2026-08-24T07:15:00Z') },
    { user: users[1]._id, type: 'strength', durationMinutes: 48, calories: 360, completedAt: new Date('2026-08-23T17:30:00Z') },
    { user: users[2]._id, type: 'cycling', durationMinutes: 52, distanceKm: 18.4, calories: 520, completedAt: new Date('2026-08-24T06:45:00Z') },
  ]);

  await Leaderboard.create([
    { user: users[0]._id, points: 1280, weeklyActivities: 5, currentStreak: 12 },
    { user: users[2]._id, points: 1145, weeklyActivities: 4, currentStreak: 8 },
    { user: users[1]._id, points: 960, weeklyActivities: 3, currentStreak: 5 },
  ]);

  await Workout.create([
    { title: 'Tempo Run Builder', category: 'cardio', difficulty: 'intermediate', durationMinutes: 35, exercises: [{ name: 'Easy warm-up', sets: 1, reps: 8 }, { name: 'Tempo intervals', sets: 4, reps: 3 }], targetMuscles: ['legs', 'core'] },
    { title: 'Full Body Foundations', category: 'strength', difficulty: 'beginner', durationMinutes: 30, exercises: [{ name: 'Bodyweight squat', sets: 3, reps: 12 }, { name: 'Push-up', sets: 3, reps: 8 }, { name: 'Plank', sets: 3, reps: 1 }], targetMuscles: ['legs', 'chest', 'core'] },
    { title: 'Desk Reset Flow', category: 'mobility', difficulty: 'beginner', durationMinutes: 15, exercises: [{ name: 'Hip opener', sets: 2, reps: 8 }, { name: 'Thoracic rotation', sets: 2, reps: 8 }], targetMuscles: ['hips', 'back', 'shoulders'] },
  ]);

  console.log('Seeded users, teams, activities, leaderboard, and workouts.');
};

try {
  await seed();
} finally {
  await disconnectDatabase();
}
