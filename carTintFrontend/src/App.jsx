import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/common/ScrollToTop'

export default function App() {
  return (
    <div>
       <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  
  )
}
