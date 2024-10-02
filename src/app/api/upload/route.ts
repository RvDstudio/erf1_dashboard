import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema'; // Import the users table from your schema
import { eq } from 'drizzle-orm';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  const fileUrl = `/uploads/${fileName}`;

  // Save the file locally
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, fileBuffer);

  // Update the user's profile image URL in the database
  const updatedUser = await db
    .update(users) // Use the users table here
    .set({ image: fileUrl }) // Update the image column
    .where(eq(users.id, session.user.id)); // Match the user ID

  if (!updatedUser) {
    return NextResponse.json({ error: 'Failed to update profile image' }, { status: 500 });
  }

  return NextResponse.json({ success: true, imageUrl: fileUrl });
}
