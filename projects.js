const projects = [
    {
        name: "VR Safety Training",
        description: "Developed an immersive VR training simulation using Unity and C#.",
        link: "https://github.com/prasadvnv/VR-Safety-Training---Industrial-Oven"
    },
    {
        name: "Dual Axis Solar Tracker",
        description: "Built a dual axis solar tracker using Arduino and Python.",
        link: "https://github.com/prasadvnv/Dual-Axis-Solar-Tracker"
    },
    {
        name: "Inventory Bot with SLAM",
        description: "A mobile robot using ROS, Python, LiDAR, and camera sensors for inventory management.",
        link: "https://github.com/prasadvnv/Inventory-Bot"
    }
];

const projectList = document.getElementById("project-list");

projects.forEach(proj => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <a href="${proj.link}" target="_blank">View on GitHub</a>
    `;
    projectList.appendChild(card);
});