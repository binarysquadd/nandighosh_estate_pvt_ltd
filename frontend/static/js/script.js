const API_URL = "http://localhost:8080/properties"; // adjust if needed

// Load all properties
function loadProperties() {
  $.get(API_URL, function (data) {
    $("#propertyList").empty();
    data.forEach((p) => {
      $("#propertyList").append(`
        <li class="flex justify-between items-center border rounded p-3">
          <div>
            <p class="font-semibold">${p.Name}</p>
            <p class="text-sm text-gray-600">₹${p.Price}</p>
          </div>
          <div class="space-x-2">
            <button class="editBtn bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-id="${p.ID}" data-name="${p.Name}" data-price="${p.Price}">Edit</button>
            <button class="deleteBtn bg-red-500 text-white px-2 py-1 rounded text-sm" data-id="${p.ID}">Delete</button>
          </div>
        </li>
      `);
    });
  });
}

// Add new property
$("#propertyForm").on("submit", function (e) {
  e.preventDefault();
  const formData = {
    name: $(this).find("[name=name]").val(),
    price: parseInt($(this).find("[name=price]").val(), 10),
  };
  $.ajax({
    url: API_URL,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function () {
      loadProperties();
      $("#propertyForm")[0].reset();
    },
  });
});

// Delete property
$(document).on("click", ".deleteBtn", function () {
  const id = $(this).data("id");
  $.ajax({
    url: API_URL + "/" + id,
    method: "DELETE",
    success: function () {
      loadProperties();
    },
  });
});

// Edit property (simple prompt demo)
$(document).on("click", ".editBtn", function () {
  const id = $(this).data("id");
  const oldName = $(this).data("name");
  const oldPrice = $(this).data("price");

  const newName = prompt("Enter new name:", oldName);
  const newPrice = prompt("Enter new price:", oldPrice);

  if (newName && newPrice) {
    $.ajax({
      url: API_URL + "/" + id,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ name: newName, price: parseInt(newPrice, 10) }),
      success: function () {
        loadProperties();
      },
    });
  }
});

// Init
$(document).ready(loadProperties);
