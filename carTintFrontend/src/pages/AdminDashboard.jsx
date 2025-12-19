import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // UI State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Data State
    const [data, setData] = useState({ bookings: [], blogs: [], quotes: [] });
    const [loading, setLoading] = useState(true);

    // Blog Form State
    const [blogForm, setBlogForm] = useState({ title: '', description: '', image: '' });
    const [isEditingBlogId, setIsEditingBlogId] = useState(null);

    // --- NEW: Notification & Modal State ---
    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }
    const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null });

    useEffect(() => {
        fetchAllData();
    }, []);

    // Helper: Show Notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const fetchAllData = async () => {
        try {
            const [quotesRes, bookingsRes, blogsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/quotes`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`)
            ]);
            
            setData({
                quotes: quotesRes.data.data,
                bookings: bookingsRes.data.data,
                blogs: blogsRes.data.data
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            showNotification("Failed to load data.", "error");
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/logout`, {}, { withCredentials: true });
            navigate('/admin/login');
        } catch {
            navigate('/admin/login');
        }
    };

    // --- BLOG HANDLERS ---
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingBlogId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/blogs/${isEditingBlogId}`, blogForm);
                showNotification('Blog updated successfully!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, blogForm);
                showNotification('Blog created successfully!');
            }
            setBlogForm({ title: '', description: '', image: '' });
            setIsEditingBlogId(null);
            fetchAllData();
        } catch (error) {
            console.error(error);
            showNotification('Failed to save blog.', 'error');
        }
    };

    // --- DELETE HANDLERS ---
    const confirmDelete = (type, id) => {
        // Open the custom modal instead of window.confirm
        setDeleteModal({ show: true, type, id });
    };

    const executeDelete = async () => {
        const { type, id } = deleteModal;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/${type}/${id}`);
            showNotification(`${type.slice(0, -1)} deleted successfully!`); // Remove 's' for singular
            fetchAllData();
        } catch {
            showNotification(`Failed to delete ${type}.`, 'error');
        } finally {
            setDeleteModal({ show: false, type: null, id: null });
        }
    };

    const editBlog = (blog) => {
        setBlogForm({ title: blog.title, description: blog.description, image: blog.image });
        setIsEditingBlogId(blog._id);
        setActiveTab('blogs');
        window.scrollTo(0,0);
    };

    const handleNavClick = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
            
            {/* --- TOAST NOTIFICATION COMPONENT --- */}
            {notification && (
                <div className={`
                    fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out flex items-center gap-3 max-w-sm
                    ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}
                `}>
                    {notification.type === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                    <div>
                        <h4 className="font-bold text-sm">{notification.type === 'error' ? 'Error' : 'Success'}</h4>
                        <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-2 text-white/70 hover:text-white">✕</button>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900">Delete Confirmation</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Are you sure you want to delete this {deleteModal.type?.slice(0, -1)}? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3 justify-center">
                            <button 
                                onClick={() => setDeleteModal({ show: false, type: null, id: null })}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-md"
                            >
                                Yes, Delete It
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Header & Hamburger */}
            {/* UPDATED: Changed z-20 to z-50 to ensure header stays on top */}
            <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center  sticky top-0 shadow-md">
                <span className="font-bold text-lg">Admin Panel</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Navigation */}
            {/* UPDATED: Added 'pt-24 md:pt-6' to push content down on mobile */}
            <div className={`
                fixed inset-y-0 left-0 transform bg-slate-800 text-white w-64 p-6 pt-[120px] md:pt-6 z-40 transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:h-screen md:sticky md:top-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <h2 className="text-2xl font-bold  mb-8 hidden md:block">Admin Panel</h2>
                <nav className="space-y-4">
                    <button onClick={() => handleNavClick('dashboard')} className={`block w-full text-left py-2.5 px-4 rounded ${activeTab === 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Dashboard</button>
                    <button onClick={() => handleNavClick('quotes')} className={`block w-full text-left py-2.5 px-4 rounded ${activeTab === 'quotes' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Quotes</button>
                    <button onClick={() => handleNavClick('bookings')} className={`block w-full text-left py-2.5 px-4 rounded ${activeTab === 'bookings' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Bookings</button>
                    <button onClick={() => handleNavClick('blogs')} className={`block w-full text-left py-2.5 px-4 rounded ${activeTab === 'blogs' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Blogs</button>
                </nav>
                
                <div className="mt-8 pt-8 border-t border-slate-700 md:hidden">
                    <button onClick={handleLogout} className="w-full text-left py-2 px-4 text-red-400 hover:text-red-300">Logout</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-10 w-full overflow-hidden">
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                    <button onClick={handleLogout} className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow">Logout</button>
                </header>

                {loading ? <p className="text-center text-gray-500">Loading data...</p> : (
                    <>
                        {/* DASHBOARD VIEW */}
                        {activeTab === 'dashboard' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                                    <p className="text-2xl font-bold mt-2">{data.bookings.length}</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Quotes</h3>
                                    <p className="text-2xl font-bold mt-2">{data.quotes.length}</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-gray-500 text-sm font-medium">Active Blogs</h3>
                                    <p className="text-2xl font-bold mt-2">{data.blogs.length}</p>
                                </div>
                            </div>
                        )}

                        {/* QUOTES VIEW */}
                        {activeTab === 'quotes' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 md:px-6 py-3">Date</th>
                                                <th className="px-4 md:px-6 py-3">Name</th>
                                                <th className="px-4 md:px-6 py-3">Service</th>
                                                <th className="px-4 md:px-6 py-3">Vehicle</th>
                                                <th className="px-4 md:px-6 py-3">Contact</th>
                                                <th className="px-4 md:px-6 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.quotes.map((q) => (
                                                <tr key={q._id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 md:px-6 py-4">{new Date(q.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{q.fullName}</td>
                                                    <td className="px-4 md:px-6 py-4">{q.serviceType}</td>
                                                    <td className="px-4 md:px-6 py-4 uppercase">{q.vehicleReg}</td>
                                                    <td className="px-4 md:px-6 py-4">
                                                        <div className="text-xs md:text-sm">
                                                            {q.email}<br/>
                                                            <span className="text-gray-400">{q.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4">
                                                        <button 
                                                            onClick={() => confirmDelete('quotes', q._id)} 
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.quotes.length === 0 && (
                                                <tr><td colSpan="6" className="text-center py-4">No quotes found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* BOOKINGS VIEW */}
                        {activeTab === 'bookings' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 md:px-6 py-3">Req Date</th>
                                                <th className="px-4 md:px-6 py-3">Name</th>
                                                <th className="px-4 md:px-6 py-3">Service</th>
                                                <th className="px-4 md:px-6 py-3">Phone No.</th>
                                                <th className="px-4 md:px-6 py-3">Email</th>
                                                <th className="px-4 md:px-6 py-3">Vehicle</th>
                                                <th className="px-4 md:px-6 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.bookings.map((b) => (
                                                <tr key={b._id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 md:px-6 py-4">{b.date}</td>
                                                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{b.firstName} {b.lastName}</td>
                                                    <td className="px-4 md:px-6 py-4">{b.serviceName}</td>
                                                    <td className="px-4 md:px-6 py-4">{b.phone}</td>
                                                    <td className="px-4 md:px-6 py-4">{b.email}</td>
                                                    <td className="px-4 md:px-6 py-4">{b.year} {b.make} {b.model}</td>
                                                    <td className="px-4 md:px-6 py-4">
                                                        <button 
                                                            onClick={() => confirmDelete('bookings', b._id)} 
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.bookings.length === 0 && (
                                                <tr><td colSpan="5" className="text-center py-4">No bookings found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* BLOGS VIEW */}
                        {activeTab === 'blogs' && (
                            <div>
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-8 border border-gray-100">
                                    <h3 className="text-lg font-bold mb-4">{isEditingBlogId ? 'Edit Blog' : 'Create New Blog'}</h3>
                                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                                            <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                                            <textarea className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" rows="3" required value={blogForm.description} onChange={e => setBlogForm({...blogForm, description: e.target.value})}></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
                                            <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition" required value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} placeholder="https://..." />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow">{isEditingBlogId ? 'Update Blog' : 'Publish Blog'}</button>
                                            {isEditingBlogId && <button type="button" onClick={() => {setIsEditingBlogId(null); setBlogForm({title:'',description:'',image:''})}} className="w-full md:w-auto bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition">Cancel</button>}
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.blogs.map((blog) => (
                                        <div key={blog._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col hover:shadow-md transition">
                                            <div className="h-48 w-full bg-gray-200 overflow-hidden relative group">
                                                {blog.image ? (
                                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-1">
                                                <h4 className="font-bold text-lg text-gray-900">{blog.title}</h4>
                                                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{blog.description}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                                <button onClick={() => editBlog(blog)} className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 hover:bg-blue-50 rounded transition">Edit</button>
                                                <button onClick={() => confirmDelete('blogs', blog._id)} className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 hover:bg-red-50 rounded transition">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                    {data.blogs.length === 0 && <p className="text-gray-500">No blogs posted yet.</p>}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;