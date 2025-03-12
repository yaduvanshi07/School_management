const API_BASE_URL = "https://yaduvanshi07.github.io/School_management/";
async function addSchool() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const messageElement = document.getElementById("addMessage");

    if (!name || !address || !latitude || !longitude) {
        messageElement.innerText = "⚠️ Please fill all fields.";
        messageElement.className = "error";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/addSchool`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude) })
        });

        const data = await response.json();
        if (response.ok) {
            messageElement.innerText = "✅ School added successfully!";
            messageElement.className = "success";
            document.getElementById("name").value = "";
            document.getElementById("address").value = "";
            document.getElementById("latitude").value = "";
            document.getElementById("longitude").value = "";
        } else {
            messageElement.innerText = "❌ " + data.error;
            messageElement.className = "error";
        }
    } catch (error) {
        messageElement.innerText = "❌ Error adding school";
        messageElement.className = "error";
    }
}

async function listSchools() {
    const userLatitude = document.getElementById("userLatitude").value;
    const userLongitude = document.getElementById("userLongitude").value;
    const messageElement = document.getElementById("listMessage");

    if (!userLatitude || !userLongitude) {
        messageElement.innerText = "⚠️ Please enter your location.";
        messageElement.className = "error";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/listSchools?latitude=${userLatitude}&longitude=${userLongitude}`);
        const schools = await response.json();

        if (response.ok) {
            messageElement.innerText = "";
            const tableBody = document.querySelector("#schoolTable tbody");
            tableBody.innerHTML = "";

            schools.forEach((school) => {
                const row = `<tr>
                    <td>${school.id}</td>
                    <td>${school.name}</td>
                    <td>${school.address}</td>
                    <td>${school.latitude}</td>
                    <td>${school.longitude}</td>
                    <td>${school.distance.toFixed(2)} km</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        } else {
            messageElement.innerText = "❌ " + schools.error;
            messageElement.className = "error";
        }
    } catch (error) {
        messageElement.innerText = "❌ Error fetching schools";
        messageElement.className = "error";
    }
}
