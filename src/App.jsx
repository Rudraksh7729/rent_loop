import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ListingProvider } from './context/ListingContext'
import { RentalProvider } from './context/RentalContext'
import ScrollToTop from './components/layout/ScrollToTop'
import LandingPage from './pages/LandingPage'
import ExplorePage from './pages/ExplorePage'
import ItemDetailsPage from './pages/ItemDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardRedirect from './pages/DashboardRedirect'
import RenterDashboard from './pages/RenterDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import ProfilePage from './pages/ProfilePage'
import MyListingsPage from './pages/MyListingsPage'
import CreateListingPage from './pages/CreateListingPage'
import BookingPage from './pages/BookingPage'
import MyRentalsPage from './pages/MyRentalsPage'
import RentalDetailsPage from './pages/RentalDetailsPage'
import OwnerRentalRequestsPage from './pages/OwnerRentalRequestsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingProvider>
          <RentalProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/item/:id" element={<ItemDetailsPage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/renter/dashboard" element={<RenterDashboard />} />
              <Route path="/renter/rentals" element={<MyRentalsPage />} />
              <Route path="/rental/:id" element={<RentalDetailsPage />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/listings" element={<MyListingsPage />} />
              <Route path="/owner/listings/new" element={<CreateListingPage />} />
              <Route path="/owner/listings/:id/edit" element={<CreateListingPage />} />
              <Route path="/owner/requests" element={<OwnerRentalRequestsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RentalProvider>
        </ListingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
