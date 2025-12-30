import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Settings.css";
import { FaCheck, FaCamera, FaSignOutAlt, FaShieldAlt, FaMoon, FaSun } from "react-icons/fa";

/**
 * NOTE: this uses the uploaded image file you provided as the default avatar.
 * The local path used below will be transformed by your environment if needed.
 */
const UPLOADED_AVATAR_PATH = "/mnt/data/e37d65f0-82e9-485d-8da8-c9ebd89c0f7c.png";

const defaultCategories = [
  "Groceries",
  "Bills",
  "Internet",
  "Rent",
  "Food",
  "Salary",
  "Travel",
  "Medical",
  "Recharge",
  "Shopping",
  "Entertainment",
];

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("profile");

  // Profile (view-only)
  const [profile, setProfile] = useState({ username: "", email: "" });

  // Avatar: prefer saved avatar, then uploaded image path, then gradient initial
  const [avatarUrl, setAvatarUrl] = useState("");

  // Categories (local)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Notifications (local)
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    marketing: false,
  });

  // Security
  const [twoFA, setTwoFA] = useState(false);
  const [devices, setDevices] = useState([]);

  // Theme (dark / light)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load profile from localStorage (your auth flow should already save user)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.username || storedUser?.email) {
      setProfile({ username: storedUser.username || "", email: storedUser.email || "" });
    }

    // Avatar: check saved, otherwise use uploaded path if exists
    const savedAvatar = localStorage.getItem("avatarUrl");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    } else {
      // fallback to uploaded image path if file exists in your environment
      // (we provide this path; your environment will convert it to a URL if needed)
      setAvatarUrl(UPLOADED_AVATAR_PATH);
    }

    // categories
    const savedCats = JSON.parse(localStorage.getItem("selectedCategories") || "[]");
    setSelectedCategories(savedCats);

    // notifications
    const savedNot = JSON.parse(localStorage.getItem("notifications") || "null");
    if (savedNot) setNotifications(savedNot);

    // twoFA
    const saved2 = localStorage.getItem("twoFA");
    setTwoFA(saved2 === "true");

    // theme
    const savedTheme = localStorage.getItem("darkMode");
    setDarkMode(savedTheme === "true");
    updateBodyClass(savedTheme === "true");

    // devices (mock): current device + a sample older device
    const ua = navigator.userAgent || "Unknown device";
    const now = new Date().toLocaleString();
    const savedDevices = JSON.parse(localStorage.getItem("devices") || "null");
    if (savedDevices) {
      setDevices(savedDevices);
    } else {
      const initial = [
        { id: 1, name: ua, when: now, current: true },
        { id: 2, name: "Android Chrome (Old Device)", when: "2025-11-03 09:12", current: false },
      ];
      setDevices(initial);
      localStorage.setItem("devices", JSON.stringify(initial));
    }
  }, []);

  // Helpers
  function updateBodyClass(enableDark) {
    if (enableDark) document.body.classList.add("settings-dark");
    else document.body.classList.remove("settings-dark");
  }

  // Avatar upload
  const onAvatarPick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    localStorage.setItem("avatarUrl", url);
  };

  // Toggle category
  const toggleCategory = (cat) => {
    let updated;
    if (selectedCategories.includes(cat)) updated = selectedCategories.filter((c) => c !== cat);
    else updated = [...selectedCategories, cat];
    setSelectedCategories(updated);
    localStorage.setItem("selectedCategories", JSON.stringify(updated));
  };

  // Toggle notification
  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  // Toggle 2FA
  const toggleTwoFA = () => {
    const newVal = !twoFA;
    setTwoFA(newVal);
    localStorage.setItem("twoFA", newVal ? "true" : "false");
  };

  // Theme toggle
  const toggleTheme = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("darkMode", newVal ? "true" : "false");
    updateBodyClass(newVal);
  };

  // Logout all devices (clear localStorage and redirect to login)
  const handleLogoutAll = () => {
    if (!window.confirm("Logout from all devices? This will clear localStorage and redirect to login.")) return;
    localStorage.clear();
    // keep the uploaded avatar file path? per requirement we clear everything
    window.location.href = "/login"; // hard redirect to ensure logged out; or use navigate
  };

  // Remove a device from list
  const removeDevice = (id) => {
    const updated = devices.filter((d) => d.id !== id);
    setDevices(updated);
    localStorage.setItem("devices", JSON.stringify(updated));
  };

  // Render avatar fallback initial
  const AvatarFallback = ({ name }) => {
    const initial = (name && name[0]) ? name[0].toUpperCase() : "U";
    return (
      <div className="avatar-gradient">
        <span>{initial}</span>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="settings-content">
        {/* Top heading + theme toggle */}
        <div className="settings-header">
          <div>
            <h1 className="settings-main-title">Settings</h1>
            <p className="settings-sub">Manage profile, categories, notifications and security</p>
          </div>

          <div className="settings-header-actions">
            <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
              {darkMode ? <><FaSun /> Light</> : <><FaMoon /> Dark</>}
            </button>
          </div>
        </div>

        <div className="settings-container">
          {/* LEFT MENU */}
          <div className="settings-menu">
            <p className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Profile</p>
            <p className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categories</p>
            <p className={tab === "notifications" ? "active" : ""} onClick={() => setTab("notifications")}>Notifications</p>
            <p className={tab === "security" ? "active" : ""} onClick={() => setTab("security")}>Security</p>
          </div>

          {/* RIGHT PANEL */}
          <div className="settings-detail">
            {/* PROFILE (view-only) */}
            {tab === "profile" && (
              <section className="settings-section">
                <div className="profile-top">
                  <div className="avatar-wrapper">
                    {avatarUrl ? (
                      // show image if available (your environment should transform the local path)
                      <img src={avatarUrl} alt="avatar" className="avatar-img" onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }} />
                    ) : null}
                    {!avatarUrl && <AvatarFallback name={profile.username} />}

                    {/* Camera / upload */}
                    <div className="avatar-actions">
                      <button className="avatar-upload-btn" onClick={() => fileInputRef.current?.click()}>
                        <FaCamera /> Change
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onAvatarPick} />
                    </div>
                  </div>

                  <div className="profile-info">
                    <h3>{profile.username || "User"}</h3>
                    <p className="muted">{profile.email || "No email available"}</p>
                    <p className="small-note">Profile is view-only here (edit on registration or profile page).</p>
                  </div>
                </div>
              </section>
            )}

            {/* CATEGORIES */}
            {tab === "categories" && (
              <section className="settings-section">
                <h3>Select categories you commonly use</h3>
                <p className="muted">Selected categories are saved locally and used across the app UI.</p>

                <ul className="category-select-list">
                  {defaultCategories.map((cat) => (
                    <li
                      key={cat}
                      className={selectedCategories.includes(cat) ? "selected" : ""}
                      onClick={() => toggleCategory(cat)}
                    >
                      <span>{cat}</span>
                      {selectedCategories.includes(cat) && <FaCheck className="tick" />}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* NOTIFICATIONS */}
            {tab === "notifications" && (
              <section className="settings-section">
                <h3>Notification Settings</h3>
                <p className="muted">These toggles are saved locally only.</p>

                <div className="notification-container">
                  <div className="notify-item">
                    <span>Email notifications</span>
                    <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification("email")} />
                  </div>

                  <div className="notify-item">
                    <span>App alerts</span>
                    <input type="checkbox" checked={notifications.app} onChange={() => toggleNotification("app")} />
                  </div>

                  <div className="notify-item">
                    <span>Marketing messages</span>
                    <input type="checkbox" checked={notifications.marketing} onChange={() => toggleNotification("marketing")} />
                  </div>
                </div>
              </section>
            )}

            {/* SECURITY */}
            {tab === "security" && (
              <section className="settings-section">
                <h3><FaShieldAlt /> Security</h3>
                <p className="muted">Control basic security options for your account (local-only UI)</p>

                <div className="security-block">
                  <div className="security-row">
                    <div>
                      <strong>Two-Factor Authentication</strong>
                      <p className="muted small-note">Toggle to enable/disable a mock 2FA (local only).</p>
                    </div>
                    <div>
                      <input type="checkbox" checked={twoFA} onChange={toggleTwoFA} />
                    </div>
                  </div>

                  <div className="security-row">
                    <div>
                      <strong>Change Password</strong>
                      <p className="muted small-note">Password change requires backend — placeholder UI below.</p>
                    </div>
                    <div className="change-password">
                      <input type="password" placeholder="New password (disabled)" disabled />
                      <input type="password" placeholder="Confirm password (disabled)" disabled />
                    </div>
                  </div>

                  <div className="security-row devices">
                    <div style={{ flex: 1 }}>
                      <strong>Logged in devices</strong>
                      <p className="muted small-note">Manage devices that have access to your account (local mock).</p>

                      <ul className="device-list">
                        {devices.map((d) => (
                          <li key={d.id}>
                            <div>
                              <div className="device-name">{d.name}</div>
                              <div className="device-time muted">{d.when}</div>
                            </div>
                            <div className="device-actions">
                              {!d.current && <button className="device-remove" onClick={() => removeDevice(d.id)}>Remove</button>}
                              {d.current && <span className="current-badge">Current</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="security-actions">
                    <button className="logout-all" onClick={handleLogoutAll}><FaSignOutAlt /> Logout from all devices</button>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
