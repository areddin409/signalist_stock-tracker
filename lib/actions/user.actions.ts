'use server';

import { connectToDatabase } from '@/database/mongoose';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Get the current authenticated user (server-side)
 * Redirects to sign-in if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/sign-in');
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

/**
 * Retrieves all users from the database who have valid email addresses for newsletter purposes.
 *
 * This function connects to MongoDB, queries the 'user' collection, and returns a filtered list
 * of users with their essential information.
 *
 * @async
 * @function getAllUsersForNewsEmail
 *
 * @returns {Promise<Array<{id: string, email: string, name: string}>>} A promise that resolves to an array of user objects
 *          containing id, email, and name. Returns an empty array if an error occurs.
 *
 * @throws {Error} When database connection cannot be established
 *
 * @example
 * const users = await getAllUsersForNewsEmail();
 * // returns [{ id: "123", email: "user@example.com", name: "John Doe" }, ...]
 *
 * @remarks
 * - Only returns users who have both email and name fields populated
 * - Uses either user.id or converts _id to string for the id field
 * - Includes error handling that logs to console and returns empty array on failure
 */
export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error('Database connection not established');

    const users = await db
      .collection('user')
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      )
      .toArray();

    return users
      .filter(user => user.email && user.name)
      .map(user => ({
        id: user.id || user._id.toString() || '',
        email: user.email,
        name: user.name,
      }));
  } catch (error) {
    console.error('Error fetching users for news email:', error);
    return [];
  }
};
