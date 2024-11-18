const patientForm = document.getElementById("patient-form");
const patientList = document.getElementById("patient-list");
const bedsContainer = document.getElementById("beds");
const departmentLabel = document.getElementById("department-label");
const nextButton = document.getElementById("next-department");
const prevButton = document.getElementById("prev-department");

const patientDetails = document.getElementById("patient-details");
const detailsName = document.getElementById("details-name");
const detailsDiagnosis = document.getElementById("details-diagnosis");
const detailsDepartment = document.getElementById("details-department");
const detailsWard = document.getElementById("details-ward");
const detailsBed = document.getElementById("details-bed");
const detailsArrival = document.getElementById("details-arrival");
const detailsDischarge = document.getElementById("details-discharge");
const dischargeSection = document.getElementById("discharge-section");
const dischargeDateInput = document.getElementById("discharge-date");
const dischargeButton = document.getElementById("discharge-button");

let selectedPatient = null;

const departments = {
    "Кардіологія": generateBeds(),
    "Неврологія": generateBeds(),
    "Хірургія": generateBeds(),
};

let departmentOrder = ["Кардіологія", "Неврологія", "Хірургія"];
let currentDepartmentIndex = 0;

function generateBeds() {
    return Array.from({ length: 4 }, (_, wardIndex) => ({
        name: `Палата ${wardIndex + 1}`,
        beds: Array.from({ length: 5 }, (_, bedIndex) => ({
            id: `Палата ${wardIndex + 1}, Ліжко ${bedIndex + 1}`,
            occupied: false,
            patient: null,
        })),
    }));
}

function renderBeds(departmentName) {
    const wards = departments[departmentName];
    bedsContainer.innerHTML = "";
    wards.forEach((ward) => {
        const wardDiv = document.createElement("div");
        wardDiv.classList.add("ward");
        wardDiv.innerHTML = `<h3>${ward.name}</h3>`;
        ward.beds.forEach((bed) => {
            const bedDiv = document.createElement("div");
            bedDiv.classList.add("bed");
            if (bed.occupied) {
                bedDiv.classList.add("occupied");
                bedDiv.dataset.info = `${bed.patient.name}, ${bed.patient.diagnosis}`;
            }
            bedDiv.textContent = bed.id.split(", ")[1];
            bedDiv.addEventListener("click", () => {
                if (bed.occupied) {
                    updatePatientDetails(bed.patient);
                }
            });
            wardDiv.appendChild(bedDiv);
        });
        bedsContainer.appendChild(wardDiv);
    });
}

function updatePatientDetails(patient) {
    selectedPatient = patient;
    detailsName.textContent = `Ім'я: ${patient.name}`;
    detailsDiagnosis.textContent = `Діагноз: ${patient.diagnosis}`;
    detailsDepartment.textContent = `Відділення: ${patient.department}`;
    detailsWard.textContent = `Палата: ${patient.ward}`;
    detailsBed.textContent = `Ліжко: ${patient.bed}`;
    detailsArrival.textContent = `Дата прибуття: ${patient.arrivalDate}`;

    if (patient.dischargeDate) {
        dischargeSection.classList.add("hidden");
        detailsDischarge.classList.remove("hidden");
        detailsDischarge.textContent = `Дата виписки: ${patient.dischargeDate}`;
    } else {
        dischargeSection.classList.remove("hidden");
        detailsDischarge.classList.add("hidden");
    }

    patientDetails.classList.remove("hidden");
}

function handlePatientClick(patient) {
    updatePatientDetails(patient);

    if (!patient.dischargeDate) {
        dischargeButton.onclick = () => {
            const dischargeDate = dischargeDateInput.value;
            if (!dischargeDate) {
                alert("Будь ласка, введіть дату виписки.");
                return;
            }
            patient.dischargeDate = dischargeDate;

            const ward = departments[patient.department][patient.ward - 1];
            const bed = ward.beds[patient.bed - 1];
            bed.occupied = false;
            bed.patient = null;

            updatePatientDetails(patient);
            renderBeds(departmentOrder[currentDepartmentIndex]);
        };
    }
}

patientForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("patient-name").value;
    const diagnosis = document.getElementById("diagnosis").value;
    const department = document.getElementById("department").value;
    const wardNum = parseInt(document.getElementById("ward").value);
    const bedNum = parseInt(document.getElementById("bed").value);
    const arrivalDate = document.getElementById("arrival-date").value;

    const ward = departments[department][wardNum - 1];
    const bed = ward.beds[bedNum - 1];

    if (bed && !bed.occupied) {
        const newPatient = {
            name,
            diagnosis,
            department,
            ward: wardNum,
            bed: bedNum,
            arrivalDate,
            dischargeDate: null,
        };

        bed.occupied = true;
        bed.patient = newPatient;

        const listItem = document.createElement("li");
        listItem.textContent = `${name} (${department})`;
        listItem.addEventListener("click", () => handlePatientClick(newPatient));
        patientList.appendChild(listItem);

        renderBeds(department);
        patientForm.reset();
    } else {
        alert("Ліжко вже зайняте.");
    }
});

nextButton.addEventListener("click", () => {
    currentDepartmentIndex =
        (currentDepartmentIndex + 1) % departmentOrder.length;
    const department = departmentOrder[currentDepartmentIndex];
    departmentLabel.textContent = department;
    renderBeds(department);
});

prevButton.addEventListener("click", () => {
    currentDepartmentIndex =
        (currentDepartmentIndex - 1 + departmentOrder.length) %
        departmentOrder.length;
    const department = departmentOrder[currentDepartmentIndex];
    departmentLabel.textContent = department;
    renderBeds(department);
});

renderBeds(departmentOrder[currentDepartmentIndex]);
