import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { Hero } from './components/Hero/Hero'
import { WorksSection } from './components/Works/WorksSection'
import { AboutSection } from './components/About/AboutSection'
import AllProjects from './pages/AllProjects'
import ProjectPage from './pages/ProjectPage'
import NotFound from './pages/NotFound'
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Layout hero={<Hero />}>
            <WorksSection />
            <AboutSection />
          </Layout>
        } />
        <Route path="/projects" element={<Layout><AllProjects /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectPage /></Layout>} />
        {/* anything else — the host rewrites unmatched paths to index.html, so this is
            what a mistyped or dead URL actually lands on */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
