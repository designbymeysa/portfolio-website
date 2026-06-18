import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero/Hero'
import { WorksSection } from './components/Works/WorksSection'
import { AboutSection } from './components/About/AboutSection'
import AllProjects from './pages/AllProjects'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Hero />
            <WorksSection />
            <AboutSection />
          </Layout>
        } />
        <Route path="/projects" element={<Layout><AllProjects /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
