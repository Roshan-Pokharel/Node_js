import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  
  )
}
