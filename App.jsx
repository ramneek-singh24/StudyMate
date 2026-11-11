import React, { useMemo, useState } from "react";
import {
  Search, Bell, Home, Users, Compass, Bookmark, CalendarDays, Settings,
  SlidersHorizontal, ArrowUpRight, Sparkles, Clock3, MapPin, Plus,
  X, Check, BookOpen, GraduationCap, MessageCircle, ChevronDown,
  Filter, Zap, Target, Menu, Heart, Layers3, CircleHelp, LogOut
} from "lucide-react";

const seedStudents = [
  { id: 1, name: "Aarav Sharma", initials: "AS", branch: "Computer Engineering", year: "2nd Year", subjects: ["Data Structures", "Mathematics", "C Programming"], interests: ["Competitive coding", "AI"], time: "Evenings", location: "Library", bio: "Learning by building. Looking for a consistent problem-solving partner.", color: "violet", score: 96, skills: ["C", "Python", "Problem solving"] },
  { id: 2, name: "Mehak Kapoor", initials: "MK", branch: "Electronics Engineering", year: "1st Year", subjects: ["Mathematics", "Physics", "Basic Electronics"], interests: ["Robotics", "Design"], time: "Afternoons", location: "Hostel study room", bio: "I enjoy breaking difficult concepts into simple notes and diagrams.", color: "rose", score: 91, skills: ["Mathematics", "Figma", "Circuit basics"] },
  { id: 3, name: "Kabir Singh", initials: "KS", branch: "Computer Engineering", year: "2nd Year", subjects: ["Data Structures", "C Programming", "Digital Logic"], interests: ["Hackathons", "Gaming"], time: "Late evenings", location: "Online", bio: "Prefer focused 60-minute sessions and learning through practice.", color: "blue", score: 89, skills: ["C++", "C", "Git"] },
  { id: 4, name: "Ananya Verma", initials: "AV", branch: "Electrical Engineering", year: "1st Year", subjects: ["Mathematics", "Physics", "Chemistry"], interests: ["Reading", "Music"], time: "Mornings", location: "Central library", bio: "Preparing early for exams and happy to exchange notes.", color: "amber", score: 86, skills: ["Physics", "Note making", "Mathematics"] },
  { id: 5, name: "Rohan Mehta", initials: "RM", branch: "Computer Engineering", year: "3rd Year", subjects: ["Python", "Data Structures", "AI/ML"], interests: ["Machine learning", "Startups"], time: "Evenings", location: "Innovation lab", bio: "Can help with Python fundamentals; currently learning machine learning.", color: "green", score: 84, skills: ["Python", "SQL", "Machine learning"] },
  { id: 6, name: "Isha Malhotra", initials: "IM", branch: "Mechanical Engineering", year: "2nd Year", subjects: ["Mathematics", "Physics", "CAD"], interests: ["Product design", "Badminton"], time: "Afternoons", location: "Department lounge", bio: "Looking for a study group that keeps each other accountable.", color: "cyan", score: 82, skills: ["CAD", "Physics", "Mathematics"] }
];

const seedGroups = [
  { id: 101, title: "DSA: 30 Days of Practice", subject: "Data Structures", members: 18, capacity: 25, schedule: "Mon, Wed & Fri · 6:00 PM", level: "Intermediate", description: "Solve problems together, discuss approaches and build consistency.", tags: ["Problem solving", "Coding"], joined: false },
  { id: 102, title: "First-Year Math Circle", subject: "Mathematics", members: 12, capacity: 20, schedule: "Tue & Thu · 5:00 PM", level: "Beginner friendly", description: "A friendly space to revise concepts and work through examples.", tags: ["Calculus", "Practice"], joined: true },
  { id: 103, title: "Electronics Made Simple", subject: "Basic Electronics", members: 9, capacity: 15, schedule: "Saturday · 11:00 AM", level: "Beginner", description: "Learn circuit fundamentals with diagrams, examples and peer explanations.", tags: ["Circuits", "Revision"], joined: false }
];

