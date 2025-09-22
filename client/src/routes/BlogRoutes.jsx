import {Route , Routes} from 'react-router-dom'
import Blog from '../pages/Blog/Blog';
import BlogCreator from '../pages/Blog/BlogCreator';
import BlogEditor from '../pages/Blog/BlogEditor';

const BlogRoutes = () => {
    return ( 
        <Routes>
            <Route path='/:id' element={<Blog/>}/>
            <Route path='/create' element={<BlogCreator/>}/>
            <Route path='/edit/:id' element={<BlogEditor/>}/>
        </Routes>
     );
}
 
export default BlogRoutes;