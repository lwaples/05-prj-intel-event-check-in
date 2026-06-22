// DOM Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");
const celebrationMessage = document.getElementById("celebrationMessage");

// Goal
const maxCount = 50;

// Load saved data
let count = parseInt(localStorage.getItem("attendanceCount"), 10) || 0;

let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};

let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Update UI on page load
updateDisplay();
renderAttendees();
if (count >= maxCount) {
  announceWinner();
}

// Form submit
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  const teamName = teamSelect.selectedOptions[0].text;

  // Update total attendance
  count++;

  // Update team count
  teamCounts[team]++;

  // Save attendee
  attendees.push({
    name,
    team: teamName,
  });

  // Greeting
  greeting.style.display = "block";
  greeting.classList.add("success-message");
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;

  // Save to local storage
  saveData();

  // Refresh screen
  updateDisplay();
  renderAttendees();

  // Check goal
  if (count >= maxCount) {
    announceWinner();
  }

  form.reset();
});

// Save data
function saveData() {
  localStorage.setItem("attendanceCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Update counters and progress bar
function updateDisplay() {
  attendeeCount.textContent = count;

  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  const percentage = (count / maxCount) * 100;
  progressBar.style.width = Math.min(percentage, 100) + "%";
}

// Render attendee list
function renderAttendees() {
  attendeeList.innerHTML = "";

  attendees.forEach(function (attendee) {
    const li = document.createElement("li");
    li.textContent = `${attendee.name} — ${attendee.team}`;
    attendeeList.appendChild(li);
  });
}

// Determine winning team
function announceWinner() {
  let winner = "Team Water Wise";
  let highest = teamCounts.water;

  if (teamCounts.zero > highest) {
    highest = teamCounts.zero;
    winner = "Team Net Zero";
  }

  if (teamCounts.power > highest) {
    highest = teamCounts.power;
    winner = "Team Renewables";
  }

  celebrationMessage.textContent = `🎊 Attendance Goal Reached! ${winner} wins with ${highest} attendees! 🎊`;
}
