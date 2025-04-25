import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Briefcase, Bookmark, User, Bell, Mail, Search, X, Menu as MenuIcon } from 'react-feather';
import InternshipsPage from "./InternshipsPage";
import SubmitRequest from './SubmitRequest';
import SavedInternships from './SavedInternships';


const api = axios.create({
baseURL: 'http://localhost:8000/api/viewers/',
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
},
});

export default function ViewerDashboard() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [currentTab, setCurrentTab] = useState('dashboard');
const [internships, setInternships] = useState([]);
const [savedInternships, setSavedInternships] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [filteredInternships, setFilteredInternships] = useState([]);
const [profile, setProfile] = useState({
  name: '',
  email: '',
  interests: []
});
const [requestData, setRequestData] = useState({
  internshipId: '',
  message: ''
});

// Fetch data on component mount
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch viewer profile
      const profileResponse = await api.get('/profile');
      setProfile(profileResponse.data);
      console.log(profileResponse.data)
      
      // Fetch all internships
      const internshipsResponse = await api.get('/internships');
      setInternships(internshipsResponse.data);
      setFilteredInternships(internshipsResponse.data);
      
      // Set saved internships from profile
      if (profileResponse.data.savedInternships) {
        setSavedInternships(profileResponse.data.savedInternships);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

// Filter internships based on search term
useEffect(() => {
  if (searchTerm.trim() === '') {
    setFilteredInternships(internships);
  } else {
    const filtered = internships.filter(internship =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInternships(filtered);
  }
}, [searchTerm, internships]);

// Stats data for viewer
const stats = {
  availableInternships: internships?.length || 0,
  savedInternships: savedInternships?.length || 0,
  pendingRequests: 3, // This would come from backend in a real app
  matchedInternships: 5 // This would come from backend in a real app
};

const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};

const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};

const handleSaveInternship = async (id) => {
  try {
    await api.post(`/internships/save/${id}`);
    setSavedInternships([...savedInternships, id]);
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Failed to save internship');
  }
};

const handleRemoveSaved = async (id) => {
  try {
    await api.delete(`/internships/save/${id}`);
    setSavedInternships(savedInternships.filter(item => item !== id));
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Failed to remove saved internship');
  }
};

const handleRequestSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/request', requestData);
    alert('Request submitted successfully!');
    setRequestData({
      internshipId: '',
      message: ''
    });
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Failed to submit request');
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setRequestData({
    ...requestData,
    [name]: value
  });
};

