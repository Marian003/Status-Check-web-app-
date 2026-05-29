import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

// Demo password shared by all seeded accounts.
const DEMO_PASSWORD = "password123";

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 10);

  const usersData = [
    { email: "olena@example.com", name: "Олена Коваленко" },
    { email: "ivan@example.com", name: "Іван Петренко" },
    { email: "maria@example.com", name: "Марія Шевченко" },
    { email: "andriy@example.com", name: "Андрій Бондар" },
  ];

  const users = await Promise.all(
    usersData.map((user) =>
      db.user.upsert({
        where: { email: user.email },
        update: { name: user.name, passwordHash },
        create: { ...user, passwordHash },
      }),
    ),
  );

  const projectNames = ["Маркетинг", "Розробка", "Продажі", "HR"];
  const projects = await Promise.all(
    projectNames.map((name) =>
      db.project.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );

  // Reset commitments so reseeding stays idempotent.
  await db.commitment.deleteMany();

  const [olena, ivan, maria, andriy] = users;
  const [marketing, dev, sales, hr] = projects;

  const now = new Date();
  const at = (days: number, hours = 9, minutes = 0) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  const allDay = (days: number) => at(days, 0, 0);

  await db.commitment.createMany({
    data: [
      // Overdue TO_CHECK -> displayed as derived EXPIRED.
      {
        title: "Здати квартальний звіт",
        description: "Перевірити, що Іван здав звіт вчасно",
        authorId: olena.id,
        projectId: marketing.id,
        executorId: ivan.id,
        checkerId: olena.id,
        deadline: at(-2, 12),
        isAllDay: false,
        status: "TO_CHECK",
      },
      // Future TO_CHECK, all-day.
      {
        title: "Узгодити макети лендингу",
        description: "Перевірити фінальні макети перед запуском",
        authorId: olena.id,
        projectId: marketing.id,
        executorId: maria.id,
        checkerId: olena.id,
        deadline: allDay(3),
        isAllDay: true,
        status: "TO_CHECK",
      },
      // TO_CHECK with a concrete time, today.
      {
        title: "Релізнути v2.0",
        description: "Андрій має задеплоїти реліз у проді",
        authorId: ivan.id,
        projectId: dev.id,
        executorId: andriy.id,
        checkerId: ivan.id,
        deadline: at(0, 16),
        isAllDay: false,
        status: "TO_CHECK",
      },
      // DONE.
      {
        title: "Провести співбесіду",
        description: "Кандидат на позицію QA",
        authorId: maria.id,
        projectId: hr.id,
        executorId: maria.id,
        checkerId: andriy.id,
        deadline: at(-5, 10),
        isAllDay: false,
        status: "DONE",
      },
      // NOT_ACTUAL.
      {
        title: "Оновити прайс-лист",
        description: "Відкладено до наступного кварталу",
        authorId: andriy.id,
        projectId: sales.id,
        executorId: ivan.id,
        checkerId: andriy.id,
        deadline: allDay(7),
        isAllDay: true,
        status: "NOT_ACTUAL",
      },
      // Future TO_CHECK with time.
      {
        title: "Підготувати презентацію для клієнта",
        description: "Фінальна версія для зустрічі",
        authorId: olena.id,
        projectId: sales.id,
        executorId: maria.id,
        checkerId: ivan.id,
        deadline: at(10, 14, 30),
        isAllDay: false,
        status: "TO_CHECK",
      },
      // IDEAS_BACKLOG, no deadline -> backlog panel.
      {
        title: "Ідея: реферальна програма",
        description: "Обговорити можливість запуску",
        authorId: ivan.id,
        projectId: marketing.id,
        executorId: andriy.id,
        checkerId: olena.id,
        deadline: null,
        isAllDay: true,
        status: "IDEAS_BACKLOG",
      },
      // TO_CHECK but no deadline -> backlog panel.
      {
        title: "Дослідити нову CRM",
        description: "Без конкретного терміну виконання",
        authorId: maria.id,
        projectId: sales.id,
        executorId: maria.id,
        checkerId: andriy.id,
        deadline: null,
        isAllDay: true,
        status: "TO_CHECK",
      },
    ],
  });

  console.log(
    `Seeded ${users.length} users, ${projects.length} projects and demo commitments.`,
  );
  console.log(`Demo login: olena@example.com / ${DEMO_PASSWORD}`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
