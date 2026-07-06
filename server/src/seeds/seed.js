import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('DNS FIX APPLIED: 8.8.8.8, 1.1.1.1');

import dotenv from 'dotenv';

dotenv.config();

const [{ default: bcrypt }, { default: connectDB }, { default: User }, { default: Service }, { default: TeamMember }, { default: Blog }, { default: Media }, { default: SitePage }, seeds] = await Promise.all([
  import('bcryptjs'),
  import('../config/db.js'),
  import('../models/User.js'),
  import('../models/Service.js'),
  import('../models/TeamMember.js'),
  import('../models/Blog.js'),
  import('../models/Media.js'),
  import('../models/SitePage.js'),
  import('./seedData.js')
]);

const { blogSeed, mediaSeed, serviceSeed, sitePageSeed, teamSeed } = seeds;
await connectDB();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@cafirm.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

async function seed() {
  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    TeamMember.deleteMany({}),
    Blog.deleteMany({}),
    Media.deleteMany({}),
    SitePage.deleteMany({})
  ]);

  const password = await bcrypt.hash(adminPassword, 10);
  await User.create({ name: 'Admin', email: adminEmail, password, role: 'admin' });
  await Service.insertMany(serviceSeed);
  await TeamMember.insertMany(teamSeed);
  await Blog.insertMany(blogSeed);
  await Media.insertMany(mediaSeed);
  await SitePage.insertMany(sitePageSeed);
  console.log('Seed completed');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
