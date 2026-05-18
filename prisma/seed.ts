import { Role, Status, BlogStatus, CategoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Helper to generate random integers
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random elements from an array
const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing database to prevent unique constraint errors during seeding
  console.log("🧹 Clearing existing data...");
  await prisma.logTraffic.deleteMany();
  await prisma.userFollow.deleteMany();
  await prisma.blogComment.deleteMany();
  await prisma.savedBlog.deleteMany();
  await prisma.blogLike.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Categories
  console.log("📚 Creating Categories...");
  const categoriesToCreate = [
    {
      name: "Technology",
      description: "All things tech, coding, and software.",
    },
    {
      name: "Lifestyle",
      description: "Daily habits, productivity, and life advice.",
    },
    {
      name: "Finance",
      description: "Personal finance, investing, and markets.",
    },
    { name: "Health", description: "Mental and physical wellbeing." },
    {
      name: "Design",
      description: "UI/UX, graphic design, and aesthetics.",
      status: CategoryStatus.HIDDEN,
    },
  ];

  const categories = await Promise.all(
    categoriesToCreate.map((cat) => prisma.category.create({ data: cat }))
  );

  // 3. Seed Users
  console.log("👥 Creating Users...");
  const baseUsers = [
    { name: "Alice Admin", email: "alice@example.com", role: Role.ADMIN },
    { name: "Bob Blogger", email: "bob@example.com", role: Role.USER },
    { name: "Charlie Code", email: "charlie@example.com", role: Role.USER },
    { name: "Diana Design", email: "diana@example.com", role: Role.USER },
    {
      name: "Eve Suspended",
      email: "eve@example.com",
      role: Role.USER,
      status: Status.SUSPENDED,
    },
    { name: "Frank Finance", email: "frank@example.com", role: Role.USER },
    { name: "Grace Writer", email: "grace@example.com", role: Role.USER },
    { name: "Hank Hacker", email: "hank@example.com", role: Role.USER },
  ];

  const users = await Promise.all(
    baseUsers.map((user, index) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: "hashed_password_123",
          bio: `Hello, I am ${user.name}. I love writing and reading blogs!`,
          headline: `${
            user.role === Role.ADMIN ? "Administrator" : "Enthusiastic Blogger"
          }`,
          role: user.role,
          status: user.status || Status.ACTIVE,
          image: `https://i.pravatar.cc/150?u=${index}`,
        },
      })
    )
  );

  // 4. Seed Blogs (50+ Blogs)
  console.log("📝 Creating 50+ Blogs...");
  const blogTitles = [
    // Tech
    "10 Tips for Better React Code",
    "Why Next.js is the Future",
    "Understanding PostgreSQL Indexing",
    "Serverless vs Containers: What to Choose",
    "Prisma ORM Best Practices for 2026",
    "Getting Started with TypeScript",
    "How to Build a Scalable Node.js API",
    "Demystifying GraphQL",
    "The Ultimate Guide to Docker",
    "Mastering Git Workflows",
    "Web Accessibility Essentials",
    "Understanding the Event Loop in JavaScript",
    "Microservices Architecture Explained",
    // Lifestyle
    "A Guide to Minimalist Living",
    "How to Manage Developer Burnout",
    "Building a Startup in a Weekend",
    "The Art of Writing Good Technical Docs",
    "My Journey to Senior Engineer",
    "5 Productivity Hacks",
    "Digital Nomad: Working from Anywhere",
    "The Importance of Deep Work",
    "Creating a Morning Routine",
    "How to Say No to Distractions",
    "Balancing Full-Time Job and Side Hustles",
    "Reading 50 Books a Year",
    // Finance
    "Mastering Personal Finance in 2026",
    "Investing 101: Where to Start",
    "Understanding Crypto Cycles",
    "How to Create a Monthly Budget",
    "Passive Income Ideas for Developers",
    "The FIRE Movement Explained",
    "Stock Market Basics for Beginners",
    "Managing Taxes as a Freelancer",
    "Emergency Funds: How Much?",
    "Real Estate Investing for Dummies",
    "Credit Score Myths Debunked",
    // Health
    "How to Stay Healthy as a Developer",
    "Ergonomics for Desk Workers",
    "The Impact of Sleep on Coding",
    "10-Minute Desk Stretches",
    "Mental Health in the Tech Industry",
    "Eating Healthy on a Busy Schedule",
    "The Benefits of Regular Exercise",
    "How to Reduce Eye Strain",
    "Meditation for Overthinkers",
    "Building Better Habits",
    "Hydration and Cognitive Function",
    // Design
    "Understanding UI/UX Principles",
    "Top 5 Design Trends for 2026",
    "Color Theory Basics",
    "Typography in Web Design",
    "How to Create Accessible Color Palettes",
    "Figma Tips and Tricks",
    "Designing for Mobile First",
    "The Psychology of Shapes in Logos",
    "Whitespace is Your Friend",
    "Improving User Retention through UX",
    "Prototyping Your First App",
  ];

  const blogs = [];
  for (let i = 0; i < blogTitles.length; i++) {
    const title = blogTitles[i];
    const author = getRandomElement(users);
    const category = getRandomElement(categories);

    // Roughly 80% Published, 10% Draft, 10% Blocked
    let status: any = BlogStatus.PUBLISHED;
    if (i % 10 === 0) status = BlogStatus.DRAFT;
    else if (i % 10 === 1) status = BlogStatus.BLOCKED;

    const blog = await prisma.blog.create({
      data: {
        title: title,
        slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
        excerpt: `Discover the most important insights and takeaways about ${title.toLowerCase()}.`,
        content: `<h2>Introduction to ${title}</h2><p>Here is some long-form content explaining everything you need to know about ${title}. We will dive deep into the core concepts, common pitfalls, and best practices.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p><h3>Key Takeaways</h3><ul><li>Always plan ahead.</li><li>Consistency is key.</li><li>Review and iterate.</li></ul><p>Thanks for reading!</p>`,
        status: status,
        featured: i % 8 === 0, // Make every 8th blog featured
        views: getRandomInt(50, 15000),
        authorId: author.id,
        categoryId: category.id,
        image: `https://picsum.photos/seed/${i + 100}/800/400`,
      },
    });
    blogs.push(blog);
  }

  // 5. Seed Interactions (Likes, Saves, Comments)
  console.log("💬 Creating Comments, Likes, and Saves for Published Blogs...");
  const publishedBlogs = blogs.filter((b) => b.status === BlogStatus.PUBLISHED);

  for (const blog of publishedBlogs) {
    // Random likes
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const likers = shuffledUsers.slice(0, getRandomInt(1, 6)); // 1 to 5 likes

    for (const liker of likers) {
      await prisma.blogLike.create({
        data: { userId: liker.id, blogId: blog.id },
      });
    }

    // Random saves
    const savers = shuffledUsers.slice(3, getRandomInt(4, 8)); // 0 to 4 saves
    for (const saver of savers) {
      await prisma.savedBlog.create({
        data: { userId: saver.id, blogId: blog.id },
      });
    }

    // Random comments
    const commentCount = getRandomInt(0, 5);
    for (let c = 0; c < commentCount; c++) {
      const commenter = getRandomElement(users);
      const commentsArray = [
        "Great post! I really enjoyed reading this.",
        "This is exactly what I was looking for, thanks!",
        "Could you expand on the second point in a future post?",
        "Very insightful. Shared this with my team.",
        "I disagree with a few points, but overall a solid read.",
      ];
      await prisma.blogComment.create({
        data: {
          comment: getRandomElement(commentsArray),
          userId: commenter.id,
          blogId: blog.id,
        },
      });
    }
  }

  // 6. Seed User Follows
  console.log("🤝 Creating Follow relationships...");
  for (const follower of users) {
    const followingCount = getRandomInt(2, 6);
    const potentialFollows = users.filter((u) => u.id !== follower.id);
    const following = potentialFollows
      .sort(() => 0.5 - Math.random())
      .slice(0, followingCount);

    for (const followedUser of following) {
      await prisma.userFollow.create({
        data: {
          followerId: follower.id,
          followingId: followedUser.id,
        },
      });
    }
  }

  // 7. Seed Traffic Logs for the past 30 days
  console.log("📈 Creating Traffic Logs...");
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const logDate = new Date(today);
    logDate.setDate(logDate.getDate() - i);
    logDate.setHours(0, 0, 0, 0);

    await prisma.logTraffic.create({
      data: {
        date: logDate,
        views: getRandomInt(1000, 15000),
      },
    });
  }

  console.log(
    `✅ Seeding completed successfully! Created ${blogs.length} blogs.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
