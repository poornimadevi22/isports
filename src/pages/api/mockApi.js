import { Message } from "@mui/icons-material";

let sportsData = [
  { id: 1, title: 'Lionel Messi', description: 'Soccer' },
  { id: 2, title: 'LeBron James', description: 'Basketball'},
  { id: 3, title: 'Roger Federer', description: 'Tennis' },
  { id: 4, title: 'Tom Brady', description: 'Football' },
  { id: 5, title: 'Cristiano Ronaldo', description: 'Soccer' },
  { id: 6, title: 'Usain Bolt', description: 'Athletics' },
  { id: 7, title: 'Serena Williams', description: 'Tennis' },
  { id: 8, title: 'Michael Phelps', description: 'Swimming' },
  { id: 9, title: 'Neymar Jr.', description: 'Soccer' },
  { id: 10, title: 'Kobe Bryant', description: 'Basketball' },
];
export const fetchSports = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sportsData);
    }, 500); // Simulate a network delay
  });
};

// Mock API for adding a sport
export const addSport = async (sport) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      sport.id = sportsData.length + 1; // Assign a new ID
      sportsData.push(sport);
      resolve(sport);
    }, 500); // Simulate a network delay
  });
};

// Mock API for updating a sport
export const updateSport = async (id, sport) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = sportsData.findIndex(s => s.id === id);
      if (index !== -1) {
        sportsData[index] = { ...sportsData[index], ...sport };
        resolve(sportsData[index]);
      } else {
        resolve(null);
      }
    }, 500); // Simulate a network delay
  });
};

// Mock API for deleting a sport
export const deleteSport = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      sportsData = sportsData.filter(s => s.id !== id);
      resolve(id);
    }, 500); // Simulate a network delay
  });
};

let LoginData = 
  {
      "status": 'ok',
      "message": 'Login Successfully', 
    "user": {
      "id": 1,
      "role": "admin",
      "name": "Admin User",
      "email": "admin@example.com",
      "permissions": [
        "read",
        "write",
        "delete",
        "manage_users"
      ]
    },
    "auth": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWppdGhrdW1hciIsImVtYWlsIjoiYWppdGhrdW1hckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.vRpgoNLlI5naoEjiGP3qaLB16pWH9vh2e_wThLyRF4s",
      "expires": null
    }
  }
  
export const fetchLogin= async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(LoginData);
    }, 500);
  });
};
