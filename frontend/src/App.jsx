import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const EVENT_API = (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/events";
const REGISTRATION_API = (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/registrations";

function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    category: "",
    capacity: ""
  });

  const [registrationForm, setRegistrationForm] = useState({
    participantName: "",
    participantEmail: ""
  });

  // ---------------- LOAD EVENTS ----------------

  const loadEvents = async () => {
    try {
      setLoading(true);

      const response = await axios.get(EVENT_API);

      setEvents(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ---------------- EVENT FORM ----------------

  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };

  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(EVENT_API, {
        ...eventForm,
        capacity: Number(eventForm.capacity)
      });

      setEvents([...events, response.data]);

      setEventForm({
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
        category: "",
        capacity: ""
      });

      setShowCreateForm(false);
      showMessage("Event created successfully!");

    } catch (err) {
      console.error(err);
      showError("Could not create the event.");
    }
  };

  // ---------------- DELETE EVENT ----------------

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${EVENT_API}/${id}`);

      setEvents(events.filter((event) => event.id !== id));

      showMessage("Event deleted successfully!");

    } catch (err) {
      console.error(err);
      showError("Could not delete the event.");
    }
  };

  // ---------------- REGISTRATION ----------------

  const handleRegistrationChange = (e) => {
    setRegistrationForm({
      ...registrationForm,
      [e.target.name]: e.target.value
    });
  };

  const registerForEvent = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${REGISTRATION_API}/${selectedEvent.id}`,
        registrationForm
      );

      showMessage(
        `You are registered for ${selectedEvent.title}!`
      );

      setRegistrationForm({
        participantName: "",
        participantEmail: ""
      });

      setSelectedEvent(null);

    } catch (err) {
      console.error(err);
      showError("Could not complete registration.");
    }
  };

  // ---------------- MESSAGES ----------------

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (text) => {
    setError(text);

    setTimeout(() => {
      setError("");
    }, 3000);
  };

  // ---------------- FILTER ----------------

  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.description.toLowerCase().includes(searchText) ||
      event.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      event.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category))
  ];

  // ---------------- UI ----------------

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Event<span>Hub</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#about">About</a>
        </div>

        <button
          className="nav-button"
          onClick={() => setShowCreateForm(true)}
        >
          + Create Event
        </button>

      </nav>

      {/* HERO */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="hero-tag">
            YOUR EVENT. YOUR EXPERIENCE.
          </p>

          <h1>
            Discover Amazing
            <span> Events</span>
          </h1>

          <p className="hero-description">
            Find exciting events, workshops, seminars and
            activities. Register online and be part of
            something amazing.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("events")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Events â†’
          </button>

        </div>

        <div className="hero-shape">
          <div className="hero-circle">
            EVENT
            <br />
            HUB
          </div>
        </div>

      </section>

      {/* STATS */}

      <section className="stats">

        <div className="stat-box">
          <h2>{events.length}</h2>
          <p>Events Available</p>
        </div>

        <div className="stat-box">
          <h2>{categories.length - 1}</h2>
          <p>Categories</p>
        </div>

        <div className="stat-box">
          <h2>100%</h2>
          <p>Online Registration</p>
        </div>

        <div className="stat-box">
          <h2>24/7</h2>
          <p>Access</p>
        </div>

      </section>

      {/* TOAST */}

      {message && (
        <div className="toast success">
          {message}
        </div>
      )}

      {error && (
        <div className="toast error">
          {error}
        </div>
      )}

      {/* EVENTS SECTION */}

      <section className="events-section" id="events">

        <div className="section-heading">

          <div>
            <p className="section-tag">
              EXPLORE
            </p>

            <h2>
              Upcoming Events
            </h2>
          </div>

          <button
            className="refresh-button"
            onClick={loadEvents}
          >
            â†» Refresh
          </button>

        </div>

        {/* SEARCH */}

        <div className="filters">

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* EVENTS */}

        {loading ? (

          <div className="loading">
            <div className="loader"></div>
            <p>Loading events...</p>
          </div>

        ) : filteredEvents.length === 0 ? (

          <div className="empty-state">

            <h3>No events found</h3>

            <p>
              Try another search or create a new event.
            </p>

            <button
              onClick={() => setShowCreateForm(true)}
            >
              Create Event
            </button>

          </div>

        ) : (

          <div className="event-grid">

            {filteredEvents.map((event) => (

              <article
                className="event-card"
                key={event.id}
              >

                <div className="event-category">
                  {event.category}
                </div>

                <h3>{event.title}</h3>

                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-detail">
                  <span>Location</span>
                  <strong>{event.location}</strong>
                </div>

                <div className="event-detail">
                  <span>Date</span>
                  <strong>{event.date}</strong>
                </div>

                <div className="event-detail">
                  <span>Time</span>
                  <strong>{event.time}</strong>
                </div>

                <div className="event-detail">
                  <span>Capacity</span>
                  <strong>{event.capacity} people</strong>
                </div>

                <div className="card-buttons">

                  <button
                    className="view-button"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Register Now
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* ABOUT */}

      <section className="about" id="about">

        <p className="section-tag">ABOUT US</p>

        <h2>
          Everything You Need to
          <span> Manage Events</span>
        </h2>

        <p>
          EventHub makes it simple to create, discover and
          register for events online. All event information
          is managed through our Spring Boot backend and
          stored securely in MySQL.
        </p>

      </section>

      {/* FOOTER */}

      <footer>
        <h3>Event<span>Hub</span></h3>
        <p>Online Event Management System</p>
      </footer>

      {/* CREATE EVENT MODAL */}

      {showCreateForm && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() => setShowCreateForm(false)}
            >
              Ã—
            </button>

            <h2>Create New Event</h2>

            <form onSubmit={createEvent}>

              <input
                name="title"
                placeholder="Event Title"
                value={eventForm.title}
                onChange={handleEventChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={eventForm.description}
                onChange={handleEventChange}
                required
              />

              <input
                name="location"
                placeholder="Location"
                value={eventForm.location}
                onChange={handleEventChange}
                required
              />

              <select
                name="category"
                value={eventForm.category}
                onChange={handleEventChange}
                required
              >
                <option value="">
                  Select Category
                </option>
                <option>Technology</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Other</option>
              </select>

              <div className="two-columns">

                <input
                  type="date"
                  name="date"
                  value={eventForm.date}
                  onChange={handleEventChange}
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={eventForm.time}
                  onChange={handleEventChange}
                  required
                />

              </div>

              <input
                type="number"
                name="capacity"
                placeholder="Maximum Capacity"
                min="1"
                value={eventForm.capacity}
                onChange={handleEventChange}
                required
              />

              <button
                className="primary-button"
                type="submit"
              >
                Create Event
              </button>

            </form>

          </div>

        </div>

      )}

      {/* REGISTRATION MODAL */}

      {selectedEvent && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() => setSelectedEvent(null)}
            >
              Ã—
            </button>

            <p className="section-tag">
              EVENT REGISTRATION
            </p>

            <h2>{selectedEvent.title}</h2>

            <p>
              {selectedEvent.description}
            </p>

            <div className="registration-info">
              <strong>{selectedEvent.date}</strong>
              <span>â€¢</span>
              <strong>{selectedEvent.time}</strong>
              <span>â€¢</span>
              <strong>{selectedEvent.location}</strong>
            </div>

            <form onSubmit={registerForEvent}>

              <input
                type="text"
                name="participantName"
                placeholder="Your Full Name"
                value={registrationForm.participantName}
                onChange={handleRegistrationChange}
                required
              />

              <input
                type="email"
                name="participantEmail"
                placeholder="Your Email Address"
                value={registrationForm.participantEmail}
                onChange={handleRegistrationChange}
                required
              />

              <button
                className="primary-button"
                type="submit"
              >
                Confirm Registration
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
