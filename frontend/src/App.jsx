import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Signup from './pages/Signup';
import Header from './components/Header';
import FooterCom from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import UpdatePost from './pages/UpdataPost';
import PostPage from './pages/PostPage';
import Search from './pages/Search';
import About from './pages/About';
import Projects from './pages/Projects';
import ScrollToTop from "./components/ScrollToTop"
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>


        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}

export default App
