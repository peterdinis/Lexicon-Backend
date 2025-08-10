import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create a user with faker data
  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: faker.internet.password(), 
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      photoUrl: faker.image.avatar(),
    },
  });

  // Create a workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: faker.company.name(),
    },
  });

  // Create a page
  const page = await prisma.page.create({
    data: {
      title: faker.lorem.words(3),
      isDatabase: faker.datatype.boolean(),
      workspaceId: workspace.id,
      ownerId: user.id,
      emoji: faker.helpers.arrayElement(['📄', '📚', '📝', '📅', '📌']),
      sortPosition:faker.number.int({ min: 0, max: 100 }),
      inTrash: false,
    },
  });

  // Create multiple content blocks
  await prisma.content.createMany({
    data: [
      {
        type: 'heading',
        data: { text: faker.lorem.sentence() },
        order: 1,
        pageId: page.id,
      },
      {
        type: 'paragraph',
        data: { text: faker.lorem.paragraph() },
        order: 2,
        pageId: page.id,
      },
      {
        type: 'todo',
        data: { text: faker.lorem.sentence(), checked: faker.datatype.boolean() },
        order: 3,
        pageId: page.id,
      },
    ],
  });

  // Create a property
  const property = await prisma.property.create({
    data: {
      name: faker.helpers.arrayElement(['Status', 'Priority', 'Category']),
      type: 'select',
      pageId: page.id,
    },
  });

  // Create property values for the property
  const options = ['To Do', 'In Progress', 'Done', 'On Hold'];
  for (const option of options) {
    await prisma.propertyValue.create({
      data: {
        pageId: page.id,
        propertyId: property.id,
        value: { option },
      },
    });
  }

  // Create a calendar event
  const startDate = faker.date.soon();
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

  await prisma.calendarEvent.create({
    data: {
      title: faker.lorem.words(4),
      start: startDate,
      end: endDate,
      pageId: page.id,
      userId: user.id,
    },
  });

  // Create some tasks
  const statuses = ['todo', 'in_progress', 'done', 'canceled'] as const;
  for (let i = 0; i < 5; i++) {
    await prisma.task.create({
      data: {
        title: faker.lorem.sentence(5),
        description: faker.lorem.sentences(2),
        status: faker.helpers.arrayElement(statuses),
        dueDate: faker.date.soon({
          days: 10
        }),
        completedAt: null,
        pageId: page.id,
        assigneeId: user.id,
      },
    });
  }

  console.log('Seeding complete with faker data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
