const fs = require('fs');

const talks = [
  {
    "id": "talk1",
    "title": "Introduction to AI in Edge Devices",
    "speakers": ["Alice Johnson"],
    "category": ["AI", "Edge Computing"],
    "duration_minutes": 60,
    "description": "An overview of the challenges and opportunities of deploying AI models on edge devices, focusing on practical applications and future trends."
  },
  {
    "id": "talk2",
    "title": "Modern JavaScript Frameworks",
    "speakers": ["Bob Williams", "Carol Davis"],
    "category": ["Web Development", "JavaScript"],
    "duration_minutes": 60,
    "description": "A deep dive into the latest trends and best practices in frontend JavaScript frameworks like React, Vue, and Angular, including performance tips."
  },
  {
    "id": "talk3",
    "title": "Cloud Native Architectures with Kubernetes",
    "speakers": ["David Miller"],
    "category": ["Cloud", "DevOps", "Kubernetes"],
    "duration_minutes": 60,
    "description": "Exploring scalable and resilient cloud-native patterns using Kubernetes for container orchestration, service mesh, and serverless functions."
  },
  {
    "id": "talk4",
    "title": "Secure Coding Practices in a DevOps World",
    "speakers": ["Eve Brown"],
    "category": ["Security", "DevOps", "Software Engineering"],
    "duration_minutes": 60,
    "description": "Best practices for writing secure code and preventing common vulnerabilities throughout the entire software development lifecycle."
  },
  {
    "id": "talk5",
    "title": "Data Visualization with D3.js and Beyond",
    "speakers": ["Frank White"],
    "category": ["Data Science", "JavaScript", "Visualization"],
    "duration_minutes": 60,
    "description": "Creating interactive and compelling data visualizations using the D3.js library, with a look at newer tools and techniques."
  },
  {
    "id": "talk6",
    "title": "The Future of WebAssembly and Beyond",
    "speakers": ["Grace Green"],
    "category": ["Web Development", "Performance", "Future Tech"],
    "duration_minutes": 60,
    "description": "A look into how WebAssembly is changing the landscape of web applications and beyond, enabling high-performance code in the browser."
  }
];

const css = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
    background: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    text-align: center;
    color: #0056b3;
    margin-bottom: 30px;
  }
  .search-container {
    margin-bottom: 30px;
    text-align: center;
  }
  .search-container input[type="text"] {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 60%;
    max-width: 300px;
    margin-right: 10px;
    font-size: 16px;
  }
  .search-container button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  .search-container button:hover {
    background-color: #0056b3;
  }
  .schedule-item {
    background-color: #e9ecef;
    border-left: 5px solid #007bff;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 5px;
  }
  .schedule-item.lunch {
    border-left: 5px solid #28a745;
    background-color: #d4edda;
  }
  .schedule-item h2 {
    margin-top: 0;
    color: #0056b3;
  }
  .schedule-item.lunch h2 {
    color: #28a745;
  }
  .schedule-item p {
    margin: 5px 0;
  }
  .schedule-item .time {
    font-weight: bold;
    color: #555;
  }
  .schedule-item .speakers, .schedule-item .category {
    font-size: 0.9em;
    color: #666;
  }
  .schedule-item .description {
    margin-top: 10px;
    line-height: 1.5;
  }
  .no-results {
    text-align: center;
    color: #666;
    font-size: 1.1em;
    padding: 20px;
  }
`;

const js = `
  const talksData = ${JSON.stringify(talks, null, 2)};
  let filteredTalks = [...talksData];

  document.addEventListener('DOMContentLoaded', () => {
    renderSchedule(filteredTalks);
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  });

  function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm === '') {
      filteredTalks = [...talksData];
    } else {
      filteredTalks = talksData.filter(talk =>
        talk.category.some(cat => cat.toLowerCase().includes(searchTerm)) ||
        talk.title.toLowerCase().includes(searchTerm) ||
        talk.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm))
      );
    }
    renderSchedule(filteredTalks);
  }

  function renderSchedule(currentTalks) {
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = ''; // Clear previous schedule

    let currentTime = new Date();
    currentTime.setHours(10, 0, 0); // Start at 10:00 AM

    const scheduleItems = [];
    const totalTalks = talksData.length; // Use original talksData length for overall structure

    let talkIndex = 0;
    for (let i = 0; i < totalTalks + 1; i++) { // +1 for lunch break
      if (i === Math.floor(totalTalks / 2)) { // Insert lunch break roughly in the middle
        scheduleItems.push({
          type: 'lunch',
          startTime: new Date(currentTime),
          endTime: new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour lunch
        });
        currentTime.setMinutes(currentTime.getMinutes() + 60); // Advance for lunch
      }

      if (talkIndex < talksData.length) {
        const talk = talksData[talkIndex]; // Get talk from original data to maintain order
        const isVisible = currentTalks.includes(talk); // Check if this talk is in the filtered list

        scheduleItems.push({
          type: 'talk',
          talk: talk,
          startTime: new Date(currentTime),
          endTime: new Date(currentTime.getTime() + talk.duration_minutes * 60 * 1000),
          isVisible: isVisible // Mark if this talk should be displayed based on filter
        });
        currentTime.setMinutes(currentTime.getMinutes() + talk.duration_minutes); // Advance for talk
        talkIndex++;

        if (talkIndex < talksData.length) { // Add transition unless it's the very last talk slot
          currentTime.setMinutes(currentTime.getMinutes() + 10); // 10 min transition
        }
      }
    }

    if (currentTalks.length === 0 && document.getElementById('searchInput').value !== '') {
      scheduleContainer.innerHTML = '<div class="no-results">No talks found matching your search.</div>';
      return;
    }

    scheduleItems.forEach(item => {
      if (item.type === 'lunch') {
        const lunchDiv = document.createElement('div');
        lunchDiv.classList.add('schedule-item', 'lunch');
        lunchDiv.innerHTML = \`
          <p class="time">\\\${item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - \\\${item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <h2>Lunch Break</h2>
          <p>Enjoy a delicious meal and network with fellow attendees!</p>
        \`;
        scheduleContainer.appendChild(lunchDiv);
      } else if (item.type === 'talk' && item.isVisible) {
        const talk = item.talk;
        const talkDiv = document.createElement('div');
        talkDiv.classList.add('schedule-item');
        talkDiv.innerHTML = \`
          <p class="time">\\\${item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - \\\${item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <h2>\\\${talk.title}</h2>
          <p class="speakers"><strong>Speakers:</strong> \\\${talk.speakers.join(', ')}</p>
          <p class="category"><strong>Category:</strong> \\\${talk.category.join(', ')}</p>
          <p class="description">\\\${talk.description}</p>
        \`;
        scheduleContainer.appendChild(talkDiv);
      }
    });
  }
`;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Event Schedule</title>
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="container">
    <h1>Tech Event Day: Schedule</h1>

    <div class="search-container">
      <input type="text" id="searchInput" placeholder="Search by category, title, or speaker...">
      <button id="searchButton">Search</button>
    </div>

    <div id="schedule">
      <!-- Schedule items will be dynamically inserted here by JavaScript -->
    </div>
  </div>

  <script>
    ${js}
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('index.html has been generated successfully!');