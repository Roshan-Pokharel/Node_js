import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import Services from '../pages/Services'
import ServiceDetail from '../components/layout/ServiceDetail'
import InformationDetail from '../components/layout/InformationDetail'
import BookingForm from '../pages/BookingForm';
import About from '../pages/About';
import Reviews from '../pages/Reviews';

export default function AppRoutes() {
  return (
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/service" element={<Services />} />
      <Route path="/service/:serviceId" element={<ServiceDetail />} />
      <Route path="/service/:serviceId/book" element={<InformationDetail />} />
      <Route path="/bookings" element={<BookingForm />} />
      <Route path="/about" element={<About />} />
      <Route path="/allreviews" element={<Reviews />} />
    </Routes>
   
  )
}