const subjects = ["All subjects", "Mathematics", "Data Structures", "C Programming", "Physics", "Digital Logic", "Python", "Basic Electronics"];
const navItems = [
  ["Overview", Home], ["Find buddies", Compass], ["Study circles", Users],
  ["Saved people", Bookmark], ["My schedule", CalendarDays]
];

function readStore(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be unavailable */ }
}
function compatibility(student, mySubjects, myTime) {
  const shared = student.subjects.filter(s => mySubjects.includes(s)).length;
  const subjectScore = mySubjects.length ? Math.round(shared / Math.max(mySubjects.length, 1) * 65) : 35;
  const timeScore = student.time === myTime ? 25 : 12;
  return Math.min(99, Math.max(42, subjectScore + timeScore + 10));
}

function Avatar({ student, size = "normal" }) {
  return <div className={`avatar ${student.color || "violet"} ${size}`} aria-label={student.name}>{student.initials}</div>;
}

function App() {
  const [page, setPage] = useState("Overview");
  const [students, setStudents] = useState(() => readStore("studymate_students", seedStudents));
  const [saved, setSaved] = useState(() => readStore("studymate_saved", [2, 5]));
  const [groups, setGroups] = useState(() => readStore("studymate_groups", seedGroups));
  const [joined, setJoined] = useState(() => readStore("studymate_joined", [102]));
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [year, setYear] = useState("All years");
  const [time, setTime] = useState("Evenings");
  const [mySubjects, setMySubjects] = useState(["Mathematics", "Data Structures", "C Programming"]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [newGroup, setNewGroup] = useState({ title: "", subject: "Mathematics", schedule: "", description: "" });

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2600);
  };

  const filteredStudents = useMemo(() => students.filter(s => {
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || [s.name, s.branch, ...s.subjects, ...s.interests].join(" ").toLowerCase().includes(q);
    const matchesSubject = subject === "All subjects" || s.subjects.includes(subject);
    const matchesYear = year === "All years" || s.year === year;
    return matchesQuery && matchesSubject && matchesYear;
  }).map(s => ({ ...s, match: compatibility(s, mySubjects, time) }))
    .sort((a, b) => b.match - a.match), [students, query, subject, year, mySubjects, time]);

  const savedStudents = students.filter(s => saved.includes(s.id));
  const joinedGroups = groups.filter(g => joined.includes(g.id));
  const saveProfile = (id) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(next); writeStore("studymate_saved", next);
    notify(next.includes(id) ? "Added to your saved buddies" : "Removed from saved buddies");
  };
  const toggleJoin = (id) => {
    const next = joined.includes(id) ? joined.filter(x => x !== id) : [...joined, id];
    setJoined(next); writeStore("studymate_joined", next);
    notify(next.includes(id) ? "You're in! Group joined." : "You left the study circle.");
  };
  const createGroup = (e) => {
    e.preventDefault();
    if (!newGroup.title.trim() || !newGroup.schedule.trim()) return notify("Please add a group name and schedule.");
    const group = { id: Date.now(), ...newGroup, members: 1, capacity: 20, level: "Open to all", tags: ["Student-created"], joined: true };
    const next = [group, ...groups]; setGroups(next); writeStore("studymate_groups", next);
    const nextJoined = [...joined, group.id]; setJoined(nextJoined); writeStore("studymate_joined", nextJoined);
    setGroupOpen(false); setNewGroup({ title: "", subject: "Mathematics", schedule: "", description: "" });
    setPage("Study circles"); notify("Your study circle is live!");
  };
  const addSubject = (s) => setMySubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const StudentCard = ({ student }) => (
    <article className="student-card">
      <div className="card-top">
        <Avatar student={student} />
        <button className={`icon-button save-button ${saved.includes(student.id) ? "is-saved" : ""}`} onClick={() => saveProfile(student.id)} aria-label="Save profile">
          <Heart size={17} fill={saved.includes(student.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="student-name-row"><h3>{student.name}</h3><span className="match-pill"><Sparkles size={12}/>{student.match || compatibility(student, mySubjects, time)}% match</span></div>
      <p className="muted small">{student.branch} · {student.year}</p>
      <p className="bio">{student.bio}</p>
      <div className="tag-list">{student.subjects.slice(0, 3).map(t => <span className="tag" key={t}>{t}</span>)}</div>
      <div className="student-meta"><span><Clock3 size={14}/>{student.time}</span><span><MapPin size={14}/>{student.location}</span></div>
      <button className="button button-secondary full" onClick={() => setActiveStudent(student)}>View profile <ArrowUpRight size={15}/></button>
    </article>
  );

  const GroupCard = ({ group }) => (
    <article className="group-card">
      <div className="group-icon"><BookOpen size={21}/></div>
      <div className="group-heading"><div><span className="eyebrow">{group.subject}</span><h3>{group.title}</h3></div><span className="level-pill">{group.level}</span></div>
      <p className="muted group-description">{group.description}</p>
      <div className="group-meta"><span><Users size={15}/>{group.members + (joined.includes(group.id) && !group.joined ? 1 : 0)} / {group.capacity} members</span><span><CalendarDays size={15}/>{group.schedule}</span></div>
      <div className="group-bottom"><div className="tag-list">{(group.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div><button className={`button ${joined.includes(group.id) ? "button-joined" : "button-primary"}`} onClick={() => toggleJoin(group.id)}>{joined.includes(group.id) ? <><Check size={15}/> Joined</> : <><Plus size={15}/> Join group</>}</button></div>
    </article>
  );

  const renderMain = () => {
    if (page === "Find buddies") return <>
      <div className="page-heading"><div><span className="eyebrow">YOUR LEARNING COMMUNITY</span><h1>Find your study people.</h1><p className="muted">Discover students who share your subjects, goals and schedule.</p></div><div className="heading-stat"><strong>{filteredStudents.length}</strong><span>students found</span></div></div>
      <div className="filter-panel">
        <div className="search-wrap"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, subject or interest..." aria-label="Search students"/></div>
        <select value={subject} onChange={e => setSubject(e.target.value)} aria-label="Filter by subject">{subjects.map(s => <option key={s}>{s}</option>)}</select>
        <select value={year} onChange={e => setYear(e.target.value)} aria-label="Filter by year"><option>All years</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option></select>
        <button className="button button-secondary" onClick={() => {setQuery("");setSubject("All subjects");setYear("All years");}}><Filter size={15}/> Reset</button>
      </div>
      {filteredStudents.length ? <div className="student-grid">{filteredStudents.map(s => <StudentCard key={s.id} student={s}/>)}</div> : <div className="empty-state"><Search size={28}/><h3>No students found</h3><p>Try another name, subject or filter.</p><button className="button button-secondary" onClick={() => {setQuery("");setSubject("All subjects");setYear("All years");}}>Clear filters</button></div>}
    </>;

    if (page === "Study circles") return <>
      <div className="page-heading"><div><span className="eyebrow">LEARN BETTER, TOGETHER</span><h1>Study circles.</h1><p className="muted">Small communities make big goals feel achievable.</p></div><button className="button button-primary" onClick={() => setGroupOpen(true)}><Plus size={17}/> Create a circle</button></div>
      <div className="callout"><div className="callout-icon"><Users size={21}/></div><div><strong>Good things happen when you learn together.</strong><p>Join a circle to share resources, stay accountable and make progress as a team.</p></div></div>
      <div className="section-title"><h2>Explore communities</h2><span className="muted small">{groups.length} active circles</span></div>
      <div className="group-grid">{groups.map(g => <GroupCard key={g.id} group={g}/>)}</div>
    </>;

    if (page === "Saved people") return <>
      <div className="page-heading"><div><span className="eyebrow">YOUR SHORTLIST</span><h1>Saved buddies.</h1><p className="muted">Profiles you bookmarked for a future study session.</p></div></div>
      {savedStudents.length ? <div className="student-grid">{savedStudents.map(s => <StudentCard key={s.id} student={{...s, match: compatibility(s, mySubjects, time)}}/>)}</div> : <div className="empty-state"><Bookmark size={28}/><h3>No saved buddies yet</h3><p>Save profiles from Find buddies and they will appear here.</p><button className="button button-primary" onClick={() => setPage("Find buddies")}>Discover students</button></div>}
    </>;

    if (page === "My schedule") return <>
      <div className="page-heading"><div><span className="eyebrow">MAKE TIME TO LEARN</span><h1>Your study rhythm.</h1><p className="muted">Set your preferred time so StudyMate can suggest more compatible people.</p></div></div>
      <div className="settings-card"><div className="settings-icon"><Clock3/></div><div className="settings-content"><h3>Preferred study time</h3><p className="muted">Your availability is used in the compatibility score.</p><div className="choice-row">{["Mornings","Afternoons","Evenings","Late evenings"].map(t => <button key={t} onClick={() => {setTime(t);notify("Availability preference updated");}} className={`choice ${time === t ? "choice-active" : ""}`}>{time === t && <Check size={14}/>} {t}</button>)}</div></div></div>
      <div className="settings-card"><div className="settings-icon"><BookOpen/></div><div className="settings-content"><h3>Your study subjects</h3><p className="muted">Choose the subjects you want to study with others.</p><div className="choice-row">{subjects.slice(1).map(s => <button key={s} onClick={() => addSubject(s)} className={`choice ${mySubjects.includes(s) ? "choice-active" : ""}`}>{mySubjects.includes(s) && <Check size={14}/>} {s}</button>)}</div></div></div>
      <div className="callout subtle-callout"><Sparkles size={20}/><p><strong>Your matching profile is ready.</strong><br/>Update your subjects and availability to make recommendations more relevant.</p></div>
    </>;

    return <>
      <section className="hero">
        <div className="hero-copy"><span className="hero-kicker"><Sparkles size={14}/> YOUR CAMPUS, YOUR COMMUNITY</span><h1>Better together.<br/><em>Brighter futures.</em></h1><p>Find people who make learning more meaningful. Your next great study session starts here.</p><button className="button button-light" onClick={() => setPage("Find buddies")}>Find my study buddy <ArrowUpRight size={16}/></button></div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-orb"><GraduationCap size={62}/></div><div className="float-card float-top"><Sparkles size={15}/> 96% compatibility</div><div className="float-card float-bottom"><Users size={15}/> Learn as a team</div></div>
      </section>
      <div className="welcome-row"><div><span className="eyebrow">YOUR SPACE</span><h2>Welcome to your learning hub.</h2></div><span className="date-chip"><CalendarDays size={15}/> Your campus community</span></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><Users size={18}/></div><div><strong>{students.length}</strong><span>Student profiles</span></div><small>Ready to connect</small></div>
        <div className="stat-card"><div className="stat-icon blue"><Bookmark size={18}/></div><div><strong>{saved.length}</strong><span>Saved buddies</span></div><small>Your shortlist</small></div>
        <div className="stat-card"><div className="stat-icon green"><Layers3 size={18}/></div><div><strong>{joined.length}</strong><span>Joined circles</span></div><small>Learning together</small></div>
      </div>
      <div className="section-title"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>People you might click with.</h2></div><button className="text-button" onClick={() => setPage("Find buddies")}>See everyone <ArrowUpRight size={15}/></button></div>
      <div className="student-grid">{filteredStudents.slice(0, 3).map(s => <StudentCard key={s.id} student={s}/>)}</div>
      <div className="section-title circles-title"><div><span className="eyebrow">FIND YOUR CREW</span><h2>Popular study circles.</h2></div><button className="text-button" onClick={() => setPage("Study circles")}>Explore circles <ArrowUpRight size={15}/></button></div>
      <div className="group-grid compact-groups">{groups.slice(0, 2).map(g => <GroupCard key={g.id} group={g}/>)}</div>
    </>;
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={21}/></div><span>study<span className="brand-accent">mate</span><small>STUDENT COMMUNITY</small></span><button className="mobile-close icon-button" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navItems.map(([label, Icon]) => <button key={label} className={`nav-link ${page === label ? "nav-active" : ""}`} onClick={() => {setPage(label);setMobileNav(false);}}><Icon size={18}/><span>{label}</span>{label === "Saved people" && saved.length > 0 && <small>{saved.length}</small>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="profile-mini"><div className="my-avatar">D</div><div><strong>Demo Student</strong><span>Thapar University</span></div><button className="icon-button" title="Demo profile"><Settings size={16}/></button></div><div className="sidebar-note"><div className="note-icon"><Zap size={15}/></div><strong>Small steps, big progress.</strong><p>Your next study partner is one click away.</p><button onClick={() => setPage("Find buddies")}>Explore now <ArrowUpRight size={13}/></button></div><span className="version-label">STUDYMATE · DEMO 1.0</span></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="top-actions"><div className="campus-label"><span></span> Campus demo</div><button className="icon-button notification" onClick={() => notify("You're all caught up!")} aria-label="Notifications"><Bell size={18}/><i></i></button><div className="top-avatar">D</div></div></header>
      <div className="content-area">{renderMain()}<footer><span>© 2026 StudyMate</span><span>Built for better campus connections <Heart size={12}/></span></footer></div>
    </main>

    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu"/>}

    {activeStudent && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setActiveStudent(null);}}><div className="modal profile-modal"><button className="modal-close icon-button" onClick={() => setActiveStudent(null)}><X/></button><div className="profile-modal-head"><Avatar student={activeStudent} size="large"/><div><span className="match-pill"><Sparkles size={12}/>{compatibility(activeStudent, mySubjects, time)}% compatible</span><h2>{activeStudent.name}</h2><p className="muted">{activeStudent.branch} · {activeStudent.year}</p></div></div><p className="profile-bio">{activeStudent.bio}</p><div className="detail-block"><strong>Subjects to study</strong><div className="tag-list">{activeStudent.subjects.map(s => <span className="tag" key={s}>{s}</span>)}</div></div><div className="detail-block"><strong>Skills they can share</strong><div className="tag-list">{activeStudent.skills.map(s => <span className="tag" key={s}>{s}</span>)}</div></div><div className="detail-grid"><div><Clock3 size={15}/><span>{activeStudent.time}</span></div><div><MapPin size={15}/><span>{activeStudent.location}</span></div></div><div className="why-match"><Sparkles size={17}/><div><strong>Why this match?</strong><p>You share {activeStudent.subjects.filter(s => mySubjects.includes(s)).length} study subject(s). Their preferred study time is {activeStudent.time.toLowerCase()}.</p></div></div><button className={`button full ${saved.includes(activeStudent.id) ? "button-joined" : "button-primary"}`} onClick={() => saveProfile(activeStudent.id)}>{saved.includes(activeStudent.id) ? <><Check size={16}/> Saved to your buddies</> : <><Heart size={16}/> Save this buddy</>}</button><p className="privacy-note">Demo experience: profiles are sample data. Contact and messaging are not enabled.</p></div></div>}

    {groupOpen && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setGroupOpen(false);}}><form className="modal create-modal" onSubmit={createGroup}><button type="button" className="modal-close icon-button" onClick={() => setGroupOpen(false)}><X/></button><span className="eyebrow">BRING PEOPLE TOGETHER</span><h2>Create a study circle</h2><p className="muted">Start a small learning community around a subject or goal.</p><label>Circle name<input required maxLength="60" placeholder="e.g. Calculus revision crew" value={newGroup.title} onChange={e => setNewGroup({...newGroup,title:e.target.value})}/></label><label>Subject<select value={newGroup.subject} onChange={e => setNewGroup({...newGroup,subject:e.target.value})}>{subjects.slice(1).map(s => <option key={s}>{s}</option>)}</select></label><label>Schedule<input required maxLength="80" placeholder="e.g. Tuesday & Thursday · 5 PM" value={newGroup.schedule} onChange={e => setNewGroup({...newGroup,schedule:e.target.value})}/></label><label>Description<textarea maxLength="180" placeholder="What will your group work on?" value={newGroup.description} onChange={e => setNewGroup({...newGroup,description:e.target.value})}/></label><button className="button button-primary full" type="submit"><Plus size={16}/> Create study circle</button></form></div>}

    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}

export default App;
