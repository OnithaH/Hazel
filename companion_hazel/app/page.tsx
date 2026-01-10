import React from 'react';
import { Clock, TrendingUp, Target, Flame, Brain, Trophy, Droplet, BookOpen, Gamepad2, Music, MessageSquare, Calendar, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-lg font-semibold">HAZEL</span>
            </div>
            
            <div className="flex items-center gap-1">
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Study</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-sm">Gaming</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
                <Music className="w-4 h-4" />
                <span className="text-sm">Music</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">General</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition">
                Login
              </button>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm">U</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-normal mb-2">Welcome Back, User</h1>
          <p className="text-white/60">Here&apos;s what&apos;s happening with Hazel today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm">Today</span>
            </div>
            <div className="text-3xl font-normal mb-1">4h 23m</div>
            <div className="text-white/60 text-sm">Focus Time</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm">+12%</span>
            </div>
            <div className="text-3xl font-normal mb-1">89%</div>
            <div className="text-white/60 text-sm">Focus Score</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <Target className="w-5 h-5 text-pink-400" />
              <span className="text-pink-400 text-sm">3/5</span>
            </div>
            <div className="text-3xl font-normal mb-1">3</div>
            <div className="text-white/60 text-sm">Goals Completed</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <Flame className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="text-3xl font-normal mb-1">12</div>
            <div className="text-white/60 text-sm">Day Streak</div>
          </div>
        </div>

        {/* Focus Session & Side Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-normal">Today&apos;s Focus Session</h2>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm">In Progress</span>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 mb-6">
              <div className="text-center">
                <div className="text-6xl font-normal mb-2">2:34:15</div>
                <div className="text-white/60">Time Elapsed</div>
              </div>
              <div className="mt-8 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl"></div>
            </div>

            <div>
              <h3 className="text-lg font-normal mb-4">Today&apos;s Activity Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-lg h-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{width: '65%'}}></div>
                  </div>
                  <span className="text-white/60 text-sm w-20">Study 65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-lg h-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{width: '15%'}}></div>
                  </div>
                  <span className="text-white/60 text-sm w-20">Gaming 15%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-lg h-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400" style={{width: '12%'}}></div>
                  </div>
                  <span className="text-white/60 text-sm w-20">Music 12%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-lg h-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{width: '8%'}}></div>
                  </div>
                  <span className="text-white/60 text-sm w-20">General 8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <h3 className="font-normal">Brain Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Focus Level</span>
                  <span className="text-purple-400 text-sm">High</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="font-normal">Weekly Goal</h3>
              </div>
              <div className="space-y-1 mb-3">
                <div className="text-3xl font-normal">24/30</div>
                <div className="text-white/60 text-sm">Hours completed</div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{width: '80%'}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Droplet className="w-6 h-6 text-cyan-400" />
                <h3 className="font-normal">Environment</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-2">
                  <span className="text-white/60 text-xs">Lighting</span>
                  <span className="text-cyan-400 text-xs">Optimal</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-2">
                  <span className="text-white/60 text-xs">Aroma</span>
                  <span className="text-cyan-400 text-xs">Peppermint</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-2">
                  <span className="text-white/60 text-xs">Audio</span>
                  <span className="text-cyan-400 text-xs">Shield On</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-normal mb-6">Mode Access</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-normal mb-2">Study Mode</h3>
              <p className="text-white/60 text-sm mb-4">Focus tracking & learning</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{width: '75%'}}></div>
                </div>
                <span className="text-white/60 text-xs">75%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-normal mb-2">Gaming Mode</h3>
              <p className="text-white/60 text-sm mb-4">Mind-refreshing games</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{width: '50%'}}></div>
                </div>
                <span className="text-white/60 text-xs">50%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-normal mb-2">Music Mode</h3>
              <p className="text-white/60 text-sm mb-4">Gesture-controlled music</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500" style={{width: '80%'}}></div>
                </div>
                <span className="text-white/60 text-xs">80%</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-normal mb-2">General Mode</h3>
              <p className="text-white/60 text-sm mb-4">Chat & reminders</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{width: '67%'}}></div>
                </div>
                <span className="text-white/60 text-xs">67%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions & Upcoming Schedule */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-normal mb-4">Recent Sessions</h3>
            <div className="space-y-4">
              {[
                { mode: 'Study Mode', time: '10:00 AM', duration: '2h 15m', score: '92%', color: 'blue' },
                { mode: 'Music Mode', time: '2:30 PM', duration: '45m', score: '88%', color: 'pink' },
                { mode: 'Gaming Mode', time: '4:15 PM', duration: '20m', score: '95%', color: 'purple' },
                { mode: 'Study Mode', time: '6:00 PM', duration: '1h 30m', score: '87%', color: 'blue' }
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full bg-${session.color}-500`}></div>
                    <div>
                      <div className="font-normal">{session.mode}</div>
                      <div className="text-white/60 text-xs">{session.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-normal">{session.duration}</div>
                      <div className="text-white/60 text-xs">Score: {session.score}</div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-normal">Upcoming Schedule</h3>
              <Calendar className="w-5 h-5 text-white/60" />
            </div>
            <div className="space-y-4">
              {[
                { title: 'Math Study Session', time: 'Today, 3:00 PM', tag: 'Study', tagColor: 'blue' },
                { title: 'Music Practice', time: 'Today, 5:00 PM', tag: 'Music', tagColor: 'pink' },
                { title: 'Revision Q&A', time: 'Tomorrow, 10:00 AM', tag: 'Study', tagColor: 'blue' },
                { title: 'Project Submission', time: 'Dec 25, 11:59 PM', tag: 'Reminder', tagColor: 'orange' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-normal">{item.title}</div>
                    <span className={`px-3 py-1 bg-${item.tagColor}-500/20 text-${item.tagColor}-400 rounded-full text-xs`}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-white/60 text-xs">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-normal mb-6">Weekly Overview</h2>
          <div className="space-y-4 mb-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex items-center gap-4">
                <span className="text-white/60 text-sm w-12">{day}</span>
                <div className="flex-1 bg-white/5 rounded-lg h-12 overflow-hidden flex">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400" style={{width: '35%'}}></div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400" style={{width: '10%'}}></div>
                  <div className="bg-gradient-to-r from-pink-500 to-pink-400" style={{width: '15%'}}></div>
                  <div className="bg-gradient-to-r from-green-500 to-green-400" style={{width: '8%'}}></div>
                </div>
                <span className="text-white/60 text-sm w-8 text-right">{['4h', '3h', '3h', '4h', '4h', '3h', '5h'][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-white/60 text-sm">Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-white/60 text-sm">Gaming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-white/60 text-sm">Music</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white/60 text-sm">General</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-black mt-12">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-4 gap-16 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-semibold">Hazel</span>
              </div>
              <p className="text-white/60 text-sm">Your intelligent companion robot for study, gaming, and everyday life.</p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>Made with</span>
                <span className="text-red-500">❤</span>
                <span>by the Hazel Team</span>
              </div>
            </div>

            <div>
              <h4 className="font-normal mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Modes</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-normal mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">© 2025 Hazel. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}