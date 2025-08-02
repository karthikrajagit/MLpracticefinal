
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProblemDescription from './pages/ProblemDescription'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import Practice from './pages/Practice'
import Intro from './pages/Intro'
import RecentUpdates from './pages/RecentUpdates'
import Contribution from './pages/Contribution'
import PostProblem from './pages/PostPages/PostProblem'
import Postcontent from './pages/PostPages/Postcontent'
import Postsubtopic from './pages/PostPages/Postsubtopic'
import Posttopic from './pages/PostPages/Posttopic'
import Content from './pages/Content'


export default function App() {
 return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element = {<Intro/>}/>
          <Route path='/recentupdates' element = { <RecentUpdates/>}/>
          <Route path='/admin' element = {<Admin/>}/>
          <Route path='/home' element = {<Home/>}/>
          <Route path="/problem/:id" element={<ProblemDescription />} />
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path="/practice/:id" element={<Practice/>}/>
          <Route path="/contribution" element={<Contribution/>}/>
          <Route path="/postproblem" element={<PostProblem/>}/>
          <Route path="/posttopic" element={<Posttopic/>}/>
          <Route path="/postsubtopic" element={<Postsubtopic/>}/>
          <Route path="/postcontent" element={<Postcontent/>}/>
          <Route path="/content/:subtopic" element={<Content/>}/>
          <Route element = {<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
  )
}
