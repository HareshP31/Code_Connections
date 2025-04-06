import React, { useState, useRef, useEffect } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const importantDates = {
  "2025-10-03": "KnightHacks",
  "2025-01-25": "SwampHacks",
  "2025-02-07": "WiNGHacks",
  "2025-04-12": "Hackabull",
  "2025-04-05": "HackUSF",
  "2025-09-26": "ShellHacks",
};

const daysOfWeek = ["S", "M", "T", "W", "R", "F", "S"];

const TimelinePage = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state for transition
  const calendarRef = useRef(null);

  const handleScroll = (direction) => {
    setIsTransitioning(true); // Start fade-out animation
    setTimeout(() => {
      setCurrentMonthIndex((prevIndex) => {
        if (direction === "left") {
          return prevIndex === 0 ? 11 : prevIndex - 1;
        } else {
          return prevIndex === 11 ? 0 : prevIndex + 1;
        }
      });
      setIsTransitioning(false); // Start fade-in animation
    }, 300); // Match the duration of the fade-out animation
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const year = 2025;
    const daysInMonth = getDaysInMonth(currentMonthIndex, year);
    const firstDayOfMonth = new Date(year, currentMonthIndex, 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div
        className={`calendar-grid ${isTransitioning ? "fade-out" : "fade-in"}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          width: "66.67vw",
          margin: "0 auto",
          transition: "opacity 0.3s ease", // Smooth fade effect
          opacity: isTransitioning ? 0 : 1, // Control opacity based on transition state
        }}
      >
        {daysOfWeek.map((day) => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>{day}</div>
        ))}
        {calendarDays.map((day, index) => {
          const dateString = day
            ? `${year}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;
          const isImportant = dateString && importantDates[dateString];

          return (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "10px",
                border: isImportant ? "3px solid #744bfa" : "1px solid grey",
                borderRadius: "4px",
                fontWeight: isImportant ? "bold" : "normal",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    );
  };

  const renderImportantDates = () => {
    const currentMonth = months[currentMonthIndex];
    const filteredDates = Object.entries(importantDates).filter(([date]) => {
      const dateObj = new Date(date);
      return dateObj.getMonth() === currentMonthIndex;
    });

    return filteredDates.length > 0 ? (
      filteredDates.map(([date, description]) => (
        <div key={date} className="important-date">
          <strong>{date}</strong>: {description}
        </div>
      ))
    ) : (
      <p>No important dates this month.</p>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCalendarVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (calendarRef.current) {
      observer.observe(calendarRef.current);
    }

    return () => {
      if (calendarRef.current) {
        observer.unobserve(calendarRef.current);
      }
    };
  }, []);

  const scrollToCalendar = () => {
    calendarRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="calendar-container"
      style={{
        padding: "75px",
      }}
    >
      <div
        className="hackathons-timeline"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#3e345c",
          color: "white",
        }}
      >
        <h1>Notable FL Hackathons:</h1>
        <button
          onClick={scrollToCalendar}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Scroll to Calendar
        </button>
        <p>KnightHacks ⚔️ (Fall, UCF)</p>
        <p>ShellHacks 👾 (Fall, FIU)</p>
        <p>HackUSF 🐂 (Spring, USF)</p>
        <p>Hackabull 🐂 (Spring, USF)</p>
        <p>SwampHacks 🐊 (Spring, UF)</p>
        <p>WiNGHacks 🧚(Spring, UF)</p>
      </div>

      <div
        ref={calendarRef}
        className={`calendar-view ${isCalendarVisible ? "fade-in" : "fade-out"}`}
        style={{
          padding: "100px",
          opacity: isCalendarVisible ? 1 : 0,
          transform: isCalendarVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: "20px",
        }}
      >
        <div
          className="month-scroller"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            gap: "20px",
          }}
        >
          <button style={{ minWidth: "40px" }} onClick={() => handleScroll("left")}>&lt;</button>
          <h2 style={{ margin: "0", textAlign: "center", minWidth: "120px" }}>{months[currentMonthIndex]}</h2>
          <button style={{ minWidth: "40px" }} onClick={() => handleScroll("right")}>&gt;</button>
        </div>

        {renderCalendar()}

        <div className="important-dates" style={{ borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <h3>Important Dates</h3>
          {renderImportantDates()}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
