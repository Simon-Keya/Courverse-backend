/**
 * Seed script — run with: npx ts-node -r tsconfig-paths/register src/database/seed.ts
 * Requires DB connection via env vars.
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

import { User, UserRole } from '../users/entities/user.entity';
import { Publisher } from '../publishers/entities/publisher.entity';
import { Category } from '../categories/entities/category.entity';
import {
  Course,
  CourseStatus,
  CourseDifficulty,
} from '../courses/entities/course.entity';
import { Section } from '../sections/entities/section.entity';
import { Lesson, LessonType } from '../lessons/entities/lesson.entity';

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'courverse',
    entities: [User, Publisher, Category, Course, Section, Lesson],
    synchronize: true,
  });

  await ds.initialize();
  console.log('Connected. Seeding...');

  const userRepo = ds.getRepository(User);
  const pubRepo = ds.getRepository(Publisher);
  const catRepo = ds.getRepository(Category);
  const courseRepo = ds.getRepository(Course);
  const sectionRepo = ds.getRepository(Section);
  const lessonRepo = ds.getRepository(Lesson);

  const password = await bcrypt.hash('password123', 10);

  // Users
  let learner = await userRepo.findOne({ where: { email: 'learner@courverse.com' } });
  if (!learner) {
    learner = await userRepo.save(
      userRepo.create({
        username: 'learner',
        email: 'learner@courverse.com',
        password,
        role: UserRole.LEARNER,
        firstName: 'Alex',
        lastName: 'Learner',
        xp: 150,
        level: 1,
        streak: 3,
      }),
    );
  }

  let publisherUser = await userRepo.findOne({ where: { email: 'publisher@courverse.com' } });
  if (!publisherUser) {
    publisherUser = await userRepo.save(
      userRepo.create({
        username: 'publisher',
        email: 'publisher@courverse.com',
        password,
        role: UserRole.PUBLISHER,
        firstName: 'Amara',
        lastName: 'Okafor',
      }),
    );
  }

  let admin = await userRepo.findOne({ where: { email: 'admin@courverse.com' } });
  if (!admin) {
    admin = await userRepo.save(
      userRepo.create({
        username: 'admin',
        email: 'admin@courverse.com',
        password,
        role: UserRole.ADMIN,
        firstName: 'Admin',
        lastName: 'User',
      }),
    );
  }

  // Publisher profile
  let publisher = await pubRepo.findOne({ where: { email: 'publisher@courverse.com' } });
  if (!publisher) {
    publisher = await pubRepo.save(
      pubRepo.create({
        name: 'Amara Okafor',
        slug: 'amara-okafor',
        email: 'publisher@courverse.com',
        bio: 'Senior frontend engineer teaching React and TypeScript.',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
        userId: publisherUser.id,
        studentsCount: 1200,
        coursesCount: 2,
        rating: 4.9,
        isVerified: true,
      }),
    );
  }

  // Categories
  const catData = [
    { name: 'Web Development', slug: 'web-development', icon: 'Code2', orderIndex: 1 },
    { name: 'Data Science', slug: 'data-science', icon: 'BarChart3', orderIndex: 2 },
    { name: 'Design', slug: 'design', icon: 'Palette', orderIndex: 3 },
    { name: 'Business', slug: 'business', icon: 'Briefcase', orderIndex: 4 },
    { name: 'AI & Machine Learning', slug: 'ai-machine-learning', icon: 'Sparkles', orderIndex: 5 },
  ];
  const categories: Category[] = [];
  for (const c of catData) {
    let cat = await catRepo.findOne({ where: { slug: c.slug } });
    if (!cat) cat = await catRepo.save(catRepo.create(c));
    categories.push(cat);
  }

  // Sample course with curriculum
  let course = await courseRepo.findOne({ where: { slug: 'react-masterclass' } });
  if (!course) {
    course = await courseRepo.save(
      courseRepo.create({
        title: 'React Masterclass: From Fundamentals to Production',
        slug: 'react-masterclass',
        description:
          'Learn React 18 the right way — hooks, server components, testing, and real deployment.',
        shortDescription: 'Modern React from zero to production.',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
        difficulty: CourseDifficulty.INTERMEDIATE,
        price: 49,
        isFree: false,
        isPremium: true,
        status: CourseStatus.PUBLISHED,
        durationMinutes: 720,
        lessonCount: 6,
        rating: 4.9,
        ratingCount: 1280,
        enrollmentCount: 8420,
        learningOutcomes: [
          'Build production React apps with hooks and TypeScript',
          'Understand server components and modern routing',
          'Test and deploy with confidence',
        ],
        requirements: ['Basic JavaScript', 'Familiarity with HTML/CSS'],
        tags: ['react', 'typescript', 'frontend'],
        categoryId: categories[0].id,
        publisherId: publisher.id,
        publishedAt: new Date(),
      }),
    );

    const s1 = await sectionRepo.save(
      sectionRepo.create({
        title: 'Getting Started',
        orderIndex: 0,
        courseId: course.id,
      }),
    );
    const s2 = await sectionRepo.save(
      sectionRepo.create({
        title: 'Core Concepts',
        orderIndex: 1,
        courseId: course.id,
      }),
    );

    const lessons = [
      { sectionId: s1.id, title: 'Course overview', type: LessonType.VIDEO, orderIndex: 0, durationMinutes: 5, isPreview: true },
      { sectionId: s1.id, title: 'Setting up your environment', type: LessonType.VIDEO, orderIndex: 1, durationMinutes: 12 },
      { sectionId: s1.id, title: 'How this course works', type: LessonType.READING, orderIndex: 2, durationMinutes: 5, content: 'Welcome to the course. Take notes and complete each lesson in order.' },
      { sectionId: s2.id, title: 'Components and props', type: LessonType.VIDEO, orderIndex: 0, durationMinutes: 18 },
      { sectionId: s2.id, title: 'State and lifecycle', type: LessonType.VIDEO, orderIndex: 1, durationMinutes: 22 },
      { sectionId: s2.id, title: 'Quiz: Core Concepts', type: LessonType.QUIZ, orderIndex: 2, durationMinutes: 10 },
    ];
    for (const l of lessons) {
      await lessonRepo.save(lessonRepo.create(l));
    }
    console.log('Created course with curriculum:', course.slug);
  }

  // Free course
  let freeCourse = await courseRepo.findOne({ where: { slug: 'intro-to-typescript' } });
  if (!freeCourse) {
    freeCourse = await courseRepo.save(
      courseRepo.create({
        title: 'Intro to TypeScript',
        slug: 'intro-to-typescript',
        description: 'A gentle introduction to TypeScript for JavaScript developers.',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
        difficulty: CourseDifficulty.BEGINNER,
        price: 0,
        isFree: true,
        isPremium: false,
        status: CourseStatus.PUBLISHED,
        durationMinutes: 180,
        lessonCount: 3,
        rating: 4.7,
        ratingCount: 420,
        enrollmentCount: 3100,
        categoryId: categories[0].id,
        publisherId: publisher.id,
        publishedAt: new Date(),
        learningOutcomes: ['Understand types', 'Use interfaces and generics'],
        requirements: ['JavaScript basics'],
      }),
    );
    const fs = await sectionRepo.save(
      sectionRepo.create({ title: 'Basics', orderIndex: 0, courseId: freeCourse.id }),
    );
    for (const [i, title] of ['What is TypeScript?', 'Basic types', 'Your first project'].entries()) {
      await lessonRepo.save(
        lessonRepo.create({
          sectionId: fs.id,
          title,
          type: LessonType.VIDEO,
          orderIndex: i,
          durationMinutes: 10 + i * 5,
          isPreview: i === 0,
        }),
      );
    }
    console.log('Created free course:', freeCourse.slug);
  }

  console.log('\nSeed complete. Demo accounts (password: password123):');
  console.log('  learner@courverse.com  (learner)');
  console.log('  publisher@courverse.com (publisher)');
  console.log('  admin@courverse.com     (admin)');
  await ds.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
