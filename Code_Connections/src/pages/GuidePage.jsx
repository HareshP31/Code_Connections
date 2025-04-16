import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import collaboration from "../assets/collaborationcc.json"
import expect from "../assets/expectcc.json"
import goals from "../assets/goalscc.json"
import confused from "../assets/confusedcc.json"
import "../styles/GuidePage.css";

const GuidePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { title: "What is a Hackathon?", content: (
      <>
      <div className="hackathon-container">
        <div className="hackathon-section">
          <p>A hackathon is an event where you can work alone or on a team to create something (consider finding a team on Code Connections!). Despite having "hack" in the name, it does not have to do with hacking! At hackathons, people create anything,
          from games to hardware projects. Hackathons are usually time-limited, often lasting 24 
          to 48 hours, where participants brainstorm ideas, develop prototypes, and showcase their projects. They’re a great way to learn new skills, 
          collaborate with others, and bring creative ideas to life. Whether you're a beginner or an experienced coder, 
          hackathons provide a supportive environment to experiment,
          build something cool, and have fun! Plus, many hackathons offer mentorship, workshops, and prizes to help teams succeed. Hackathons are 
          valuable opportunities to get real world skills and impress potential employers with knowledge from outside the classroom.
          </p>
          <Lottie animationData={collaboration} className="lottie-collaboration" />
        </div>
      </div>
      </>  
      ),
    },
    { title: "What To Expect?", content: (
      <>
      <div className="hackathon-container">
        <div className="hackathon-section">
        <p>At a hackathon, you can expect a fast-paced, collaborative, and exciting environment filled with people eager to build and learn. 
            There will be an opening ceremony where organizers introduce the theme (if there is one), go over rules, 
            and share important logistics. After that, teams form (if you don’t have one already) 
            and start brainstorming ideas before diving into coding and development. Throughout the event,
             there will likely be workshops, mentor sessions, and mini-challenges to help you improve your skills and refine your project. 
             Expect a mix of focused work sessions, networking opportunities, and social activities to keep the energy up. 
             Many hackathons provide food, drinks, and even fun breaks like games or midnight snacks. 
             At the end, teams present their projects to a panel of judges, who give feedback and award prizes.
        </p>
        <Lottie animationData={expect} className="lottie-expect" />
        </div>
      </div>
      </>
      ),
    },
    { title: "Feeling Lost?", content: (
      <>
      <div className="hackathon-container">
        <div className="hackathon-section">
        <p>If all of that sounds overwhelming, don’t worry! Hackathons are meant to be fun and welcoming, no matter your skill level. 
          You don’t need to be an expert programmer or have a perfect idea before you start. Many participants are beginners, 
          and there will be mentors, workshops, and teammates to help you along the way. The goal isn’t just to win, it’s to learn, 
          try something new, and enjoy the experience. You can go at your own pace, take breaks when needed, and focus on what interests 
          you most. Everyone is there to support each other, and the best projects often come from just experimenting and having fun. 
          No matter what, you’ll walk away with new skills, new friends, and a cool experience to remember!
        </p>
        <Lottie animationData={confused} className="lottie-confused" />
        </div>
      </div>
      </>
      ),
    },
    { title: "What To Bring?", content: (
      <>
      <div className="hackathon-container">
        <div className="hackathon-list">
          <p>Based on where the hackathon will be, plan accordingly! Here is a list of some items you should bring! Check what information is 
          posted about the hackathon you will be attending to figure out things like meals, sleeping arrangements, showers, and parking. A full
          schedule is usually posted for every hackathon.
          </p>
          <ul>
              <li>Phone + Laptop 💻</li>
              <li>Chargers ⚡(Outlets should be available)</li>
              <li>Headphones 🎧</li>
              <li>Clothing 👕(Pack as needed, for example for a 2 day hackathon, pack 2 days/nights worth)</li>
              <li>Money 💵</li>
              <li>Personal Hygiene 🪥(Please bring deodorant)</li>
              <li>Things to shower 🚿(Towel, soap, etc)</li>
              <li>Sleeping items 😴(Pillow, blanket, etc)</li>
              <li>Jacket/hoodie 🥶</li>
              <li>Medications 💊</li>
              <li>Notebook/pencils 📒</li>
              <li>Photo ID 😀(Driver's license, student ID card, etc)</li>
          </ul>
        </div>
      </div>
      </>
      ),
    },
    { title: "Goals To Set For Yourself!", content: (
      <>
      <div className="hackathon-container">
        <div className="hackathon-section">
          <ul>
              <li>Attend a workshop!</li>
              <li>Meet new people!</li>
              <li>Learn a new technology or tool!</li>
              <li>Contribute to a project, even in a small way!</li>
              <li>Ask a mentor for help or feedback!</li>
              <li>Present your project with confidence!</li>
              <li>Stay open to new ideas and challenges!</li>
              <li>Manage your time effectively and set small milestones!</li>
              <li>Take breaks and enjoy the experience!</li>
              <li>Attend a social event!</li>
              <li>Have fun!</li>
            </ul>
            <Lottie animationData={goals} className="lottie-goals" />
        </div>
      </div>
      </>
      ),
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, 
  };

  return (
    <div className="guide-page">
      {sections.map((section, index) => (
        <motion.section
          key={index}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="section"
        >
          <h2>{section.title}</h2>
          {section.content}
        </motion.section>
      ))}
    </div>
  );
};

export default GuidePage;
