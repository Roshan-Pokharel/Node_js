import React, { useEffect, useState } from 'react';

const BlogGallery = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
    .then(res => res.json())
    .then(data => {
      setBlogs(data.data); // array comes from "data"
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Our Blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {blog.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.description}
                </p>

                <button className="mt-4 text-blue-600 font-semibold hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogGallery;