return (
  <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
    {/* Mobile Sidebar */}
    <div className={`lg:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={toggleSidebar}></div>
      <nav className="relative z-50 flex flex-col w-64 bg-gray-900 bg-opacity-80 backdrop-blur-lg border-r border-gray-800 p-4 transform transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Internship Portal</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800">
            <X size={24} />
          </button>
        </div>
        {renderNavItems()}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 bg-red-600/90 hover:bg-red-700/90 rounded-md transition-colors flex items-center justify-center gap-2">
            Logout
          </button>
        </div>
      </nav>
    </div>

    {/* Desktop Sidebar */}
    <aside className="hidden lg:flex flex-col w-60 bg-gray-900/80 backdrop-blur-lg border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Internship Portal</h1>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {renderNavItems()}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button className="w-full px-4 py-2 bg-red-600/90 hover:bg-red-700/90 rounded-md transition-colors">
          Logout
        </button>
      </div>
    </aside>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 p-4 flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-800"
        >
          <MenuIcon size={24} />
        </button>
        
        <div className="relative max-w-md w-full mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Search internships..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800">
            <Mail size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-sm">{profile.name}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
        {error && (
          <div className="col-span-12 bg-red-900/50 text-red-200 p-4 mb-4 rounded-lg backdrop-blur-sm">
            {error}
            <button onClick={() => setError(null)} className="float-right">
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {currentTab === 'dashboard' && (
            <>
              <h1 className="col-span-12 text-3xl md:text-4xl font-bold mb-6">Internship Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <StatCard title="Available Internships" value={stats.availableInternships} color="from-blue-400 to-blue-600" />
                <StatCard title="Saved Internships" value={stats.savedInternships} color="from-purple-400 to-purple-600" />
                <StatCard title="Pending Requests" value={stats.pendingRequests} color="from-yellow-400 to-yellow-600" />
                <StatCard title="Matched Internships" value={stats.matchedInternships} color="from-green-400 to-green-600" />
              </div>
              
              {/* Featured Internships */}
              <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Featured Internships</h2>
                  <button 
                    onClick={() => setCurrentTab('internships')}
                    className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors flex items-center gap-2 text-sm"
                  >
                    View All
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">Loading internships...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInternships.slice(0, 3).map((internship) => (
                      <InternshipCard 
                        key={internship._id} 
                        internship={internship} 
                        isSaved={savedInternships.includes(internship._id)}
                        onSave={handleSaveInternship}
                        onRemove={handleRemoveSaved}
                        viewerMode={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

{currentTab === "internships" && <InternshipsPage />}

{currentTab === "saved" && <SavedInternships />}


          

{currentTab === "request" && <SubmitRequest />}


          {currentTab === 'profile' && (
            <>
              <div className="col-span-12 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">Your Profile</h1>
              </div>
              
              <div className="col-span-12 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold mb-4">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-gray-400 text-sm">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-medium mb-3">Your Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests?.length > 0 ? (
                          profile.interests.map((interest, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400">No interests added yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3">Saved Internships</h3>
                      {savedInternships?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {internships
                            .filter(internship => savedInternships.includes(internship._id))
                            .slice(0, 3)
                            .map(internship => (
                              <div key={internship._id} className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                <h4 className="font-medium">{internship.title}</h4>
                                <p className="text-sm text-gray-400">{internship.company}</p>
                              </div>
                            ))}
                          {savedInternships.length > 3 && (
                            <button 
                              onClick={() => setCurrentTab('saved')}
                              className="text-blue-400 text-sm hover:underline mt-2"
                            >
                              View all {savedInternships.length} saved internships
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">No internships saved yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  </div>
);

function renderNavItems() {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'internships', label: 'Internships', icon: <Briefcase size={20} /> },
    { id: 'saved', label: 'Saved', icon: <Bookmark size={20} /> },
    { id: 'request', label: 'Submit Request', icon: <Mail size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> }
  ];

  return (
    <ul className="space-y-1">
      {navItems.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => {
              setCurrentTab(item.id);
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              currentTab === item.id 
                ? 'bg-gray-800 text-white font-medium' 
                : 'hover:bg-gray-800/50 text-gray-300'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
}

// StatCard component (same as in admin dashboard)
function StatCard({ title, value, color }) {
return (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 transition-all hover:border-gray-700 hover:shadow-lg hover:shadow-blue-500/10">
    <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
    <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {value}
    </div>
  </div>
);
}

// InternshipCard component with viewer-specific features
function InternshipCard({ internship, isSaved, onSave, onRemove, viewerMode }) {
const [expanded, setExpanded] = useState(false);

return (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 transition-all hover:border-gray-700">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold">{internship.title}</h3>
      {viewerMode && (
        <button 
          onClick={() => isSaved ? onRemove(internship._id) : onSave(internship._id)}
          className={`p-1 rounded-md ${isSaved ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-gray-300'}`}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      )}
    </div>
    
    
    <p className="text-blue-400 text-sm mb-3">{internship.company}</p>
    
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="px-2 py-1 bg-gray-800 rounded text-xs">{internship.department}</span>
      <span className="px-2 py-1 bg-gray-800 rounded text-xs">{internship.mode}</span>
      <span className="px-2 py-1 bg-gray-800 rounded text-xs">{internship.location}</span>
    </div>
    
    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{internship.description}</p>
    
    <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
      <span>Deadline: {internship.applicationDeadline}</span>
      <span>{internship.internshipDuration}</span>
    </div>
    
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
    >
      {expanded ? 'Show less' : 'Show more details'}
    </button>
    
    {expanded && (
      <div className="mt-4 pt-4 border-t border-gray-800">
        <h4 className="font-medium mb-2">Requirements:</h4>
        <ul className="list-disc list-inside text-sm text-gray-300 mb-4">
          {internship.requirements?.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
        
        <h4 className="font-medium mb-2">Stipend:</h4>
        <p className="text-sm text-gray-300 mb-4">{internship.stipend || 'Not specified'}</p>
        
        <h4 className="font-medium mb-2">SDG Goals:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {internship.sdgGoals?.map((goal, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs">{goal}</span>
          ))}
        </div>
        
        {viewerMode && (
          <button
            onClick={() => {
              // This would navigate to request form with internship pre-selected
              // In a real app, you might use React Router for this
              alert(`Request form for ${internship.title} would open here`);
            }}
            className="w-full mt-4 px-4 py-2 bg-blue-600/90 hover:bg-blue-700/90 rounded-md transition-colors text-sm"
          >
            Request This Internship
          </button>
        )}
      </div>
    )}
  </div>
);
}