// FacultyMentees.jsx
const FacultyMentees = () => {
    const mentees = [
      { id: 1, name: 'Alex Johnson', progress: 75, lastMeeting: '2023-06-15' },
      { id: 2, name: 'Sarah Williams', progress: 60, lastMeeting: '2023-06-10' },
      { id: 3, name: 'Michael Chen', progress: 90, lastMeeting: '2023-06-12' },
      { id: 4, name: 'Emma Davis', progress: 45, lastMeeting: '2023-05-28' },
    ];
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            My Mentees
          </h2>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
            Add New Mentee
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentees.map(mentee => (
            <div key={mentee.id} className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-medium">
                    {mentee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{mentee.name}</h3>
                  <p className="text-xs text-neutral-400">Last meeting: {mentee.lastMeeting}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{mentee.progress}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" 
                    style={{ width: `${mentee.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                  Message
                </button>
                <button className="flex-1 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default FacultyMentees;