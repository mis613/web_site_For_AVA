import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingState from './components/LoadingState';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Information = lazy(() => import('./pages/Information'));
const Team = lazy(() => import('./pages/Team'));
const Careers = lazy(() => import('./pages/Careers'));
const Gallery = lazy(() => import('./pages/Gallery'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Login = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ServicesAdmin = lazy(() => import('./admin/ServicesAdmin'));
const TeamAdmin = lazy(() => import('./admin/TeamAdmin'));
const BlogsAdmin = lazy(() => import('./admin/BlogsAdmin'));
const InquiriesAdmin = lazy(() => import('./admin/InquiriesAdmin'));
const AchievementsAdmin = lazy(() => import('./admin/AchievementsAdmin'));
const CareersAdmin = lazy(() => import('./admin/CareersAdmin'));
const GalleryAdmin = lazy(() => import('./admin/GalleryAdmin'));
const PrivacyPolicyAdmin = lazy(() => import('./admin/PrivacyPolicyAdmin'));
const AboutPageAdmin = lazy(() => import('./admin/AboutPageAdmin'));
const ContactPageAdmin = lazy(() => import('./admin/ContactPageAdmin'));

export default function App() {
  return (
    <Suspense fallback={<div className="py-16"><div className="container-page"><LoadingState /></div></div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="information" element={<Information />} />
          <Route path="team" element={<Team />} />
          <Route path="careers" element={<Careers />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <ServicesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/team"
        element={
          <ProtectedRoute>
            <TeamAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute>
            <BlogsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <ProtectedRoute>
            <InquiriesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/achievements"
        element={
          <ProtectedRoute>
            <AchievementsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/careers"
        element={
          <ProtectedRoute>
            <CareersAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <ProtectedRoute>
            <GalleryAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/privacy-policy"
        element={
          <ProtectedRoute>
            <PrivacyPolicyAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/about-us"
        element={
          <ProtectedRoute>
            <AboutPageAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contact-us"
        element={
          <ProtectedRoute>
            <ContactPageAdmin />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
