import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // UI State
    const [activeTab, setActiveTab] = useState('dashboard'); 
    // Removed isSidebarOpen state as we switched to top-nav for mobile

    // Data State
    const [data, setData] = useState({ bookings: [], blogs: [], quotes: [] });
    const [loading, setLoading] = useState(true);

    // Cost Input State (for Quotes)
    const [costInputs, setCostInputs] = useState({});
    const [sendingCostId, setSendingCostId] = useState(null);

    // Blog Form State
    const [blogForm, setBlogForm] = useState({ title: '', description: '', image: '' });
    const [isEditingBlogId, setIsEditingBlogId] = useState(null);

    // Notification & Modal State
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null });
    
    // Status Updating State (to disable buttons while loading)
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

   // Inside fetchAllData function
const fetchAllData = async () => {
    try {
        const [quotesRes, bookingsRes, blogsRes] = await Promise.all([
            // Quotes might be public or protected, safer to include it if protected
            axios.get(`${import.meta.env.VITE_API_URL}/api/quotes`, { withCredentials: true }),
            
            // IMPORTANT: Bookings is now protected, so this is required
            axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, { withCredentials: true }),
            
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
        // If error is 401 (Unauthorized), redirect to login
        if (error.response && error.response.status === 401) {
            navigate('/admin/login');
        } else {
            showNotification("Failed to load data.", "error");
        }
        setLoading(false);
    }
};

    const handleBookingStatus = async (bookingId, newStatus) => {
    showNotification(`Processing ${newStatus} status...`, "info");
    setUpdatingStatusId(bookingId);

    try {
        // NOTICE: { withCredentials: true } is added as the 3rd argument
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`, 
            { status: newStatus },
            { withCredentials: true } 
        );
        
        if (response.data.success) {
            showNotification(`Success: ${newStatus} email sent.`);
            fetchAllData(); 
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) navigate('/admin/login');
        showNotification("Failed to update status.", "error");
    } finally {
        setUpdatingStatusId(null);
    }
};

    const handleCostSubmit = async (quoteId) => {
        const cost = costInputs[quoteId];
        if (!cost) return showNotification("Please enter a cost amount.", "error");

        setSendingCostId(quoteId);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/quotes/${quoteId}/cost`, { cost }, { withCredentials: true });
            showNotification("Cost sent to customer successfully!");
            const newInputs = { ...costInputs };
            delete newInputs[quoteId];
            setCostInputs(newInputs);
            fetchAllData();
        } catch (error) {
            console.error(error);
            showNotification("Failed to send quote.", "error");
        } finally {
            setSendingCostId(null);
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

    const confirmDelete = (type, id) => setDeleteModal({ show: true, type, id });

    const executeDelete = async () => {
    const { type, id } = deleteModal;
    try {
        // NOTICE: { withCredentials: true } is added as the 2nd argument
        await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/${type}/${id}`, 
            { withCredentials: true }
        );
        
        showNotification(`${type.slice(0, -1)} deleted successfully!`);
        fetchAllData();
    } catch (error) {
        if (error.response && error.response.status === 401) navigate('/admin/login');
        showNotification(`Failed to delete ${type}.`, 'error');
    } finally {
        setDeleteModal({ show: false, type: null, id: null });
    }
};

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingBlogId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/blogs/${isEditingBlogId}`, blogForm, { withCredentials: true });
                showNotification('Blog updated!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, blogForm, { withCredentials: true });
                showNotification('Blog created!');
            }
            setBlogForm({ title: '', description: '', image: '' });
            setIsEditingBlogId(null);
            fetchAllData();
        } catch { showNotification('Failed to save blog.', 'error'); }
    };

    const editBlog = (blog) => {
        setBlogForm({ title: blog.title, description: blog.description, image: blog.image });
        setIsEditingBlogId(blog._id);
        setActiveTab('blogs');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; 
        }
    };

    // Tabs configuration
    const TABS = ['dashboard', 'quotes', 'bookings', 'blogs'];

    return (
        <div className="h-screen bg-gray-100 flex flex-col md:flex-row relative overflow-hidden">
            
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[70] px-6 py-4 rounded shadow-lg text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold">✕</button>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
                        <h3 className="text-lg font-bold mb-2">Confirm Action</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete this? This cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteModal({ show: false, type: null, id: null })} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                            <button onClick={executeDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
            <div className="hidden md:flex flex-col bg-slate-900 text-white w-64 p-6 flex-shrink-0 h-full">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4 flex-1">
                    {TABS.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`block w-full text-left py-2.5 px-4 rounded capitalize transition-colors ${activeTab === tab ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* --- MOBILE HEADER & NAV (Hidden on Desktop) --- */}
            <div className="md:hidden fixed top-30 left-0 right-0 z-40 flex flex-col">
                {/* 1. Top Header Bar */}
                <div className="bg-slate-800 text-white p-4 h-[60px] flex justify-between items-center shadow-md">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded">
                        LOGOUT
                    </button>
                </div>
                
                {/* 2. Horizontal Nav Bar */}
                <div className="bg-white border-b border-gray-200 overflow-x-auto flex h-[50px] shadow-sm">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2
                                ${activeTab === tab 
                                    ? 'border-blue-600 text-blue-600 bg-blue-50' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 w-full overflow-y-auto bg-gray-100 pt-[110px] md:pt-0">
                <div className="p-4 md:p-10 max-w-7xl mx-auto">
                    
                    {/* Header (Desktop: Title + Logout, Mobile: Just Title) */}
                    <header className="flex justify-between items-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-800">{activeTab}</h1>
                        {/* Desktop Logout Button */}
                        <button onClick={handleLogout} className="hidden md:block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
                    </header>

                    {loading ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">Loading Data...</div>
                    ) : (
                        <>
                            {/* --- DASHBOARD STATS --- */}
                            {activeTab === 'dashboard' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Total Pending Bookings */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                                        <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Bookings</h3>
                                        <p className="text-3xl font-bold mt-2 text-gray-800">
                                            {/* Filter to show only 'Pending' status */}
                                            {data.bookings.filter(b => b.status === 'Pending').length}
                                        </p>
                                    </div>

                                    {/* Total Unquoted Requests */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                                        <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Quotes</h3>
                                        <p className="text-3xl font-bold mt-2 text-gray-800">
                                            {/* Filter to show only quotes where cost is null/undefined */}
                                            {data.quotes.filter(q => !q.cost).length}
                                        </p>
                                    </div>

                                    {/* Active Blogs */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                                        <h3 className="text-gray-500 text-sm font-bold uppercase">Active Blogs</h3>
                                        <p className="text-3xl font-bold mt-2 text-gray-800">
                                            {data.blogs.length}
                                        </p>
                                    </div>
                                </div>
                            )}

                             {/* --- QUOTES TABLE --- */}
                            {activeTab === 'quotes' && (
                                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 min-w-[1000px] md:min-w-full">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Customer</th>
                                                    <th className="px-4 py-3">Vehicle</th>
                                                    <th className="px-4 py-3">Service</th>
                                                    <th className="px-4 py-3">Comments</th>
                                                    <th className="px-4 py-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.quotes.map((q) => (
                                                    <tr key={q._id} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap align-top">
                                                            {new Date(q.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <div className="font-bold text-gray-900">{q.fullName}</div>
                                                            <div className="text-xs text-gray-500">{q.email}</div>
                                                            <div className="text-xs text-gray-500">{q.phone}</div>
                                                            <div className="text-xs font-semibold text-blue-600 mt-1">{q.suburb}</div>
                                                        </td>
                                                        <td className="px-4 py-4 uppercase font-mono text-gray-800 align-top">
                                                            {q.vehicleReg}
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">{q.serviceType}</span>
                                                            {q.repairPart && <div className="text-xs mt-1">Part: <span className="font-medium">{q.repairPart}</span></div>}
                                                            {q.tintCondition && <div className="text-xs mt-1">Tint Cond: <span className="font-medium">{q.tintCondition}</span></div>}
                                                        </td>
                                                        <td className="px-4 py-4 text-xs italic text-gray-600 max-w-[200px] break-words whitespace-normal align-top">
                                                            {q.comments || "-"}
                                                        </td>
                                                        
                                                        <td className="px-4 py-4 align-top min-w-[180px]">
                                                            {q.cost ? (
                                                                <div className="flex flex-col gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                                                                    <span className="text-green-700 font-semibold text-sm flex items-center gap-1">
                                                                        ✓ Quoted: <span className="font-bold">${q.cost}</span>
                                                                    </span>
                                                                    <button onClick={() => confirmDelete('quotes', q._id)} className="text-red-500 text-xs hover:underline text-left">
                                                                        Delete Quote
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-gray-500 text-sm">$</span>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="0.00"
                                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                            value={costInputs[q._id] || ''}
                                                                            onChange={(e) => setCostInputs({ ...costInputs, [q._id]: e.target.value })}
                                                                        />
                                                                    </div>
                                                                    <div className="flex gap-2 mt-1">
                                                                        <button
                                                                            onClick={() => handleCostSubmit(q._id)}
                                                                            disabled={sendingCostId === q._id}
                                                                            className="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                                                                        >
                                                                            {sendingCostId === q._id ? 'Sending' : 'Send'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => confirmDelete('quotes', q._id)}
                                                                            className="px-2 py-1.5 text-red-600 border border-red-200 bg-white rounded text-xs hover:bg-red-50"
                                                                        >
                                                                            Del
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {data.quotes.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No quotes found.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* --- BOOKINGS TABLE --- */}
                            {activeTab === 'bookings' && (
                                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 min-w-[1000px] md:min-w-full">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                                <tr>
                                                    <th className="px-4 py-3">Scheduled</th>
                                                    <th className="px-4 py-3">Customer</th>
                                                    <th className="px-4 py-3">Vehicle</th>
                                                    <th className="px-4 py-3">Service</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.bookings.map((b) => (
                                                    <tr key={b._id} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900 align-top">{b.date}</td>
                                                        <td className="px-4 py-4 align-top">
                                                            <div className="font-bold">{b.firstName} {b.lastName}</div>
                                                            <div className="text-xs text-blue-600">{b.email}</div>
                                                            <div className="text-xs text-gray-500">{b.phone}</div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <div className="font-medium text-gray-900">{b.year} {b.make}</div>
                                                            <div className="text-xs uppercase text-gray-500">{b.model}</div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap">
                                                                {b.serviceName}
                                                            </span>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {b.serviceName === 'Window Tinting' && (
                                                                    <>
                                                                        {b.selectedShade && <span className="block">Shade: {b.selectedShade}</span>}
                                                                        {b.selectedCoverage && <span className="block">Cov: {b.selectedCoverage}</span>}
                                                                    </>
                                                                )}
                                                                {b.serviceName === 'Headlight Restoration' && b.selectedHeadlights && (
                                                                    <span>Headlights: {b.selectedHeadlights}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(b.status || 'Pending')}`}>
                                                                {b.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 align-top">
                                                            <div className="flex flex-wrap gap-2 w-[160px]">
                                                                {b.status === 'Pending' && (
                                                                    <button 
                                                                        onClick={() => handleBookingStatus(b._id, 'Accepted')}
                                                                        disabled={updatingStatusId === b._id}
                                                                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex-1 transition-colors"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                )}
                                                                
                                                                {b.status === 'Accepted' && (
                                                                    <button 
                                                                        onClick={() => handleBookingStatus(b._id, 'Completed')}
                                                                        disabled={updatingStatusId === b._id}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex-1 transition-colors"
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                )}

                                                                {(b.status === 'Pending' || b.status === 'Accepted') && (
                                                                    <button 
                                                                        onClick={() => handleBookingStatus(b._id, 'Cancelled')}
                                                                        disabled={updatingStatusId === b._id}
                                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs flex-1 transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}

                                                                <button 
                                                                    onClick={() => confirmDelete('bookings', b._id)}
                                                                    className="text-red-600 border border-red-200 hover:bg-red-50 px-2 py-1 rounded text-xs"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {data.bookings.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No bookings found.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* --- BLOGS VIEW --- */}
                            {activeTab === 'blogs' && (
                                <div>
                                    <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-8">
                                        <h3 className="text-lg font-bold mb-4 text-gray-800">{isEditingBlogId ? 'Edit Blog' : 'Create New Blog'}</h3>
                                        <form onSubmit={handleBlogSubmit} className="space-y-4">
                                            <input type="text" placeholder="Title" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                                            <textarea placeholder="Description" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="3" required value={blogForm.description} onChange={e => setBlogForm({...blogForm, description: e.target.value})}></textarea>
                                            <input type="text" placeholder="Image URL" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                                            <div className="flex gap-3">
                                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium">{isEditingBlogId ? 'Update Blog' : 'Publish Blog'}</button>
                                                {isEditingBlogId && <button type="button" onClick={() => {setIsEditingBlogId(null); setBlogForm({title:'',description:'',image:''})}} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors">Cancel</button>}
                                            </div>
                                        </form>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {data.blogs.map((blog) => (
                                            <div key={blog._id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                                <div className="h-48 bg-gray-200 relative group">
                                                    {blog.image ? (
                                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex-1">
                                                    <h4 className="font-bold text-lg text-gray-800 mb-2">{blog.title}</h4>
                                                    <p className="text-sm text-gray-600 line-clamp-3">{blog.description}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
                                                    <button onClick={() => editBlog(blog)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                                                    <button onClick={() => confirmDelete('blogs', blog._id)} className="text-red-600 text-sm font-medium hover:underline">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;