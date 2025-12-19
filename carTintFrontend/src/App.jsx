import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import WhatsAppButton from './components/common/WhatsAppButton';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <WhatsAppButton />
      <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
      <Footer />
    </div>
  )
}
 