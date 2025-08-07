// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: 'hashed-password', // Use hashed passwords in production!
      name: 'John',
      lastName: 'Doe',
      photoUrl: 'https://example.com/avatar.png',
    },
  });

  // Create a workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Personal Workspace',
    },
  });

  // Create a page
  const page = await prisma.page.create({
    data: {
      title: 'Welcome Page',
      isDatabase: false,
      workspaceId: workspace.id,
      ownerId: user.id,
    },
  });

  // Create content
  await prisma.content.createMany({
    data: [
      {
        type: 'heading',
        data: { text: 'Welcome to your new workspace!' },
        order: 1,
        pageId: page.id,
      },
      {
        type: 'paragraph',
        data: { text: 'Start adding blocks and explore features.' },
        order: 2,
        pageId: page.id,
      },
    ],
  });

  // Create a property
  const property = await prisma.property.create({
    data: {
      name: 'Status',
      type: 'select',
      pageId: page.id,
    },
  });

  // Create property value
  await prisma.propertyValue.create({
    data: {
      pageId: page.id,
      propertyId: property.id,
      value: { option: 'In Progress' },
    },
  });

  // Create a calendar event
  await prisma.calendarEvent.create({
    data: {
      title: 'Kickoff Meeting',
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000),
      pageId: page.id,
      userId: user.id,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
